from flask import request, jsonify
from models._2_course_model import Course
from config.database import db

def create_course():
    data = request.json
    course_name = data.get("course_name")

    if not course_name:
        return jsonify({"message": "course_name wajib diisi"}), 400

    course = Course(course_name=course_name)
    db.session.add(course)
    db.session.commit()

    return jsonify({"message": "Course dibuat", "data": course.to_dict()}), 201


def get_courses():
    result = db.session.query(Course).all()
    data = [c.to_dict() for c in result]
    return jsonify(data), 200


def update_course(id):
    data = request.json
    course = db.session.query(Course).get(id)

    if not course:
        return jsonify({"message": "Course tidak ditemukan"}), 404

    course.course_name = data.get("course_name", course.course_name)
    db.session.commit()

    return jsonify({"message": "Course diperbarui"}), 200


def delete_course(id):
    course = db.session.query(Course).get(id)

    if not course:
        return jsonify({"message": "Course tidak ditemukan"}), 404

    db.session.delete(course)
    db.session.commit()

    return jsonify({"message": "Course dihapus"}), 200
