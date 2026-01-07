import csv
from models import Assessment, Module, Question, Option
from config.database import db


def seed_from_csv(file_path):
    assessment_cache = {}
    module_cache = {}

    with open(file_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        

        for row in reader:
            print(row)
            # =========================
            # 1. ASSESSMENT
            # =========================
            assessment_key = (row["Asesment"], row["Jabatan"])

            if assessment_key not in assessment_cache:
                assessment = Assessment(
                    nama_assessment=row["Asesment"],
                    jabatan=row["Jabatan"]
                )
                db.session.add(assessment)
                db.session.flush()
                assessment_cache[assessment_key] = assessment
            else:
                assessment = assessment_cache[assessment_key]

            # =========================
            # 2. MODULE
            # =========================
            level = row["Konteks Soal"]
            module_key = (assessment.id, level)

            if module_key not in module_cache:
                module = Module(
                    assessment_id=assessment.id,
                    nama_module=f"{level}",
                    level=level,
                    jenis_module="Pilihan Ganda",
                    waktu_pengerjaan=int(row["Waktu (detik)"]),
                    feedback=""
                )
                db.session.add(module)
                db.session.flush()
                module_cache[module_key] = module
            else:
                module = module_cache[module_key]

            # =========================
            # 3. QUESTION
            # =========================
            question = Question(
                module_id=module.id,
                soal=row["Soal"]
            )
            db.session.add(question)
            db.session.flush()

            # =========================
            # 4. OPTIONS
            # =========================
            opsi_map = {
                "A": row["A"],
                "B": row["B"],
                "C": row["C"],
                "D": row["D"],
            }

            for key, value in opsi_map.items():
                option = Option(
                    question_id=question.id,
                    opsi=value,
                    is_correct=(key == row["Jawaban"])
                )
                db.session.add(option)

        db.session.commit()
        module = Module(
                    assessment_id=1,
                    nama_module=f"Puzzle",
                    level="Mudah",
                    jenis_module="Puzzle",
                    waktu_pengerjaan=750
                )
    db.session.add(module)
    db.session.flush()
    db.session.commit()