from flask import Flask
from config.database import db
from flask_migrate import Migrate
from flask_session import Session
from flask_cors import CORS
from flask_jwt_extended import JWTManager





from models import *

from routes.auth_routes import auth_bp
from routes.assessment_routes import assessment_bp
from routes.module_routes import module_bp
from routes.quiz_routes import quiz_bp

from dotenv import load_dotenv
import os

load_dotenv()

migrate = Migrate()  # <-- tambahkan

def create_app():
    app = Flask(__name__)
    CORS(app,
         resources={r"/*": {"origins": "http://localhost:5173"}},
         supports_credentials=True)

    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SESSION_TYPE'] = os.getenv("SESSION_TYPE")
    jwt = JWTManager(app)

    BLACKLIST = set()

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLACKLIST

    # Init DB
    db.init_app(app)
    

    # Init Migration
    migrate.init_app(app, db)  # <-- aktifkan Alembic

    # Init Session
    Session(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(assessment_bp, url_prefix="/assessments")
    app.register_blueprint(module_bp, url_prefix="/module")
    app.register_blueprint(quiz_bp, url_prefix="/quiz")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
