import unittest
import json
from app import create_app
from config.database import db

class AuthTest(unittest.TestCase):

    def setUp(self):
        # Setup aplikasi test
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost:3306/question_generator_db"
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        # Hapus database setelah test
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    # -----------------------------
    # Test: Register
    # -----------------------------
    def test_register(self):
        response = self.client.post(
            "/auth/register",
            data=json.dumps({
                "nama": "Aldan",
                "email": "aldan@mail.com",
                "password": "123456",
                "jabatan": "teknisi"
            }),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("User berhasil dibuat", response.get_data(as_text=True))

    # -----------------------------
    # Test: Login
    # -----------------------------
    def test_login(self):
        # Buat user dulu
        self.client.post(
            "/auth/register",
            data=json.dumps({
                "nama": "Aldan",
                "email": "aldan@mail.com",
                "password": "123456",
                "jabatan": "teknisi"
            }),
            content_type="application/json"
        )

        # Login
        response = self.client.post(
            "/auth/login",
            data=json.dumps({
                "email": "aldan@mail.com",
                "password": "123456"
            }),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("Login berhasil", response.get_data(as_text=True))

    # -----------------------------
    # Test: Status Login
    # -----------------------------
    def test_status(self):
        # Register + login
        self.client.post(
            "/auth/register",
            data=json.dumps({
                "nama": "Aldan",
                "email": "aldan@mail.com",
                "password": "123456",
                "jabatan": "teknisi"
            }),
            content_type="application/json"
        )

        self.client.post(
            "/auth/login",
            data=json.dumps({
                "email": "aldan@mail.com",
                "password": "123456"
            }),
            content_type="application/json"
        )

        # Check status
        response = self.client.get("/auth/status")

        self.assertEqual(response.status_code, 200)
        self.assertIn("logged_in", response.get_data(as_text=True))

    # -----------------------------
    # Test: Logout
    # -----------------------------
    def test_logout(self):
        # Register + login dulu
        self.client.post(
            "/auth/register",
            data=json.dumps({
                "nama": "Aldan",
                "email": "aldan@mail.com",
                "password": "123456",
                "jabatan": "teknisi"
            }),
            content_type="application/json"
        )

        self.client.post(
            "/auth/login",
            data=json.dumps({
                "email": "aldan@mail.com",
                "password": "123456"
            }),
            content_type="application/json"
        )

        # Logout
        response = self.client.post("/auth/logout")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Logout berhasil", response.get_data(as_text=True))


if __name__ == "__main__":
    unittest.main()
