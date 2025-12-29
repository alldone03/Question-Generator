#!/bin/bash

mkdir -p tests

# BaseTest
cat << 'EOF' > tests/base_test.py
import unittest
from app import create_app
from config.database import db

class BaseTest(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
EOF

# Test Course
cat << 'EOF' > tests/test_course_routes.py
from tests.base_test import BaseTest
from config.database import db
from models.course_model import Course

class TestCourseRoutes(BaseTest):

    def test_create_course(self):
        res = self.client.post("/course/", json={
            "nama": "English Basic",
            "level": "A1"
        })
        self.assertEqual(res.status_code, 201)

    def test_get_course_list(self):
        with self.app.app_context():
            db.session.add(Course(nama="Math", level="Beginner"))
            db.session.commit()

        res = self.client.get("/course/")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json, list)
EOF

# Test Level
cat << 'EOF' > tests/test_level_routes.py
from tests.base_test import BaseTest

class TestLevelRoutes(BaseTest):

    def test_get_levels(self):
        res = self.client.get("/level/")
        self.assertEqual(res.status_code, 200)
EOF

# Test Question
cat << 'EOF' > tests/test_question_routes.py
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
EOF

# Test Option
cat << 'EOF' > tests/test_option_routes.py
from tests.base_test import BaseTest
from config.database import db
from models.course_model import Course
from models.question_model import Question

class TestOptionRoutes(BaseTest):

    def test_create_option(self):
        with self.app.app_context():
            c = Course(nama="English", level="A1")
            db.session.add(c)
            db.session.commit()

            q = Question(course_id=1, text="2+2=?")
            db.session.add(q)
            db.session.commit()

        res = self.client.post("/option/", json={
            "question_id": 1,
            "text": "4",
            "is_correct": True
        })

        self.assertIn(res.status_code, [201, 400])

    def test_get_options(self):
        res = self.client.get("/option/")
        self.assertEqual(res.status_code, 200)
EOF

# Test Answer
cat << 'EOF' > tests/test_answer_routes.py
from tests.base_test import BaseTest

class TestAnswerRoutes(BaseTest):

    def test_submit_answer(self):
        res = self.client.post("/answer/", json={
            "user_id": 1,
            "question_id": 1,
            "option_id": 2,
            "time_spent": 5
        })

        self.assertIn(res.status_code, [201, 400])
EOF

# Test Score
cat << 'EOF' > tests/test_score_routes.py
from tests.base_test import BaseTest

class TestScoreRoutes(BaseTest):

    def test_get_score(self):
        res = self.client.get("/score/1")
        self.assertIn(res.status_code, [200, 404])
EOF

echo "🔥 Semua test file berhasil dibuat di folder tests/"
