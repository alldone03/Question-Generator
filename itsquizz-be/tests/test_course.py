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
        res = self.client.post("/course/", json={
            "course_name": "English Basic",
            "level": "A1"
        })
        self.assertEqual(res.status_code, 201)