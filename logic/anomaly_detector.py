# /logic/anomaly_detector.py
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

def detect_anomalies(df: pd.DataFrame) -> pd.DataFrame:
    """
    Identifies anomalous transactions based on amount patterns grouped by vendor.
    
    Args:
        df: DataFrame containing internal records (must have 'Vendor' and 'Amount' columns).
        
    Returns:
        The DataFrame with a new 'Is_Anomaly' boolean column.
    """
    
    # 1. Clean and Prepare Data
    # Use the absolute value of the amount for consistency
    df['Abs_Amount'] = df['Amount'].abs()
    df['Is_Anomaly'] = False  # Initialize anomaly flag
    
    # Identify Vendors with enough transactions to build a pattern
    MIN_TRANSACTIONS = 5 
    vendor_counts = df['Vendor'].value_counts()
    vendors_to_model = vendor_counts[vendor_counts >= MIN_TRANSACTIONS].index.tolist()
    
    # 2. Iterate and Apply Isolation Forest
    for vendor in vendors_to_model:
        # Get historical data for the current vendor
        vendor_data = df[df['Vendor'] == vendor].copy()
        
        # Isolation Forest is an unsupervised method, perfect for finding outliers
        # contamination='auto' lets the model estimate the proportion of outliers
        model = IsolationForest(
            contamination='auto', 
            random_state=42, 
            n_estimators=100
        )
        
        # Fit model on the single feature: absolute amount
        model.fit(vendor_data[['Abs_Amount']]) 
        
        # Predict anomalies: -1 for anomaly, 1 for normal
        predictions = model.predict(vendor_data[['Abs_Amount']])
        
        # Update the main DataFrame: Is_Anomaly = True where prediction is -1
        anomaly_indices = vendor_data[predictions == -1].index
        df.loc[anomaly_indices, 'Is_Anomaly'] = True
        
    # 3. Handle Low-Volume Vendors
    # Flag transactions from vendors with very few historical records as 'Suspicious' 
    # (or you can leave them as False, but flagging low-volume is a practical choice)
    low_volume_vendors = vendor_counts[vendor_counts < MIN_TRANSACTIONS].index
    df.loc[df['Vendor'].isin(low_volume_vendors), 'Is_Anomaly'] = False # For simplicity, we only rely on the model for now
    
    return df

# Example usage (for testing)
if __name__ == '__main__':
    # This sample data includes the $9500 anomaly for Office Depot from your problem description
    sample_data = {
        'Date': ['2025-03-01', '2025-03-05', '2025-03-10', '2025-03-15', '2025-03-18'],
        'Vendor': ['Office Depot', 'Office Depot', 'Office Depot', 'Office Depot', 'Office Depot'],
        'Amount': [100.00, 150.00, 125.50, 9500.00, 110.00],
        'Category': ['Supplies', 'Supplies', 'Supplies', 'Supplies', 'Supplies']
    }
    sample_df = pd.DataFrame(sample_data)
    
    # Run the detector (Note: this small sample may not train a reliable model, but shows the concept)
    results_df = detect_anomalies(sample_df)
    
    print("--- Anomaly Detection Results ---")
    print(results_df[['Vendor', 'Amount', 'Is_Anomaly']])