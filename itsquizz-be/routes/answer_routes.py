from flask import Blueprint
from controllers.useranswer_controller import submit_answer

answer_bp = Blueprint("answer", __name__)

answer_bp.post("/")(submit_answer)

