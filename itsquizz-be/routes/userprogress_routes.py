from flask import Blueprint
from controllers.userprogress_controller import save_progress

userprogress_bp = Blueprint("userprogress", __name__)


userprogress_bp.post("/saveprogress")(save_progress)
