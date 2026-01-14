


from flask import Blueprint
from controllers.module_controller import (
index
)

from flask_jwt_extended import jwt_required

module_bp = Blueprint("module_bp", __name__)

@module_bp.route("/<int:assessment_id>", methods=["GET"])
@jwt_required()
def index_route(assessment_id):
    return index(assessment_id)
