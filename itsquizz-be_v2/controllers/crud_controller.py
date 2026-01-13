import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
from config.database import db
from models.assessment import Assessment
from models.module import Module
from models.learning_module import LearningModule
from models.question import Question
from models.option import Option

def create_assessment():
    data = request.json
    try:
        new_assessment = Assessment(
            nama_assessment=data['nama_assessment'],
            jabatan=data['jabatan']
        )
        db.session.add(new_assessment)
        db.session.commit()
        return jsonify({"message": "Assessment created", "id": new_assessment.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def get_assessments():
    assessments = Assessment.query.all()
    result = [{"id": a.id, "nama_assessment": a.nama_assessment, "jabatan": a.jabatan, "created_at": a.created_at} for a in assessments]
    return jsonify(result), 200

def update_assessment(id):
    data = request.json
    assessment = Assessment.query.get_or_404(id)
    try:
        assessment.nama_assessment = data.get('nama_assessment', assessment.nama_assessment)
        assessment.jabatan = data.get('jabatan', assessment.jabatan)
        db.session.commit()
        return jsonify({"message": "Assessment updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def delete_assessment(id):
    assessment = Assessment.query.get_or_404(id)
    try:
        db.session.delete(assessment)
        db.session.commit()
        return jsonify({"message": "Assessment deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# --- Module ---
def create_module():
    data = request.json
    try:
        new_module = Module(
            assessment_id=data['assessment_id'],
            nama_module=data['nama_module'],
            level=data['level'],
            jenis_module=data['jenis_module'],
            waktu_pengerjaan=data.get('waktu_pengerjaan'),
            feedback=data.get('feedback')
        )
        db.session.add(new_module)
        db.session.commit()
        return jsonify({"message": "Module created", "id": new_module.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def get_modules_by_assessment(assessment_id):
    modules = Module.query.filter_by(assessment_id=assessment_id).all()
    result = [{"id": m.id, "nama_module": m.nama_module, "level": m.level, "jenis_module": m.jenis_module} for m in modules]
    return jsonify(result), 200

def update_module(id):
    data = request.json
    module = Module.query.get_or_404(id)
    try:
        module.nama_module = data.get('nama_module', module.nama_module)
        module.level = data.get('level', module.level)
        module.jenis_module = data.get('jenis_module', module.jenis_module)
        module.waktu_pengerjaan = data.get('waktu_pengerjaan', module.waktu_pengerjaan)
        module.feedback = data.get('feedback', module.feedback)
        db.session.commit()
        return jsonify({"message": "Module updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def delete_module(id):
    module = Module.query.get_or_404(id)
    try:
        db.session.delete(module)
        db.session.commit()
        return jsonify({"message": "Module deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# --- Learning Module (with Upload) ---
def create_learning_module():
    try:
        module_id = request.form.get('module_id')
        judul = request.form.get('judul')
        file_pdf = request.files.get('file_pdf')
        
        file_path = None
        if file_pdf:
            filename = secure_filename(file_pdf.filename)
            upload_folder = os.path.join(os.getcwd(), 'uploads')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            file_path = os.path.join(upload_folder, filename)
            file_pdf.save(file_path)
            # Store relative path or just filename depending on serving logic. 
            # I'll store 'uploads/filename' 
            file_path = f"uploads/{filename}"

        new_lm = LearningModule(
            module_id=module_id,
            judul=judul,
            file_pdf=file_path
        )
        db.session.add(new_lm)
        db.session.commit()
        return jsonify({"message": "Learning Module created", "id": new_lm.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def get_learning_modules(module_id):
    lms = LearningModule.query.filter_by(module_id=module_id).all()
    result = [{"id": l.id, "judul": l.judul, "file_pdf": l.file_pdf} for l in lms]
    return jsonify(result), 200

def update_learning_module(id):
    lm = LearningModule.query.get_or_404(id)
    try:
        lm.judul = request.form.get('judul', lm.judul)
        file_pdf = request.files.get('file_pdf')
        if file_pdf:
            filename = secure_filename(file_pdf.filename)
            upload_folder = os.path.join(os.getcwd(), 'uploads')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            file_path = os.path.join(upload_folder, filename)
            file_pdf.save(file_path)
            lm.file_pdf = f"uploads/{filename}"
            
        db.session.commit()
        return jsonify({"message": "Learning Module updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def delete_learning_module(id):
    lm = LearningModule.query.get_or_404(id)
    try:
        db.session.delete(lm)
        db.session.commit()
        return jsonify({"message": "Learning Module deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# --- Question ---
def create_question():
    data = request.json
    try:
        new_q = Question(
            module_id=data['module_id'],
            soal=data['soal']
        )
        db.session.add(new_q)
        db.session.commit()
        return jsonify({"message": "Question created", "id": new_q.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def get_questions(module_id):
    questions = Question.query.filter_by(module_id=module_id).all()
    result = []
    for q in questions:
        opts = [{"id": o.id, "opsi": o.opsi, "is_correct": o.is_correct} for o in q.options]
        result.append({
            "id": q.id,
            "soal": q.soal,
            "options": opts
        })
    return jsonify(result), 200

def update_question(id):
    data = request.json
    q = Question.query.get_or_404(id)
    try:
        q.soal = data.get('soal', q.soal)
        db.session.commit()
        return jsonify({"message": "Question updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def delete_question(id):
    q = Question.query.get_or_404(id)
    try:
        db.session.delete(q)
        db.session.commit()
        return jsonify({"message": "Question deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# --- Option ---
def create_option():
    data = request.json
    try:
        new_opt = Option(
            question_id=data['question_id'],
            opsi=data['opsi'],
            is_correct=data.get('is_correct', False)
        )
        db.session.add(new_opt)
        db.session.commit()
        return jsonify({"message": "Option created", "id": new_opt.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def get_options(question_id):
    options = Option.query.filter_by(question_id=question_id).all()
    result = [{"id": o.id, "opsi": o.opsi, "is_correct": o.is_correct} for o in options]
    return jsonify(result), 200

def update_option(id):
    data = request.json
    opt = Option.query.get_or_404(id)
    try:
        opt.opsi = data.get('opsi', opt.opsi)
        opt.is_correct = data.get('is_correct', opt.is_correct)
        db.session.commit()
        return jsonify({"message": "Option updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

def delete_option(id):
    opt = Option.query.get_or_404(id)
    try:
        db.session.delete(opt)
        db.session.commit()
        return jsonify({"message": "Option deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
