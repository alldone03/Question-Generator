

from flask import Blueprint
from controllers.assessment_controller import (
index
)

from flask_jwt_extended import jwt_required

assessment_bp = Blueprint("assessment_bp", __name__)

@assessment_bp.route("/index", methods=["GET"])
@jwt_required()
def index_route():
    return index()
