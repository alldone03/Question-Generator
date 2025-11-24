from flask import Blueprint
from controllers.questionoption_controller import create_option

option_bp = Blueprint("option", __name__)

option_bp.post("/")(create_option)
