from flask import Flask
from config.database import db
from models import *
from sqlalchemy import text
from seeders.question_csv_seeder import seed_from_csv
from seeders.user_seeder import seed_users
from seeders.assessment_seeder import seed_assessments
from seeders.score_seeder import seed_scores


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost:3306/question_generator_db"
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
    ]

    for table in tables:
        db.session.execute(text(f"TRUNCATE TABLE {table};"))

    db.session.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    db.session.commit()


with app.app_context():
    truncate_tables()
    seed_users()
    seed_assessments()
    seed_from_csv(r'C:\Users\aldan\Desktop\Question-Generator\itsquizz-be_v2\ITS Quiz Soal - Teknisi Sarpras.csv',assessment_id=1)
    seed_scores()
    print("Re-seeder selesai")