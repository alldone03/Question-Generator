from models import Module, Score

from config.database import db
from flask import request, session, jsonify



def index(assessment_id):
    modules = (
        db.session.query(Module)
        .filter_by(assessment_id=assessment_id)
        .all()
    )
    user_id = session.get('user_id')

    result = []
    prev_score = None
    prev_open = False

    for i, m in enumerate(modules):
        # Ambil score terbaru untuk user & module ini
        latest_score = (
            db.session.query(Score)
            .filter_by(user_id=user_id, module_id=m.id)
            .order_by(Score.tanggal_pengerjaan.desc())
            .first()
        )

        score_val = latest_score.score if latest_score else 0
        feedback_val = latest_score.feedback if latest_score else ""

        # Logika is_openend
        if i == 0:
            is_openend = True
        else:
            # terbuka jika module sebelumnya terbuka dan score > 80
            is_openend = prev_open and (prev_score is not None and prev_score >= 80)

        # tambahan: puzzle ikut terbuka jika index ke-2 terbuka
        if m.jenis_module == "Puzzle" and len(result) > 1 and result[1]["is_openend"]:
            is_openend = True

        result.append({
            "id": m.id,
            "name": m.nama_module,
            "level": m.nama_module,
            "link_module_pembelajaran": "",
            "score": score_val,
            "feedback": feedback_val,
            "is_openend": is_openend,
            "jenis_module": m.jenis_module,
            "waktu_pengerjaan": m.waktu_pengerjaan,
            "percobaan_ke": latest_score.percobaan_ke if latest_score else 0,
            
        })

        # simpan state untuk loop berikutnya
        prev_score = score_val
        prev_open = is_openend

    return jsonify({"modules": result}), 200


    
