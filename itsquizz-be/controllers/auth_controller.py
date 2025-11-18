from flask import request, session, jsonify
from models.user_model import User
from config.database import db
from utils.hash import hash_password, verify_password

# Register
def register_user():
    data = request.json
    
    nama = data.get("nama")
    email = data.get("email")
    password = data.get("password")
    jabatan = data.get("jabatan")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email sudah terdaftar"}), 400

    new_user = User(
        nama=nama,
        email=email,
        password=hash_password(password),
        jabatan=jabatan
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User berhasil dibuat"})

# Login
def login_user():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not verify_password(user.password, password):
        return jsonify({"message": "Email atau password salah"}), 401

    session["user_id"] = user.id

    return jsonify({"message": "Login berhasil", "user": user.to_dict()})

# Logout
def logout_user():
    session.pop("user_id", None)
    return jsonify({"message": "Logout berhasil"})

# Status login
def check_status():
    if "user_id" in session:
        user = User.query.get(session["user_id"])
        return jsonify({"logged_in": True, "user": user.to_dict()})
    return jsonify({"logged_in": False})
