import uvicorn
import pandas as pd
import re
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fuzzywuzzy import fuzz

# --- ML Imports for Auto-Categorization ---
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib

# --- Configuration ---
CONFIDENCE_THRESHOLD = 65.0
AMOUNT_TOLERANCE = 0.01
DATE_TOLERANCE_DAYS = 3
W_AMOUNT, W_NAME, W_DATE = 0.50, 0.40, 0.10

app = FastAPI(
    title="Intelligent Bank Reconciliation AI Service",
    description="An AI-powered service to match bank transactions, detect anomalies, and provide financial insights."
)

# --- Helper Functions ---

def normalize_text(text: str) -> str:
    if not isinstance(text, str): return ""
    text = text.lower()
    text = re.sub(r'\b(inc|llc|ltd|corp|co)\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def get_vendor_stats(df: pd.DataFrame) -> dict:
    if 'Vendor' not in df.columns or 'Amount' not in df.columns: return {}
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
    df.dropna(subset=['Amount'], inplace=True)
    stats = df.groupby('Vendor')['Amount'].agg(['count', 'mean']).reset_index()
    q1 = df.groupby('Vendor')['Amount'].quantile(0.25)
    q3 = df.groupby('Vendor')['Amount'].quantile(0.75)
    stats = stats.merge(q1.rename('Q1'), on='Vendor', how='left').merge(q3.rename('Q3'), on='Vendor', how='left')
    stats['IQR'] = stats['Q3'] - stats['Q1']
    stats['Lower_Bound'] = stats['Q1'] - 1.5 * stats['IQR']
    stats['Upper_Bound'] = stats['Q3'] + 1.5 * stats['IQR']
    return stats.set_index('Vendor').to_dict('index')

def calculate_match_confidence(bank_row: pd.Series, internal_row: pd.Series) -> float:
    is_amount_match = abs(abs(bank_row['Amount']) - abs(internal_row['Amount'])) <= AMOUNT_TOLERANCE
    amount_score = 1.0 if is_amount_match else 0.0
    name_score = fuzz.token_sort_ratio(normalize_text(bank_row['Description']), normalize_text(internal_row['Vendor'])) / 100.0
    date_diff_days = abs(bank_row['Date'] - internal_row['Date']).days
    date_score = max(0.0, 1.0 - (date_diff_days / (DATE_TOLERANCE_DAYS * 2)))
    confidence = (W_AMOUNT * amount_score) + (W_NAME * name_score) + (W_DATE * date_score)
    return round(confidence * 100, 2)

def clean_df_for_json(df: pd.DataFrame) -> pd.DataFrame:
    df_clean = df.copy()
    for col in df_clean.select_dtypes(include=['datetime64[ns]']).columns:
        df_clean[col] = df_clean[col].dt.strftime('%Y-%m-%d')
    return df_clean

# --- ML Model Training and Prediction Functions ---

MODEL_PATH = "trained_model/categorizer_model.joblib"

def load_or_train_categorizer(df: pd.DataFrame):
    """Loads a pre-trained model or trains a new one if it doesn't exist."""
    if os.path.exists(MODEL_PATH):
        print("Loading existing categorizer model.")
        return joblib.load(MODEL_PATH)
    
    print("No existing model found. Training a new categorizer.")
    if 'Category' not in df.columns or df['Category'].nunique() < 2:
        print("Not enough category data to train a model.")
        return None

    pipeline = Pipeline([
        ('vectorizer', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
        ('classifier', MultinomialNB(alpha=0.1))
    ])
    
    X = df['Vendor']
    y = df['Category']
    
    pipeline.fit(X, y)
        
    joblib.dump(pipeline, MODEL_PATH)
    print(f"New model trained and saved to {MODEL_PATH}")
    return pipeline

def auto_categorize(df: pd.DataFrame, model) -> pd.DataFrame:
    if model and 'Vendor' in df.columns:
        df['Predicted_Category'] = model.predict(df['Vendor'])
    else:
        df['Predicted_Category'] = df.get('Category', 'Uncategorized')
    return df

# --- Main AI Pipeline ---

def run_reconciliation_pipeline(bank_df: pd.DataFrame, internal_df: pd.DataFrame) -> dict:
    bank_df.columns = [col.strip().replace(' ', '_') for col in bank_df.columns]
    internal_df.columns = [col.strip().replace(' ', '_') for col in internal_df.columns]
    bank_df['Date'] = pd.to_datetime(bank_df['Date'], errors='coerce')
    internal_df['Date'] = pd.to_datetime(internal_df['Date'], errors='coerce')
    bank_df.dropna(subset=['Date'], inplace=True)
    internal_df.dropna(subset=['Date'], inplace=True)
    
    categorizer_model = load_or_train_categorizer(internal_df)
    internal_df = auto_categorize(internal_df, categorizer_model)

    vendor_stats = get_vendor_stats(internal_df.copy())
    
    matched_results, unmatched_bank, unmatched_internal = [], bank_df.copy(), internal_df.copy()
    
    for b_idx, bank_row in bank_df.iterrows():
        best_match_idx, best_confidence = None, CONFIDENCE_THRESHOLD
        for i_idx, internal_row in unmatched_internal.iterrows():
            confidence = calculate_match_confidence(bank_row, internal_row)
            if confidence > best_confidence:
                best_confidence, best_match_idx = confidence, i_idx
        
        if best_match_idx is not None:
            internal_match_row = unmatched_internal.loc[best_match_idx]
            matched_results.append({
                "bank": clean_df_for_json(pd.DataFrame([bank_row])).iloc[0].to_dict(),
                "internal": clean_df_for_json(pd.DataFrame([internal_match_row])).iloc[0].to_dict(),
                "confidence": best_confidence
            })
            unmatched_bank.drop(b_idx, inplace=True, errors='ignore')
            unmatched_internal.drop(best_match_idx, inplace=True, errors='ignore')

    anomalies_flagged = []
    for _, bank_row in unmatched_bank.iterrows():
        for vendor, stats in vendor_stats.items():
            if fuzz.partial_ratio(normalize_text(bank_row['Description']), normalize_text(vendor)) > 85:
                amount = bank_row['Amount']
                if not (stats.get('Lower_Bound', amount) <= amount <= stats.get('Upper_Bound', amount)):
                    anomalies_flagged.append({
                        "Date": bank_row['Date'].strftime('%Y-%m-%d'),
                        "Description": bank_row['Description'],
                        "Amount": amount,
                        "Flagged_Reason": f"Amount is outside the typical range for {vendor} (${stats.get('Lower_Bound', 0):.2f} to ${stats.get('Upper_Bound', 0):.2f})"
                    })
                break
    
    category_summary = {}
    if 'Predicted_Category' in internal_df.columns:
        internal_df['Amount'] = pd.to_numeric(internal_df['Amount'], errors='coerce')
        category_summary = internal_df.groupby('Predicted_Category')['Amount'].sum().abs().round(2).to_dict()

    return {
        "status": "success",
        "summary": { "total_bank_transactions": len(bank_df), "total_internal_records": len(internal_df), "matched_count": len(matched_results), "unmatched_bank_count": len(unmatched_bank), "unmatched_internal_count": len(unmatched_internal), "anomaly_count": len(anomalies_flagged) },
        "matched_transactions": matched_results,
        "anomalies_detected": anomalies_flagged,
        "unmatched_bank_transactions": clean_df_for_json(unmatched_bank).to_dict('records'),
        "unmatched_internal_records": clean_df_for_json(unmatched_internal).to_dict('records'),
        "category_summary": category_summary
    }

# --- API Endpoint ---
@app.post("/reconcile/")
async def reconcile_transactions(bank_statement: UploadFile = File(...), internal_records: UploadFile = File(...)):
    if not bank_statement.filename.endswith('.csv') or not internal_records.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Both files must be CSVs.")
    try:
        bank_df = pd.read_csv(bank_statement.file)
        internal_df = pd.read_csv(internal_records.file)
        report = run_reconciliation_pipeline(bank_df, internal_df)
        return JSONResponse(content=report)
    except Exception as e:
        print(f"An error occurred during reconciliation: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred. Error: {e}")

if __name__ == "__main__":
    uvicorn.run("reconciliation_api:app", host="0.0.0.0", port=8001, reload=True)

