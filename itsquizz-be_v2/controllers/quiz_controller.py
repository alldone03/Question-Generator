from flask import request, session, jsonify

from config.database import db
from models.user import User
from models.question import Question
from models.option import Option
from models.score import Score
from models.answerlog import AnswerLog
from datetime import datetime, timezone
from models.module import Module


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

        options_text = [{"id": o.id, "text": o.opsi} for o in opts]
        correct_index = next((i for i, o in enumerate(opts) if o.is_correct), None)
        

        result.append({
            "id": q.id, 
            "text": q.soal,
            "options": options_text,
            "correct": correct_index,
        })

    return jsonify({"questions": result}), 200



# def resultAssessment():
    
#     data = request.get_json()
    
#     user_id = session.get("user_id")
    
#     if not user_id:
#         return jsonify({"message": "User tidak ditemukan"}), 401

#     user = db.session.query(User).get(user_id)
#     if not user:
#         return jsonify({"message": "User tidak ditemukan"}), 404

#     answers = data.get("answers", [])
#     module_id = data.get("module_id")
#     time_spent = data.get("timeSpent", 0)
    
#     # Check if module contains "Puzzle"
#     module = db.session.query(Module).get(module_id)
#     is_puzzle = module and "Puzzle" in module.jenis_module
    
#     if is_puzzle:
#         # For Puzzle: order matters, calculate based on step sequence
#         total_questions = len(answers)
#         correct_answers = sum(1 for ans in answers if ans.get("isCorrect"))
#         score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        
#         response_data = {
#             "total_questions": total_questions,
#             "correct_answers": correct_answers,
#             "score": score,
#             "answers": answers
#         }
#     else:
#         # Standard quiz response
#         total_questions = len(answers)
#         correct_answers = sum(1 for ans in answers if ans.get("isCorrect"))
#         score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        
#         response_data = {
#             "total_questions": total_questions,
#             "correct_answers": correct_answers,
#             "score": score
#         }

#     # Save score
#     attempt_count = db.session.query(Score).filter_by(
#         user_id=user_id,
#         module_id=module_id
#     ).count() + 1
    
#     new_score = Score(
#         user_id=user_id,
#         module_id=module_id,
#         score=int(score),
#         sisa_waktu_pengerjaan=time_spent,
#         percobaan_ke=attempt_count,
#         tanggal_pengerjaan=datetime.now(),
#         is_feedback_given=False,
#     )
#     db.session.add(new_score)
#     db.session.commit()

#     # Save answer logs only for non-puzzle modules
#     if not is_puzzle:
#         for ans in answers:
#             answer_log = AnswerLog(
#                 user_id=user_id,
#                 module_id=module_id,
#                 question_id=ans.get("question_id"),
#                 selected_index=ans.get("selected_answer_id"),
#                 correct_index=ans.get("correct_answer_id"),
#                 is_correct=ans.get("isCorrect"),
#                 time_spent=ans.get("timeSpent")
#             )
#             db.session.add(answer_log)
        
#         db.session.commit()

#     return jsonify(response_data), 200

def _truncate(text: str, max_len: int) -> str:
    if not text:
        return ""
    text = text.strip().replace("\n", " ")
    return text[:max_len] + ("…" if len(text) > max_len else "")

def _build_wrong_summary(wrong_details, max_items=5, max_q_len=200, max_opt_len=120):
    # Ambil hanya yang salah, batasi jumlah, dan ringkas teks
    trimmed = []
    for da in wrong_details[:max_items]:
        trimmed.append({
            "question": _truncate(da.get("question_text") or "", max_q_len),
            "selected": _truncate(da.get("selected_answer") or "", max_opt_len),
            "correct": _truncate(da.get("correct_answer") or "", max_opt_len),
        })
    return trimmed

def _format_wrong_for_prompt(wrong_summary):
    # Format ringkas untuk prompt LLM
    lines = []
    for i, it in enumerate(wrong_summary, start=1):
        lines.append(
            f"{i}. Soal: {it['question']}\n   Jawaban dipilih: {it['selected']}\n   Jawaban benar: {it['correct']}"
        )
    return "\n".join(lines)

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

    module = db.session.query(Module).get(module_id)
    is_puzzle = module and "Puzzle" in module.jenis_module

    total_questions = len(answers)
    correct_answers = sum(1 for ans in answers if ans.get("isCorrect"))
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

    detailed_answers = []
    for ans in answers:
        q = db.session.query(Question).get(ans.get("question_id"))
        selected = db.session.query(Option).get(ans.get("selected_answer_id"))
        correct = db.session.query(Option).get(ans.get("correct_answer_id"))
        detailed_answers.append({
            "question_text": q.soal if q else None,
            "selected_answer": selected.opsi if selected else None,
            "correct_answer": correct.opsi if correct else None,
            "is_correct": ans.get("isCorrect"),
        })

    response_data = {
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "score": score,
        "answers": detailed_answers if is_puzzle else None
    }

    # Simpan skor
    attempt_count = db.session.query(Score).filter_by(
        user_id=user_id, module_id=module_id
    ).count() + 1

    new_score = Score(
        user_id=user_id,
        module_id=module_id,
        score=int(score),
        sisa_waktu_pengerjaan=time_spent,
        percobaan_ke=attempt_count,
        tanggal_pengerjaan=datetime.now(),
        is_feedback_given=False,
    )
    db.session.add(new_score)
    db.session.commit()

    # Simpan log jawaban untuk non-puzzle
    if not is_puzzle:
        for ans in answers:
            answer_log = AnswerLog(
                user_id=user_id,
                module_id=module_id,
                question_id=ans.get("question_id"),
                selected_index=ans.get("selected_answer_id"),
                correct_index=ans.get("correct_answer_id"),
                is_correct=ans.get("isCorrect"),
                time_spent=ans.get("timeSpent")
            )
            db.session.add(answer_log)
        db.session.commit()

    # --- Batasi data salah untuk LLM ---
    wrong_details = [da for da in detailed_answers if not da["is_correct"]]
    wrong_summary = _build_wrong_summary(
        wrong_details,
        max_items=2,
        max_q_len=200,
        max_opt_len=120
    )
    wrong_block = _format_wrong_for_prompt(wrong_summary)

    prompt = (
        f"Profil: jabatan {user.jabatan}. Modul: {module.nama_module}.\n\n"
        f"Kesalahan utama (maks 5):\n{wrong_block}\n\n"
        "Tuliskan rekomendasi materi pembelajaran dalam bahasa Indonesia (~100 kata) dalam bentuk 1 paragraf. "
        "Fokus pada konsep inti yang sering keliru, urutan belajar praktis, sumber atau jenis latihan yang relevan, "
        "dan langkah evaluasi diri singkat. Gunakan bahasa jelas dan actionable."
    )

    # Panggil LLM secara sinkron
    llm_response = call_llm(prompt)

    # Update skor dengan feedback
    new_score.feedback = llm_response
    new_score.is_feedback_given = True
    db.session.commit()

    # Tambahkan ke response
    response_data["recommendation"] = llm_response

    return jsonify(response_data), 200


from dotenv import load_dotenv
import os
# Load isi file .env
load_dotenv()
LLM_API_URL = os.getenv("llm_url")
import requests
def call_llm(prompt: str) -> str:
    try:
        response = requests.post(
            LLM_API_URL,
            json={"prompt": prompt},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        print(data)
        return data.get("response", "")
    except Exception as e:
        print("Error call_llm:", e)
        return prompt + "\n\n[Rekomendasi materi tidak tersedia saat ini]"
