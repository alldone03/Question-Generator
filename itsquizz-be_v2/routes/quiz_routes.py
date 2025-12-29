




from flask import Blueprint
from controllers.quiz_controller import (
index,
resultAssessment
)

quiz_bp = Blueprint("quiz_bp", __name__)
quiz_bp.get("/<int:quiz_id>")(index)
quiz_bp.post("/resultAssessment")(resultAssessment)
