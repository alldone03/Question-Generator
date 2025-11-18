from flask import Flask
from config.database import db
from routes.auth_routes import auth_bp
from flask_session import Session
from flask_cors import CORS

from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app,
         resources={r"/*": {"origins": "http://localhost:5173"}},
         supports_credentials=True)

    # Konfigurasi dasar
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SESSION_TYPE'] = os.getenv("SESSION_TYPE")

    # Inisialisasi extension
    db.init_app(app)
    Session(app)

    # Register blueprint
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")


    # Buat database jika belum ada
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)