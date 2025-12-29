


from flask import Blueprint
from controllers.module_controller import (
index
)

module_bp = Blueprint("module_bp", __name__)
module_bp.get("/<int:assessment_id>")(index)
