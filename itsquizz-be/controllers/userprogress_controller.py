from flask import request, jsonify
from models._9_userlevelprogress_model import UserLevelProgress
from config.database import db


def save_progress():
    data = request.json

    user_id = data.get("user_id")
    course_id = data.get("course_id")
    level_id = data.get("level_id")
    score = data.get("score")

    status = "passed" if score >= 90 else "repeat"

    progress = UserLevelProgress(
        user_id=user_id,
        course_id=course_id,
        level_id=level_id,
        score=score,
        status=status
    )

    db.session.add(progress)
    db.session.commit()

    return jsonify({
        "message": "Progress saved",
        "status": status
    })
