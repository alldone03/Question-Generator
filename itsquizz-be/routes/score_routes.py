from flask import Blueprint
from controllers.userscore_controller import save_score

score_bp = Blueprint("score", __name__)

score_bp.post("/")(save_score)
