from flask import Blueprint
from controllers.course_controller import (
    create_course, get_courses, update_course, delete_course
)

course_bp = Blueprint("course", __name__)

course_bp.post("/")(create_course)
course_bp.get("/")(get_courses)
course_bp.put("/<int:id>")(update_course)
course_bp.delete("/<int:id>")(delete_course)