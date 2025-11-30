import csv
from datetime import datetime
from config.database import db
from models._2_course_model import Course
from models._3_courselevel_model import CourseLevel
from models._5_question_model import Question
from models._6_questionoption_model import QuestionOption

CSV_FILE = r"C:\Users\aldan\Desktop\Question-Generator\itsquizz-be\ITS Quiz Soal - Teknisi Sarpras.csv"   # sesuaikan lokasi file

def seed_course_questions(app):
    with app.app_context():
        print("Running Seeder...")

        with open(CSV_FILE, "r", encoding="utf-8") as file:
            reader = list(csv.reader(file))

        # Baris pertama: Jabatan -> Course Name
        first_row = reader[0][0].replace("Jabatan:", "").strip()
        course_name = first_row

        # Cek jika course sudah ada
        course = Course.query.filter_by(course_name=course_name).first()
        if not course:
            course = Course(course_name=course_name)
            db.session.add(course)
            db.session.commit()

        print(f"Course Created: {course.course_name}")

        # Lewatkan header baris kedua
        data_rows = reader[2:]

        level_cache = {}  # menyimpan level agar tidak duplicate

        for row in data_rows:
            if len(row) < 7 or not row[0]:
                continue

            level_name = row[0].strip()
            question_text = row[1].strip()
            opts = row[2:6]
            correct_letter = row[6].strip().upper()

            # Pastikan level tersedia
            if level_name not in level_cache:
                level = CourseLevel(course_id=course.id, level_name=level_name)
                db.session.add(level)
                db.session.commit()
                level_cache[level_name] = level
                print(f"Level Created: {level_name}")

            level_obj = level_cache[level_name]

            # Buat Question
            question = Question(
                level_id=level_obj.id,
                question_text=question_text,
                question_type="multiple_choice",
                created_at=datetime.now()
            )
            db.session.add(question)
            db.session.commit()

            # Mapping jawaban
            option_map = ["A", "B", "C", "D"]

            # Buat Options
            for i, text in enumerate(opts):
                option = QuestionOption(
                    question_id=question.id,
                    option_text=text,
                    is_correct=(option_map[i] == correct_letter)
                )
                db.session.add(option)

            db.session.commit()

            print(f"Inserted Question: {question_text[:40]}...")

        print("Seeder Completed Successfully!")
