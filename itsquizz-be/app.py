from flask import Flask
from config.database import db
from flask_migrate import Migrate
from routes.auth_routes import auth_bp
from flask_session import Session
from flask_cors import CORS

from routes.course_routes import course_bp
from routes.level_routes import level_bp
from routes.question_routes import question_bp
from routes.option_routes import option_bp
from routes.answer_routes import answer_bp
from routes.score_routes import score_bp

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

    # Init DB
    db.init_app(app)

    # Init Migration
    migrate.init_app(app, db)  # <-- aktifkan Alembic

    # Init Session
    Session(app)

    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(course_bp, url_prefix="/course")
    app.register_blueprint(level_bp, url_prefix="/level")
    app.register_blueprint(question_bp, url_prefix="/question")
    app.register_blueprint(option_bp, url_prefix="/option")
    app.register_blueprint(answer_bp, url_prefix="/answer")
    app.register_blueprint(score_bp, url_prefix="/score")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
