import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from faker import Faker

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
fake = Faker()

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define the User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Auto-incrementing ID
    name = db.Column(db.String(80), nullable=False)
    ssn = db.Column(db.String(11), unique=True, nullable=False)  # SSN in 'XXX-XX-XXXX' format
    employment_months = db.Column(db.Integer, nullable=False)
    incoming_cash = db.Column(db.Float, nullable=False)
    outgoing_cash = db.Column(db.Float, nullable=False)
    on_time_payments = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float, nullable=False)  # Store the calculated score

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

# Check if the database file exists and create tables if it doesn't
@app.before_request
def create_tables():
    # Check if the database file exists
    if not os.path.exists("data.db"):
        # Create tables if the database does not exist
        with app.app_context():
            db.create_all()

def calculate_payment_rate(score):
    if 300 <= score <= 579:
        return round(25 + (36 - 25) * ((score - 300) / 279), 2)  # Linear interpolation
    elif 580 <= score <= 669:
        return round(15 + (24 - 15) * ((score - 580) / 89), 2)
    elif 670 <= score <= 739:
        return round(10 + (14 - 10) * ((score - 670) / 69), 2)
    elif 740 <= score <= 799:
        return round(7 + (9 - 7) * ((score - 740) / 59), 2)
    elif 800 <= score:
        return 4  # Fixed rate for excellent scores

# Route to Calculate or Fetch Score and Determine Payment Plan
@app.route('/calc_score', methods=['POST'])
def calc_score():
    data = request.json

    # Extract `name`, `ssn`, and `item_price` from the request
    name = data.get('name')
    ssn = data.get('ssn')
    item_price = data.get('item_price')

    if not name or not ssn or item_price is None:
        return jsonify({"message": "Name, SSN, and item price are required"}), 400

    # Check if the user already exists in the database
    existing_user = User.query.filter_by(ssn=ssn).first()
    if existing_user:
        if existing_user.name != name:
            return jsonify({"message": "SSN already exists with a different name"}), 400
        score = existing_user.score
    else:
        # Generate dummy data
        employment_months = fake.random_int(min=0, max=120)  # Number of months employed in the past 10 years
        incoming_cash = fake.random_int(min=500, max=5000)
        outgoing_cash = fake.random_int(min=100, max=4000)
        on_time_payments = fake.random_int(min=0, max=24)

        # Score Calculation with Weighted Percentages
        weights = {
            "employment_months": 0.4,  # 40%
            "income_vs_expenses": 0.3,  # 30%
            "on_time_payments": 0.3   # 30%
        }

        # Normalize values to scale them appropriately
        employment_score = (employment_months / 120) * 100  # Normalize to a percentage
        income_vs_expenses_score = max(0, ((incoming_cash - outgoing_cash) / 5000) * 100)  # Normalize to a percentage
        on_time_payments_score = (on_time_payments / 24) * 100  # Normalize to a percentage

        # Weighted score calculation
        weighted_score = (
            employment_score * weights["employment_months"]
            + income_vs_expenses_score * weights["income_vs_expenses"]
            + on_time_payments_score * weights["on_time_payments"]
        )

        # Scale the weighted score to be within the range of 300-800
        score = 300 + (weighted_score / 100) * 500

        # Store the new user and score in the database
        try:
            user = User(
                name=name,
                ssn=ssn,
                employment_months=employment_months,
                incoming_cash=incoming_cash,
                outgoing_cash=outgoing_cash,
                on_time_payments=on_time_payments,
                score=round(score, 2)
            )
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            return jsonify({"message": f"Error: {str(e)}"}), 400

    # Calculate the payment rate
    payment_rate = calculate_payment_rate(score)

    # Calculate the total amount to be paid with interest
    total_amount = item_price * (1 + payment_rate / 100)

    # Calculate the first quarter payment
    first_quarter_payment = round(total_amount / 4, 2)

    return jsonify({
        "message": "Score calculated and stored successfully",
        "user": existing_user.to_dict() if existing_user else user.to_dict(),
        "payment_options": {
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
        },
        "interest_rate": f"{payment_rate}% based on a credit score of {score}"
    }), 201

# Route to Retrieve All Users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

if __name__ == '__main__':
    app.run(debug=True, port=5001)

# Route to Retrieve User by Name and SSN
@app.route('/get_user', methods=['GET'])
def get_user():
    # Get query parameters from the request
    name = request.args.get('name')
    ssn = request.args.get('ssn')

    if not name or not ssn:
        return jsonify({"message": "Name and SSN are required"}), 400

    # Retrieve user from the database
    user = User.query.filter_by(name=name, ssn=ssn).first()

    if user:
        return jsonify({
            "message": "User found",
            "user": user.to_dict()
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404
