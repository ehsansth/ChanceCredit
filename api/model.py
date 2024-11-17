import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import sqlite3

# Load data from SQLite
db_path = "instance/data.db"
try:
    conn = sqlite3.connect(db_path)
    print("Connected to the database successfully")

    # Load data into a pandas DataFrame
    query = "SELECT * FROM user"  # Adjust table name as needed
    df = pd.read_sql_query(query, conn)
    print(df.head())

    conn.close()
except sqlite3.OperationalError as e:
    print(f"Error connecting to the database: {e}")
    exit()

# Prepare data
X = df[['employment_months', 'incoming_cash', 'outgoing_cash', 'on_time_payments']]
y = df['score']

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Save Model
joblib.dump(model, "credit_score_model.pkl")
print("Model saved as credit_score_model.pkl")
