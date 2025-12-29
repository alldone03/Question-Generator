

from flask import Blueprint
from controllers.assessment_controller import (
index
)

assessment_bp = Blueprint("assessment_bp", __name__)

assessment_bp.get("/index")(index)
