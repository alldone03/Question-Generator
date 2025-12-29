from models import Module

from config.database import db
from flask import request, session, jsonify



def index(assessment_id):
    modules = (
        db.session.query(Module)
        .filter_by(assessment_id=assessment_id)
        .all()
    )
   
    result = [
        {
            "id": m.id,
            "name": m.nama_module,
            "level": m.nama_module,
            "link_module_pembelajaran": "",
            "score": 0,
            "feedback":"",
            "is_openend": i == 0 or m.jenis_module == "Puzzle" or i ==1,
            "jenis_module": m.jenis_module,
            "waktu_pengerjaan": m.waktu_pengerjaan
        }
        for i,m in enumerate(modules)
    ]

    return jsonify({"modules": result}), 200