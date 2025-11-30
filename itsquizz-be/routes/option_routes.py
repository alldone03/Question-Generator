from flask import Blueprint
from controllers.questionoption_controller import create_option,get_options_by_question

option_bp = Blueprint("option", __name__)

option_bp.post("/")(create_option)
option_bp.get("/question/<int:question_id>")(get_options_by_question)
