
from flask import request,session, jsonify

from config.database import db
from models.assessment import Assessment
from models.user import User


def index():
    # Expect a query parameter `jabatan`, e.g. ?jabatan=Teknisi
    user_id = session.get("user_id")

    if user_id:
        user = db.session.get(User, user_id)
    # Only return assessments for the specific assessment name requested


    assessments = (
        db.session.query(Assessment)
        .filter_by(jabatan=user.jabatan)
        .all()
    )

    result = [
        {
            "id": a.id,
            "name": a.nama_assessment,
            "progress": 0,
            }
        for a in assessments
    ]

    return jsonify({"assessments": result}), 200