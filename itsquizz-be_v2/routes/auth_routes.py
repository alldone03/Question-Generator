from flask import Blueprint
from controllers.auth_controller import (
    register_user,
    login_user,
    logout_user,
    check_status
)

auth_bp = Blueprint("auth_bp", __name__)

auth_bp.post("/register")(register_user)
auth_bp.post("/login")(login_user)
auth_bp.post("/logout")(logout_user)
auth_bp.get("/status")(check_status)