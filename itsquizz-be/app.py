from flask import Flask
from config.database import db
from routes.auth_routes import auth_bp
from flask_session import Session

def create_app():
    app = Flask(__name__)
    
    # Konfigurasi dasar
    app.config['SECRET_KEY'] = 'secretkey123'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SEpSSION_TYPE'] = 'filesystem'

    # Inisialisasi extension
    db.init_app(app)
    Session(app)

    # Register blueprint
    app.register_blueprint(auth_bp, url_prefix="/auth")

    # Buat database jika belum ada
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)