from flask import request, jsonify
from models._5_question_model import Question
from config.database import db
from datetime import datetime

def create_question():
    data = request.json

    level_id = data.get("level_id")
    question_text = data.get("question_text")
    question_type = data.get("question_type")

    if not all([level_id, question_text, question_type]):
        return jsonify({"message": "Semua field wajib diisi"}), 400

    question = Question(
        level_id=level_id,
        question_text=question_text,
        question_type=question_type,
        created_at=datetime.now()
    )

    db.session.add(question)
    db.session.commit()

    return jsonify({"message": "Soal dibuat", "data": question.to_dict()}), 201


def get_questions():
    result = db.session.query(Question).all()
    data = [q.to_dict() for q in result]
    return jsonify(data), 200
