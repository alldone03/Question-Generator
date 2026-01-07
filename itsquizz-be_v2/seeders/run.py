import os
from dotenv import load_dotenv
from flask import Flask
from config.database import db
from models import *
from sqlalchemy import text
from seeders.soal_csv_seeder import seed_from_csv
from seeders.user_seeder import seed_users
from seeders.assessment_seeder import seed_assessments
from seeders.score_seeder import seed_scores

load_dotenv()

app = Flask(__name__)
# Use DATABASE_URL from environment or fallback to local
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/question_generator_db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


def truncate_tables():
    db.session.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))

    tables = [
        "learning_modules",
        "options",
        "questions",
        "scores",
        "modules",
        "assessments",
        "users",
        "answer_logs",
    ]

    for table in tables:
        try:
            db.session.execute(text(f"TRUNCATE TABLE {table};"))
        except Exception as e:
            print(f"Warning: Could not truncate {table}: {e}")


    db.session.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        print("Creating tables if they don't exist...")
        db.create_all()
        print("Truncating tables...")

        truncate_tables()
        print("Seeding users...")
        seed_users()
        # seed_assessments()
        
        csv_path = os.path.join(os.path.dirname(__file__), '..', 'ITS Quiz Soal - soal ALL.csv')
        print(f"Seeding from {csv_path}...")
        seed_from_csv(csv_path)
        
        # seed_from_csv(r'ITS Quiz Soal - Teknisi Sarpras.csv', assessment_id=1)
        print("Seeding scores...")
        seed_scores()
        print("Re-seeder selesai")
