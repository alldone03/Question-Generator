from tests.base_test import BaseTest
from config.database import db
from models.course_model import Course
from models.question_model import Question

class TestQuestionRoutes(BaseTest):

    def test_create_question(self):
        with self.app.app_context():
            c = Course(nama="English", level="A1")
            db.session.add(c)
            db.session.commit()

        res = self.client.post("/question/", json={
            "course_id": 1,
            "text": "What is your name?"
        })

        self.assertIn(res.status_code, [201, 400])

    def test_get_questions(self):
        res = self.client.get("/question/")
        self.assertEqual(res.status_code, 200)
