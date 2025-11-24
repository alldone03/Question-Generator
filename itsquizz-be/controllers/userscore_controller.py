from flask import request, jsonify
from models._8_userscore_model import UserScore
from config.database import db
from datetime import datetime

def save_score():
    data = request.json

    user_id = data.get("user_id")
    level_id = data.get("level_id")
    total_questions = data.get("total_questions")
    correct_answers = data.get("correct_answers")
    score = data.get("score")

    if not all([user_id, level_id, total_questions, correct_answers, score]):
        return jsonify({"message": "Semua field wajib diisi"}), 400

    user_score = UserScore(
        user_id=user_id,
        level_id=level_id,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score,
        finished_at=datetime.now()
    )

    db.session.add(user_score)
    db.session.commit()

    return jsonify({"message": "Skor disimpan"}), 201
