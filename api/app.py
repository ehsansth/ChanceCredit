from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define a Model for the Database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Auto-incrementing ID
    name = db.Column(db.String(80), nullable=False)
    employment_years = db.Column(db.Integer, nullable=False)
    incoming_cash = db.Column(db.Integer, nullable=False)
    outgoing_cash = db.Column(db.Integer, nullable=False)
    on_time_payments = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<User {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "employment_years": self.employment_years,
            "incoming_cash": self.incoming_cash,
            "outgoing_cash": self.outgoing_cash,
            "on_time_payments": self.on_time_payments,
        }

# Create the Database Tables
@app.before_first_request
def create_tables():
    db.create_all()

# Routes
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    user = User(
        name=data['name'],
        employment_years=data['employment_years'],
        incoming_cash=data['incoming_cash'],
        outgoing_cash=data['outgoing_cash'],
        on_time_payments=data['on_time_payments']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User added successfully", "user": user.to_dict()}), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

if __name__ == '__main__':
    app.run(debug=True)
