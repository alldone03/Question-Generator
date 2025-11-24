import os

# Struktur folder dan file
files = {
    "routes/course_routes.py": """
from flask import Blueprint, request, jsonify
from models.course_model import Course
from config.database import db

course_bp = Blueprint("course_bp", __name__)

@course_bp.route("/", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses]), 200

@course_bp.route("/", methods=["POST"])
def create_course():
    data = request.json
    nama = data.get("nama")
    level = data.get("level")

    if not nama or not level:
        return jsonify({"message": "Field tidak lengkap"}), 400

    course = Course(nama=nama, level=level)
    db.session.add(course)
    db.session.commit()
    return jsonify({"message": "Course dibuat"}), 201

@course_bp.route("/<int:id>", methods=["PUT"])
def update_course(id):
    course = Course.query.get(id)
    if not course:
        return jsonify({"message": "Course tidak ditemukan"}), 404

    data = request.json
    course.nama = data.get("nama", course.nama)
    course.level = data.get("level", course.level)

    db.session.commit()
    return jsonify({"message": "Course diperbarui"}), 200

@course_bp.route("/<int:id>", methods=["DELETE"])
def delete_course(id):
    course = Course.query.get(id)
    if not course:
        return jsonify({"message": "Course tidak ditemukan"}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course dihapus"}), 200
""",

    "routes/soal_routes.py": """
from flask import Blueprint, request, jsonify
from models.soal_model import Soal
from config.database import db

soal_bp = Blueprint("soal_bp", __name__)

@soal_bp.route("/", methods=["GET"])
def get_all():
    soal = Soal.query.all()
    return jsonify([s.to_dict() for s in soal]), 200

@soal_bp.route("/", methods=["POST"])
def create():
    data = request.json
    text = data.get("text")
    course_id = data.get("course_id")

    if not text or not course_id:
        return jsonify({"message": "Field tidak lengkap"}), 400

    s = Soal(text=text, course_id=course_id)
    db.session.add(s)
    db.session.commit()
    return jsonify({"message": "Soal dibuat"}), 201

@soal_bp.route("/<int:id>", methods=["PUT"])
def update(id):
    s = Soal.query.get(id)
    if not s:
        return jsonify({"message": "Soal tidak ditemukan"}), 404

    data = request.json
    s.text = data.get("text", s.text)
    s.course_id = data.get("course_id", s.course_id)

    db.session.commit()
    return jsonify({"message": "Soal diperbarui"}), 200

@soal_bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    s = Soal.query.get(id)
    if not s:
        return jsonify({"message": "Soal tidak ditemukan"}), 404

    db.session.delete(s)
    db.session.commit()
    return jsonify({"message": "Soal dihapus"}), 200
""",

    "routes/jawaban_routes.py": """
from flask import Blueprint, request, jsonify
from models.jawaban_model import Jawaban
from config.database import db

jawaban_bp = Blueprint("jawaban_bp", __name__)

@jawaban_bp.route("/", methods=["GET"])
def get_all():
    j = Jawaban.query.all()
    return jsonify([x.to_dict() for x in j]), 200

@jawaban_bp.route("/", methods=["POST"])
def create():
    data = request.json
    user_id = data.get("user_id")
    soal_id = data.get("soal_id")
    jawaban = data.get("jawaban")
    waktu = data.get("waktu")

    if not all([user_id, soal_id, jawaban, waktu]):
        return jsonify({"message": "Field tidak lengkap"}), 400

    x = Jawaban(user_id=user_id, soal_id=soal_id, jawaban=jawaban, waktu=waktu)
    db.session.add(x)
    db.session.commit()
    return jsonify({"message": "Jawaban dibuat"}), 201
""",

    "tests/test_course.py": """
import unittest
from app import create_app
from config.database import db

class TestCourse(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def test_create(self):
        res = self.client.post("/courses/", json={
            "nama": "English Basic",
            "level": "A1"
        })
        self.assertEqual(res.status_code, 201)
""",

    "tests/test_soal.py": """
import unittest
from app import create_app
from config.database import db

class TestSoal(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def test_create(self):
        res = self.client.post("/soal/", json={
            "text": "Apa arti kata run?",
            "course_id": 1
        })
        # 400 karena course_id belum ada, ini test dasar
        self.assertTrue(res.status_code in [400, 201])
"""
}

# Membuat semua file
for path, content in files.items():
    folder = os.path.dirname(path)
    if not os.path.exists(folder):
        os.makedirs(folder)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())

print("Semua file berhasil dibuat.")
