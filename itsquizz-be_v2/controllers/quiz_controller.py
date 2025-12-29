from flask import request, session, jsonify

from config.database import db
from models.user import User
from models.question import Question
from models.option import Option
from models.score import Score
from models.answerlog import AnswerLog
from datetime import datetime, timezone


def index(quiz_id):
    # `quiz_id` represents `module_id` — return all questions for that module
    if quiz_id is None:
        return jsonify({"message": "Parameter 'quiz_id' wajib diberikan"}), 400

    try:
        module_id = int(quiz_id)
    except Exception:
        return jsonify({"message": "Parameter 'quiz_id' harus berupa integer"}), 400

    questions = db.session.query(Question).filter_by(module_id=module_id).all()

    result = []
    for q in questions:
        opts = (
            db.session.query(Option)
            .filter_by(question_id=q.id)
            .order_by(Option.id)
            .all()
        )

        options_text = [o.opsi for o in opts]
        correct_index = next((i for i, o in enumerate(opts) if o.is_correct), None)

        result.append({
            "id": q.id,
            "text": q.soal,
            "options": options_text,
            "correct": correct_index,
        })

    return jsonify({"questions": result}), 200



def resultAssessment():
    
    data = request.get_json()
    
    user_id = session.get("user_id")
    
    

    if not user_id:
        return jsonify({"message": "User tidak ditemukan"}), 401

    user = db.session.query(User).get(user_id)
    if not user:
        return jsonify({"message": "User tidak ditemukan"}), 404

    answers = data.get("answers", [])
    module_id = data.get("module_id")
    time_spent = data.get("timeSpent", 0)
    
    total_questions = len(answers)
    correct_answers = sum(1 for ans in answers if ans.get("isCorrect"))
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0


    # print(
    #     f"User ID: {user_id}, Module ID: {module_id}, Total Questions: {total_questions}, "
    #     f"Correct Answers: {correct_answers}, Score: {score}, Time Spent: {time_spent}"
        
    # )
    # Save score
    # Get the attempt count for this user and module
    attempt_count = db.session.query(Score).filter_by(
        user_id=user_id,
        module_id=module_id
    ).count() + 1
    
    new_score = Score(
        user_id=user_id,
        module_id=module_id,
        score=int(score),
        sisa_waktu_pengerjaan=time_spent,
        percobaan_ke=attempt_count,
        tanggal_pengerjaan=datetime.now(timezone.utc),
        is_feedback_given=False,
    )
    db.session.add(new_score)
    db.session.commit()

    # Save answer logs
    for ans in answers:
        answer_log = AnswerLog(
            user_id=user_id,
            module_id=module_id,
            question_id=ans.get("questionId"),
            selected_index=ans.get("selectedIndex"),
            correct_index=ans.get("correctIndex"),
            is_correct=ans.get("isCorrect"),
            time_spent=ans.get("timeSpent")
            
        )
        db.session.add(answer_log)
    
    db.session.commit()

    return jsonify({
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "score": score
    }), 200
