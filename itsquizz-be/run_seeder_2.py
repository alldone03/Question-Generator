from app import create_app
from seeder.seed_course_questions import seed_course_questions

app = create_app()

if __name__ == "__main__":
    seed_course_questions(app)