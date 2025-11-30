from flask import Blueprint
from controllers.courselevel_controller import (
    create_level, get_levels, get_levels_by_course
)

level_bp = Blueprint("level", __name__)

level_bp.post("/")(create_level)
level_bp.get("/")(get_levels)
level_bp.get("/<int:course_id>")(get_levels_by_course)
