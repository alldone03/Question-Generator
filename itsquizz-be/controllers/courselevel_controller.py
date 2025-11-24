from flask import request, jsonify
from models._3_courselevel_model import CourseLevel
from config.database import db

def create_level():
    data = request.json

    course_id = data.get("course_id")
    level_name = data.get("level_name")

    if not all([course_id, level_name]):
        return jsonify({"message": "Semua field wajib diisi"}), 400

    level = CourseLevel(course_id=course_id, level_name=level_name)
    db.session.add(level)
    db.session.commit()

    return jsonify({"message": "Level dibuat", "data": level.to_dict()}), 201


def get_levels():
    result = db.session.query(CourseLevel).all()
    data = [l.to_dict() for l in result]
    return jsonify(data), 200
