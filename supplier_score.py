import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import sys

# Load your data
data = pd.read_csv('C:\\Users\\suban\\OneDrive\\Desktop\\\\Walmart-products- (1).csv')

def rank_suppliers(category_name):
    # Filter data for the specific category and create a copy to avoid chained assignment warnings
    filtered_data = data[data['category_name'] == category_name].copy()

    if filtered_data.empty:
        print(f"No data found for category: {category_name}")
        return pd.DataFrame()  # Return an empty DataFrame if no data is found

    # Handle missing or invalid data before training the model
    filtered_data['final_price'] = filtered_data['final_price'].replace([np.inf, -np.inf], np.nan)
    # Use assignment instead of inplace to avoid chained assignment warnings
    filtered_data['final_price'] = filtered_data['final_price'].fillna(filtered_data['final_price'].mean())

    # Check if there are any NaNs left in final_price after filling
    if filtered_data['final_price'].isnull().any():
        print("Warning: There are still NaNs in 'final_price' after filling.")
        return pd.DataFrame()  # Return an empty DataFrame if NaNs are still present

    # Feature Engineering - Create new features based on the dataset
    filtered_data['inverse_final_price'] = 1 / filtered_data['final_price']

    # Define features and target
    X = filtered_data[['final_price', 'inverse_final_price']]  # Features
    y = filtered_data['inverse_final_price']  # Target variable

    # Check for NaNs in features and target
    if X.isnull().values.any() or y.isnull().values.any():
        print("Warning: Features or target contain NaNs.")
        return pd.DataFrame()  # Return an empty DataFrame if NaNs are present

    # Ensure we have enough samples to split
    if len(X) < 2:  # At least 1 sample for train and test
        print("Not enough data to split for training and testing.")
        return pd.DataFrame()  # Return an empty DataFrame if not enough samples

    # Split data into train and test sets
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    except ValueError as e:
        print(f"Error during train_test_split: {e}")
        return pd.DataFrame()  # Return an empty DataFrame on error

    # Train the RandomForest model
    model = RandomForestRegressor(random_state=42)
    model.fit(X_train, y_train)

    # Predict scores for suppliers
    filtered_data['predicted_score'] = model.predict(X)

    # Sort suppliers by predicted score (higher is better)
    sorted_suppliers = filtered_data.sort_values(by='predicted_score', ascending=False)

    # Return the top 5 ranked suppliers
    return sorted_suppliers[['seller', 'predicted_score', 'category_name']].head(5)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a category name.")
        sys.exit(1)

    category_name = sys.argv[1]  # Get the category name from the command line argument

    # Call the ranking function
    supplier_rankings = rank_suppliers(category_name)
    
    # Check if supplier_rankings is not empty before printing
    if not supplier_rankings.empty:
        # Convert the rankings to JSON and print (this will be returned to Node.js)
        print(supplier_rankings.to_json(orient="records"))
    else:
        # Print an empty JSON array if no rankings are found
        print("[]")
