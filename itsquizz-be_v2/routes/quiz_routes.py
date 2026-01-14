




from flask import Blueprint
from controllers.quiz_controller import (
index,
resultAssessment
)

from flask_jwt_extended import jwt_required

quiz_bp = Blueprint("quiz_bp", __name__)

@quiz_bp.route("/<int:quiz_id>", methods=["GET"])
@jwt_required()
def index_route(quiz_id):
    return index(quiz_id)

@quiz_bp.route("/resultAssessment", methods=["POST"])
@jwt_required()
def resultAssessment_route():
    return resultAssessment()
