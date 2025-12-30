from models import User, Module, Score
from config.database import db
from datetime import datetime


def seed_scores():
    user = User.query.filter_by(email="teknisi@mail.com").first()
    if not user:
        print("User teknisi tidak ditemukan")
        return

    modules = Module.query.all()
    if not modules:
        print("Module belum ada")
        return

    scores = []

    for i, module in enumerate(modules, start=1):
        for j,number in enumerate(range(1, 4), start=1):  # 3 percobaan per module
            scores.append(
                Score(
                    user_id=user.id,
                    module_id=module.id,
                    score=60 + (5-i) * 5,
                    sisa_waktu_pengerjaan=120,
                    percobaan_ke=number,
                    tanggal_pengerjaan=datetime.now(),
                    is_feedback_given=True,
                )
            )

    db.session.bulk_save_objects(scores)
    db.session.commit()
    print("Seeder scores selesai")