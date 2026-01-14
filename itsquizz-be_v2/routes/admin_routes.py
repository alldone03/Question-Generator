from flask import Blueprint, request
from controllers.admin_controller import get_recap, get_dashboard_stats
from flask_jwt_extended import jwt_required

admin_bp = Blueprint("admin_bp", __name__)


@admin_bp.route("/recap/<int:assesment_id>", methods=["GET"])
@jwt_required()
def recap_route2(assesment_id):
    return get_recap(assesment_id)

@admin_bp.route("/recap", methods=["GET"])
@jwt_required()
def recap_route():
    assesment_id = request.args.get("assesment_id")
    if assesment_id is not None:
        try:
            assesment_id = int(assesment_id)
        except ValueError:
            # leave as-is (string) if not an integer
            pass
    return get_recap(assesment_id)



@admin_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def dashboard_stats_route():
    return get_dashboard_stats()
