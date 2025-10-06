import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib # Used for saving/loading the trained model (persisting the AI model)
import os

# --- PATH FIX: Use absolute path relative to the script's location ---
# Get the absolute path of the directory containing this script (e.g., /Bank/logic)
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
MODEL_SUBDIR = 'trained_models'

# Define the expected path for the saved model file relative to the /logic folder
MODEL_DIR = os.path.join(BASE_DIR, MODEL_SUBDIR)
MODEL_FILENAME = 'categorizer_pipeline.joblib'
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)
# --- END PATH FIX ---

def train_and_save_categorizer(df_internal: pd.DataFrame):
    """
    Trains a new category classification model (ML-based classification) 
    using Vendor names and saves it to disk for future use.
    """
    
    # 1. Prepare clean data for training
    # Use only internal records that have both Vendor and a known Category
    df_clean = df_internal.dropna(subset=['Vendor', 'Category']).copy()
    
    # Ensure there is enough data to train
    if df_clean.empty or df_clean['Category'].nunique() < 2:
        # Return a simple fallback model if data is insufficient
        print("Warning: Insufficient data for categorization model training. Using fallback.")
        return None 
        
    X = df_clean['Vendor'].astype(str)
    y = df_clean['Category']

    # 2. Define the ML pipeline: Text Vectorizer -> Classifier
    # TfidfVectorizer converts vendor names (text) into numerical features
    # Logistic Regression is a robust classifier for multi-class problems
    category_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=1000)),
        ('classifier', LogisticRegression(random_state=42, max_iter=1000))
    ])
    
    # 3. Train the model
    category_pipeline.fit(X, y)
    
    # 4. Save the model (required for "Learn from user corrections")
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(category_pipeline, MODEL_PATH)
    print(f"Categorizer model saved to {MODEL_PATH}")
    
    return category_pipeline

def load_or_train_categorizer(df_internal: pd.DataFrame):
    """
    Checks for a saved model file. Loads it if found, otherwise trains and saves a new one.
    """
    # Attempt to load the model first
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f"Categorizer model loaded from {MODEL_PATH}")
            return model
        except Exception as e:
            print(f"Error loading model: {e}. Retraining...")
            
    # If loading fails or file doesn't exist, train a new model
    return train_and_save_categorizer(df_internal)

def auto_categorize(df_transactions: pd.DataFrame, model_pipeline: Pipeline) -> pd.DataFrame:
    """
    Applies the trained model to predict categories and confidence scores.
    """
    
    df = df_transactions.copy()
    
    if model_pipeline is None:
        df['Predicted_Category'] = df['Category'] if 'Category' in df.columns else 'Uncategorized'
        df['Category_Confidence'] = 0.0
        return df

    # Predict categories using the trained pipeline
    predictions = model_pipeline.predict(df['Vendor'].astype(str))
    
    # Calculate confidence (probability score) for the prediction
    # This gives us the confidence required for the report
    probabilities = model_pipeline.predict_proba(df['Vendor'].astype(str))
    max_probs = np.max(probabilities, axis=1) # Get the highest probability for each transaction
    
    df['Predicted_Category'] = predictions
    df['Category_Confidence'] = np.round(max_probs * 100, 2)
    
    return df

if __name__ == '__main__':
    # --- Example Usage for Testing the Categorizer ---
    
    # Mock data structure mirroring internal records for training
    mock_data = {
        'Date': ['2025-01-01', '2025-01-05', '2025-01-10', '2025-01-15', '2025-01-20'],
        'Vendor': ['Starbucks Corp', 'United Airlines', 'MSFT 365 Subscription', 'Office Depot Inc', 'Starbucks'],
        'Amount': [4.50, 450.00, 15.00, 100.00, 5.00],
        'Category': ['Meals & Entertainment', 'Travel', 'Software/Subscriptions', 'Office Supplies', 'Meals & Entertainment']
    }
    sample_train_df = pd.DataFrame(mock_data)
    
    # 1. Train and save the model
    model = train_and_save_categorizer(sample_train_df)
    
    # 2. Test prediction on new data (messy bank descriptions)
    new_transactions = pd.DataFrame({
        'Vendor': ['STARBKS 1004', 'United Airlines INC', 'M.S. Licensing Fee'],
        'Amount': [3.99, 500.00, 12.00]
    })
    
    results_df = auto_categorize(new_transactions, model)
    
    print("\n--- Auto-Categorization Test Results ---")
    print(results_df[['Vendor', 'Predicted_Category', 'Category_Confidence']])
