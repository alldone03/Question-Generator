from flask import request, jsonify
from models._7_useranswer_model import UserAnswer
from config.database import db
from datetime import datetime

def submit_answer():
    data = request.json

    user_id = data.get("user_id")
    question_id = data.get("question_id")
    selected_option_id = data.get("selected_option_id")
    duration_seconds = data.get("duration_seconds")

    if not all([user_id, question_id, duration_seconds is not None]):
        return jsonify({"message": "Field wajib tidak lengkap"}), 400

    answer = UserAnswer(
        user_id=user_id,
        question_id=question_id,
        selected_option_id=selected_option_id,
        answered_at=datetime.now(),
        duration_seconds=duration_seconds
    )

    db.session.add(answer)
    db.session.commit()

    return jsonify({"message": "Jawaban disimpan"}), 201
