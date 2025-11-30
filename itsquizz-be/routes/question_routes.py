from flask import Blueprint
from controllers.question_controller import (
    create_question, get_questions,get_questions_by_level
)

question_bp = Blueprint("question", __name__)

question_bp.post("/")(create_question)
question_bp.get("/")(get_questions)
question_bp.get("/level/<int:level_id>")(get_questions_by_level)