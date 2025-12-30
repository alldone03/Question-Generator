
from flask import request,session, jsonify

from config.database import db
from models.assessment import Assessment
from models.user import User
from models.module import Module
from models.score import Score


def index():
    # Ambil user dari session
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"assessments": []}), 200

    user = db.session.get(User, user_id)

    # Ambil semua assessment sesuai jabatan user
    assessments = (
        db.session.query(Assessment)
        .filter_by(jabatan=user.jabatan)
        .all()
    )

    result = []
    for a in assessments:
        # Ambil semua module dari assessment ini
        modules = (
            db.session.query(Module)
            .filter_by(assessment_id=a.id)
            .all()
        )

        total_score = 0
        for m in modules:
            latest_score = (
                db.session.query(Score)
                .filter_by(user_id=user_id, module_id=m.id)
                .order_by(Score.tanggal_pengerjaan.desc())
                .first()
            )
            if latest_score:
                total_score += latest_score.score

        # Hitung progress: asumsi 320 = 100%
        progress = min(int((total_score / 320) * 100), 100)

        result.append({
            "id": a.id,
            "name": a.nama_assessment,
            "progress": progress,
        })

    return jsonify({"assessments": result}), 200
