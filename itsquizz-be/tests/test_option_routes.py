# from tests.base_test import BaseTest
# from config.database import db
# from models.course_model import Course
# from models.question_model import Question

# class TestOptionRoutes(BaseTest):

#     def test_create_option(self):
#         with self.app.app_context():
#             c = Course(nama="English", level="A1")
#             db.session.add(c)
#             db.session.commit()

#             q = Question(course_id=1, text="2+2=?")
#             db.session.add(q)
#             db.session.commit()

#         res = self.client.post("/option/", json={
#             "question_id": 1,
#             "text": "4",
#             "is_correct": True
#         })

#         self.assertIn(res.status_code, [201, 400])

#     def test_get_options(self):
#         res = self.client.get("/option/")
#         self.assertEqual(res.status_code, 200)
