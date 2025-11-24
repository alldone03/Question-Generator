from flask import Blueprint
from controllers.question_controller import (
    create_question, get_questions
)

question_bp = Blueprint("question", __name__)

question_bp.post("/")(create_question)
question_bp.get("/")(get_questions)
