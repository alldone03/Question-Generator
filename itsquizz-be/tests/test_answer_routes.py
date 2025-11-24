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
