from tests.base_test import BaseTest

class TestLevelRoutes(BaseTest):

    def test_get_levels(self):
        res = self.client.get("/level/")
        self.assertEqual(res.status_code, 200)
