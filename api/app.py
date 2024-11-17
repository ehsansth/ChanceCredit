from flask import Flask, jsonify, request
from faker import Faker

app = Flask(__name__)
fake = Faker()

# Route to Calculate Score
@app.route('/calc_score', methods=['POST'])
def calc_score():
    data = request.json

    # Extract `name` and `ssn` from the request
    name = data.get('name')
    ssn = data.get('ssn')

    if not name or not ssn:
        return jsonify({"message": "Name and SSN are required"}), 400

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
    score = (
        employment_score * weights["employment_months"]
        + income_vs_expenses_score * weights["income_vs_expenses"]
        + on_time_payments_score * weights["on_time_payments"]
    )

    # Return the name and score
    return jsonify({"name": name, "score": round(score, 2)}), 200

if __name__ == '__main__':
    app.run(debug=True)
