from flask import request, jsonify
from models._6_questionoption_model import QuestionOption
from config.database import db

def create_option():
    data = request.json

    question_id = data.get("question_id")
    option_text = data.get("option_text")
    is_correct = data.get("is_correct", False)

    if not all([question_id, option_text]):
        return jsonify({"message": "Semua field wajib diisi"}), 400

    option = QuestionOption(
        question_id=question_id,
        option_text=option_text,
        is_correct=is_correct
    )

    db.session.add(option)
    db.session.commit()

    return jsonify({"message": "Opsi dibuat", "data": option.to_dict()}), 201
