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

# Initialize database tables directly
with app.app_context():
    db.create_all()

# Route to Calculate or Fetch Score
@app.route('/calc_score', methods=['POST'])
def calc_score():
    data = request.json

    # Extract `name` and `ssn` from the request
    name = data.get('name')
    ssn = data.get('ssn')

    if not name or not ssn:
        return jsonify({"message": "Name and SSN are required"}), 400

    # Check if the user already exists in the database
    existing_user = User.query.filter_by(ssn=ssn, name=name).first()
    if existing_user:
        return jsonify({
            "message": "User already exists",
            "user": existing_user.to_dict()
        }), 200

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

        return jsonify({
            "message": "Score calculated and stored successfully",
            "user": user.to_dict()
        }), 201

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 400

# Route to Retrieve All Users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Run on port 5001
