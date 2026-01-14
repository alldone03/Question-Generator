from flask import Flask, send_from_directory
from config.database import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from flask_cors import CORS
from dotenv import load_dotenv
import os

from models import *

from routes.auth_routes import auth_bp
from routes.assessment_routes import assessment_bp
from routes.module_routes import module_bp
from routes.quiz_routes import quiz_bp
from routes.admin_routes import admin_bp
from routes.crud_routes import crud_bp

load_dotenv()

migrate = Migrate()  # <-- tambahkan
jwt = JWTManager()

origins_list = os.getenv("origins", "").split(",")
def create_app():
    print(os.getenv("origins"))
    app = Flask(__name__)
    CORS(app,
         resources={r"/*": {"origins": origins_list}},
         supports_credentials=True)

    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY") # Use same key or separate ENV
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Init DB
    db.init_app(app)
    

    # Init Migration
    migrate.init_app(app, db)  # <-- aktifkan Alembic

    # Init JWT
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(assessment_bp, url_prefix="/assessments")
    app.register_blueprint(module_bp, url_prefix="/module")
    app.register_blueprint(quiz_bp, url_prefix="/quiz")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(crud_bp, url_prefix="/management")

    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
