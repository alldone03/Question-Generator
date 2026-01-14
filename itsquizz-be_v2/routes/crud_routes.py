from flask import Blueprint
from controllers.crud_controller import (
    create_assessment, get_assessments, update_assessment, delete_assessment,
    create_module, get_modules_by_assessment, update_module, delete_module,
    create_learning_module, get_learning_modules, update_learning_module, delete_learning_module,
    create_question, get_questions, update_question, delete_question,
    create_option, get_options, update_option, delete_option
)

from flask_jwt_extended import jwt_required

crud_bp = Blueprint("crud_bp", __name__)

@crud_bp.before_request
@jwt_required()
def before_request():
    pass

# Assessment
crud_bp.route("/assessments", methods=["POST"])(create_assessment)
crud_bp.route("/assessments", methods=["GET"])(get_assessments)
crud_bp.route("/assessments/<int:id>", methods=["PUT"])(update_assessment)
crud_bp.route("/assessments/<int:id>", methods=["DELETE"])(delete_assessment)

# Module
crud_bp.route("/modules", methods=["POST"])(create_module)
crud_bp.route("/assessments/<int:assessment_id>/modules", methods=["GET"])(get_modules_by_assessment)
crud_bp.route("/modules/<int:id>", methods=["PUT"])(update_module)
crud_bp.route("/modules/<int:id>", methods=["DELETE"])(delete_module)

# Learning Module
crud_bp.route("/learning-modules", methods=["POST"])(create_learning_module)
crud_bp.route("/modules/<int:module_id>/learning-modules", methods=["GET"])(get_learning_modules)
crud_bp.route("/learning-modules/<int:id>", methods=["PUT"])(update_learning_module)
crud_bp.route("/learning-modules/<int:id>", methods=["DELETE"])(delete_learning_module)

# Question
crud_bp.route("/questions", methods=["POST"])(create_question)
crud_bp.route("/modules/<int:module_id>/questions", methods=["GET"])(get_questions)
crud_bp.route("/questions/<int:id>", methods=["PUT"])(update_question)
crud_bp.route("/questions/<int:id>", methods=["DELETE"])(delete_question)

# Option
crud_bp.route("/options", methods=["POST"])(create_option)
crud_bp.route("/questions/<int:question_id>/options", methods=["GET"])(get_options)
crud_bp.route("/options/<int:id>", methods=["PUT"])(update_option)
crud_bp.route("/options/<int:id>", methods=["DELETE"])(delete_option)
