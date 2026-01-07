import os
from flask import Flask
from sqlalchemy import create_app
from config.database import db

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
db.init_app(app)

try:
    with app.app_context():
        with db.engine.connect() as conn:
            print("Successfully connected to the database!")
except Exception as e:
    print(f"Connection failed: {e}")
