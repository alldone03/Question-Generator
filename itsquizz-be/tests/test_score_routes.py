from tests.base_test import BaseTest

class TestScoreRoutes(BaseTest):

    def test_get_score(self):
        res = self.client.get("/score/1")
        self.assertIn(res.status_code, [200, 404])
