from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity

from config.database import db
from models.user import User
from models.question import Question
from models.option import Option
from models.score import Score
from models.answerlog import AnswerLog
from datetime import datetime, timezone
from models.module import Module

import re
from typing import List, Dict


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
            f"{i}. Soal: {it['question']}\n   Jawaban benar: {it['correct']}"
        )
    return "\n".join(lines)

def resultAssessment():
    data = request.get_json()
    user_id = get_jwt_identity()

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
        max_items=10,
        max_q_len=200,
        max_opt_len=120
    )
    wrong_block = _format_wrong_for_prompt(wrong_summary)

    prompt = (
        f"{module.nama_module}.\n\n"
        f"{wrong_block}\n\n"
    )
    # prompt = (
    #     f"Profil: jabatan {user.jabatan}. Modul: {module.nama_module}.\n\n"
    #     f"Kesalahan utama (maks 5):\n{wrong_block}\n\n"
    #     "Tuliskan rekomendasi materi pembelajaran dalam bahasa Indonesia (~100 kata) dalam bentuk 1 paragraf. "
    #     "Fokus pada konsep inti yang sering keliru, urutan belajar praktis, sumber atau jenis latihan yang relevan, "
    #     "dan langkah evaluasi diri singkat. Gunakan bahasa jelas dan actionable."
    # )

    # Panggil LLM secara sinkron
    llm_response = call_llm(prompt)
    

    # Update skor dengan feedback
    new_score.feedback = llm_response
    new_score.is_feedback_given = True
    db.session.commit()

    # Tambahkan ke response
    response_data["recommendation"] = llm_response

    return jsonify(response_data), 200


# recomendation pages
FLATTENED_DATA: List[Dict] = [
    # 3.1 PERENCANAAN DAN PENGELOLAAN LAYANAN SARPRAS
    {"id": "4.1.1", "title": "Pengelolaan Usulan Pengadaan", "path": "BAB III > 3.1", "page": 5},
    {"id": "4.1.2", "title": "Pengendalian Perbaikan Renovasi", "path": "BAB III > 3.1", "page": 5},
    {"id": "4.1.3", "title": "Pengelolaan Peminjaman Alat Bahan", "path": "BAB III > 3.1", "page": 6}, 

    # 3.2 PENGELOLAAN GEDUNG DAN LINGKUNGAN/RUANG TERBUKA HIJAU
    {"id": "4.2.1", "title": "Jadwal Perbaikan Pemeliharaan", "path": "BAB III > 3.2", "page": 6},
    {"id": "4.2.2.1", "title": "Penggunaan Ruang", "path": "BAB III > 3.2 > RTH", "page": 6}, 
    {"id": "4.2.2.2", "title": "Ruang Terbuka Hijau", "path": "BAB III > 3.2 > RTH", "page": 7},
    {"id": "4.2.3", "title": "Dokumen Perbaikan Sarpras", "path": "BAB III > 3.2", "page": 8}, 
    {"id": "4.2.4", "title": "Pemeliharaan Perangkat K3", "path": "BAB III > 3.2", "page": 9}, 
    
    # Detil 3.2.5 Pengelolaan Peralatan Sarana dan Prasarana
    {"id": "4.2.5.1.1", "title": "Pemeliharaan Perabot Ruang", "path": "BAB III > 3.2 > Peralatan", "page": 10},
    {"id": "4.2.5.1.2", "title": "Pemeliharaan Media Pendidikan", "path": "BAB III > 3.2 > Peralatan", "page": 11},
    {"id": "4.2.5.1.3", "title": "Pemeliharaan Alat Praktik TIK", "path": "BAB III > 3.2 > Peralatan", "page": 11},
    
    {"id": "4.2.5.2.1", "title": "Pemeliharaan Komponen Struktur", "path": "BAB III > 3.2 > Prasarana", "page": 12}, 
    {"id": "4.2.5.2.2", "title": "Pemeliharaan Komponen Arsitektur", "path": "BAB III > 3.2 > Prasarana", "page": 13},
    {"id": "4.2.5.2.3", "title": "Pemeliharaan Komponen Utilitas", "path": "BAB III > 3.2 > Prasarana", "page": 17},
    {"id": "4.2.5.2.4", "title": "Pemeliharaan Tata Ruang Luar", "path": "BAB III > 3.2 > Prasarana", "page": 21},

    # 3.3 PENGELOLAAN PROGRAM SMART ECO CAMPUS
    {"id": "4.3.1.1", "title": "Penghematan Listrik Gedung", "path": "BAB III > Smart Eco Campus", "page": 23},
    {"id": "4.3.1.2", "title": "Penghematan BBM Kendaraan", "path": "BAB III > Smart Eco Campus", "page": 25},
    {"id": "4.3.1.3", "title": "Penghematan Penggunaan Air", "path": "BAB III > Smart Eco Campus", "page": 25},
    {"id": "4.3.2.1", "title": "Energi Terbarukan di RTH", "path": "BAB III > Smart Eco Campus", "page": 25},
    {"id": "4.3.2.2", "title": "Energi Terbarukan di Gedung", "path": "BAB III > Smart Eco Campus", "page": 26},
]

# =====================================================
# TEXT NORMALIZATION
# =====================================================
def normalize_text(text: str) -> List[str]:
    """
    Lowercase, remove symbols, split to tokens
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return text.split()

# =====================================================
# SCORING LOGIC
# =====================================================
def calculate_score(tokens: List[str], item: Dict) -> int:
    """
    Scoring rules:
    - token in title  -> +3
    - token in path   -> +1
    """
    score = 0
    title = item["title"].lower()
    path = item["path"].lower()

    for token in tokens:
        # print("ini token: "+token+", ini title: "+title)
        if token in title:
            score += 3
        elif token in path:
            score += 1

    return score

# =====================================================
# MAIN RECOMMENDATION FUNCTION
# =====================================================


def recommend_pages(
    user_input: str,
    top_k: int = 3
) -> List[Dict]:
    """
    Return top-k recommended pages based on keyword scoring
    """
    tokens = normalize_text(user_input)
    results = []

    for item in FLATTENED_DATA:
        score = calculate_score(tokens, item)
        if score > 0:
            results.append({
                "id": item["id"],
                "title": item["title"],
                "page": item["page"],
                "path": item["path"],
                "score": score
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]



from dotenv import load_dotenv
import os
# Load isi file .env
load_dotenv()
LLM_API_URL = os.getenv("llm_url")

def call_llm(prompt: str) -> str:
    """
    Pengganti call_llm:
    Menghasilkan rekomendasi halaman materi berdasarkan input user (non-LLM)
    """
    try:
        # print(prompt)
        recommendations = recommend_pages(prompt, top_k=3)

        if not recommendations:
            return (
                prompt
                + "\n\n[Tidak ditemukan materi yang relevan]"
            )
        # print(recommendations)

        

        result_text = "\n".join([
        f"{r['path']}|{r['page']}|{r['id']}|{r['title']}" 
        for r in recommendations
])

        return result_text

    except Exception as e:
        print("Error call_llm (non-LLM):", e)
        return (
            prompt
            + "\n\n[Rekomendasi materi tidak tersedia saat ini]"
        )