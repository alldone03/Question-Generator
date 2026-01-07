import csv
from models import Module, Question, Option
from config.database import db


def seed_from_csv(file_path, assessment_id):
    modules_cache = {}
    # seed puzzle
    module = Module(
                    assessment_id=assessment_id,
                    nama_module=f"Puzzle",
                    level="Mudah",
                    jenis_module="Puzzle",
                    waktu_pengerjaan=750
                )
    db.session.add(module)
    db.session.flush()
    db.session.commit()

    with open(file_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for i,row in enumerate(reader):
            # if i > 2:
            #     continue
            level = row["modules"]

            # Buat module jika belum ada
            if level not in modules_cache:
                module = Module(
                    assessment_id=assessment_id,
                    nama_module=f"{level}",
                    level=level,
                    jenis_module="Pilihan Ganda",
                    waktu_pengerjaan=750,
                    feedback="",
                )
                db.session.add(module)
                db.session.flush()
                modules_cache[level] = module
            else:
                module = modules_cache[level]

            # Question
            question = Question(
                module_id=module.id,
                soal=row["Soal"]
            )
            db.session.add(question)
            db.session.flush()

            # Options
            opsi_map = {
                "A": row["A"],
                "B": row["B"],
                "C": row["C"],
                "D": row["D"]
            }

            for key, value in opsi_map.items():
                option = Option(
                    question_id=question.id,
                    opsi=value,
                    is_correct=(key == row["Jawaban"])
                )
                db.session.add(option)

        db.session.commit()
        
    