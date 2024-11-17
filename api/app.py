import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from faker import Faker
import joblib
import pandas as pd

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)
fake = Faker()

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Load the saved model
model_path = "credit_score_model.pkl"
try:
    credit_score_model = joblib.load(model_path)
    print(f"Model loaded from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    credit_score_model = None

# Define the User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    ssn = db.Column(db.String(11), unique=True, nullable=False)
    employment_months = db.Column(db.Integer, nullable=False)
    incoming_cash = db.Column(db.Float, nullable=False)
    outgoing_cash = db.Column(db.Float, nullable=False)
    on_time_payments = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<User {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "ssn": self.ssn,
            "employment_months": self.employment_months,
            "incoming_cash": self.incoming_cash,
            "outgoing_cash": self.outgoing_cash,
            "on_time_payments": self.on_time_payments,
            "score": self.score,
        }

# Create database tables if they don't exist
@app.before_request
def create_tables():
    if not os.path.exists("data.db"):
        with app.app_context():
            db.create_all()

# Helper function to calculate payment rate based on credit score
def calculate_payment_rate(score):
    if 300 <= score <= 579:
        return round(25 + (36 - 25) * ((score - 300) / 279), 2)
    elif 580 <= score <= 669:
        return round(15 + (24 - 15) * ((score - 580) / 89), 2)
    elif 670 <= score <= 739:
        return round(10 + (14 - 10) * ((score - 670) / 69), 2)
    elif 740 <= score <= 799:
        return round(7 + (9 - 7) * ((score - 740) / 59), 2)
    elif 800 <= score:
        return 4  # Fixed rate for excellent scores

# Helper function to generate a credit score using the model
def generate_score_with_model(employment_months, incoming_cash, outgoing_cash, on_time_payments):
    if not credit_score_model:
        raise ValueError("Model not loaded. Cannot generate score.")
    features = pd.DataFrame([{
        "employment_months": employment_months,
        "incoming_cash": incoming_cash,
        "outgoing_cash": outgoing_cash,
        "on_time_payments": on_time_payments
    }])
    return round(credit_score_model.predict(features)[0], 2)

# Function to create a new user with a generated score
def create_new_user(name, ssn):
    employment_months = fake.random_int(min=0, max=120)
    incoming_cash = fake.random_int(min=500, max=5000)
    outgoing_cash = fake.random_int(min=100, max=4000)
    on_time_payments = fake.random_int(min=0, max=24)

    # Generate a credit score using the model
    try:
        score = generate_score_with_model(employment_months, incoming_cash, outgoing_cash, on_time_payments)
    except ValueError as e:
        print(f"Error generating score: {e}")
        score = 300  # Default score if model fails

    user = User(
        name=name,
        ssn=ssn,
        employment_months=employment_months,
        incoming_cash=incoming_cash,
        outgoing_cash=outgoing_cash,
        on_time_payments=on_time_payments,
        score=score
    )
    db.session.add(user)
    db.session.commit()
    return score

# Helper function to generate payment options
def generate_payment_options(total_amount, first_quarter_payment):
    return {
        "4_week_plan": {
            "total_weeks": 4,
            "weekly_payment": round((total_amount - first_quarter_payment) / 4, 2),
            "first_quarter_payment": first_quarter_payment
        },
        "8_week_plan": {
            "total_weeks": 8,
            "weekly_payment": round((total_amount - first_quarter_payment) / 8, 2),
            "first_quarter_payment": first_quarter_payment
        },
        "12_week_plan": {
            "total_weeks": 12,
            "weekly_payment": round((total_amount - first_quarter_payment) / 12, 2),
            "first_quarter_payment": first_quarter_payment
        }
    }

# Route to calculate or fetch score and determine payment plan
@app.route('/calc_score', methods=['POST'])
def calc_score():
    data = request.json
    user_id = data.get('id')
    item_price = data.get('item_price')

    if user_id:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        payment_rate = calculate_payment_rate(user.score)
        total_amount = item_price * (1 + payment_rate / 100)
        first_quarter_payment = round(total_amount / 4, 2)

        return jsonify({
            "message": "User data retrieved",
            "user": user.to_dict(),
            "payment_options": generate_payment_options(total_amount, first_quarter_payment),
            "interest_rate": f"{payment_rate}%"
        }), 200

    # Validate required fields
    name = data.get('name')
    ssn = data.get('ssn')
    item_price = data.get('item_price')

    if not name or not ssn or item_price is None:
        return jsonify({"message": "Name, SSN, and item price are required"}), 400

    # Check for existing user
    existing_user = User.query.filter_by(ssn=ssn).first()
    if existing_user:
        if existing_user.name != name:
            return jsonify({"message": "SSN already exists with a different name"}), 400
        score = existing_user.score
    else:
        score = create_new_user(name, ssn)

    payment_rate = calculate_payment_rate(score)
    total_amount = item_price * (1 + payment_rate / 100)
    first_quarter_payment = round(total_amount / 4, 2)

    return jsonify({
        "message": "Score calculated and stored successfully",
        "user": existing_user.to_dict() if existing_user else User.query.filter_by(ssn=ssn).first().to_dict(),
        "payment_options": generate_payment_options(total_amount, first_quarter_payment),
        "interest_rate": f"{payment_rate}%"
    }), 201

# Route to retrieve all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# Route to retrieve user by ID
@app.route('/get_user', methods=['POST'])
def get_user():
    data = request.json
    user_id = data.get('id')
    if not user_id:
        return jsonify({"message": "Invalid user ID provided"}), 400

    user = User.query.filter_by(id=user_id).first()
    if user:
        return jsonify({"message": "User found", "user": user.to_dict()}), 200
    else:
        return jsonify({"message": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001)
