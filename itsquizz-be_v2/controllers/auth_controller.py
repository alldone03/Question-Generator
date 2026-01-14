from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from config.database import db
from utils.hash import hash_password, verify_password
from models.user import User

# REGISTER
def register_user():
    data = request.json
    print(data)

    nama = data.get("nama")
    email = data.get("email")
    password = data.get("password")
    jabatan = data.get("jabatan")
    nip = data.get("nip")
    
    if not all([nama, email, password, jabatan]):
        return jsonify({"message": "Semua field wajib diisi"}), 400

    # Gunakan db.session.query, bukan User.query
    existing_user = db.session.query(User).filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email sudah terdaftar"}), 400

    user = User(
        nama=nama,
        nip=nip,
        email=email,
        password=hash_password(password),
        jabatan=jabatan
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User berhasil dibuat"}), 200

# LOGIN
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email dan password wajib diisi"}), 400

    # Gunakan db.session.query
    user = db.session.query(User).filter_by(email=email).first()

    if not user or not verify_password(user.password, password):
        return jsonify({"message": "Email atau password salah"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login berhasil",    
        "user": user.to_dict(),
        "access_token": access_token
    }), 200

# LOGOUT
def logout_user():
    # Client side just removes the token
    return jsonify({"message": "Logout berhasil"}), 200


# CHECK STATUS
@jwt_required()
def check_status():
    current_user_id = get_jwt_identity()
    
    user = db.session.get(User, current_user_id)
    if user:
        return jsonify({
            "logged_in": True,
            "user": user.to_dict()
        }), 200

    return jsonify({"logged_in": False}), 200