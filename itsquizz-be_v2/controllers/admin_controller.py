from flask import jsonify
from models import Score, User, Assessment, Module


def get_recap(assesment_id=None):

    print(assesment_id)
    if assesment_id is None:
        scores = Score.query.all()
    else:
        assessment = Assessment.query.get(assesment_id)
        module_ids = [module.id for module in assessment.modules]
        scores = Score.query.filter(Score.module_id.in_(module_ids)).all()

    data = []

    for score in scores:
        user = User.query.get(score.user_id)
        module = Module.query.get(score.module_id)

        data.append({
            "nip": user.nip,
            "nama": user.nama,
            "assessment": module.assessment.nama_assessment,
            "module": module.nama_module,
            "jenis_module": module.jenis_module,
            "nilai": score.score,
            "percobaan": score.percobaan_ke,
            "timestamp": score.tanggal_pengerjaan.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return jsonify(data)

def get_dashboard_stats():

    scores = Score.query.all()
    unique_user_ids = {score.user_id for score in scores}
   
    passing_score = 80  # Define passing score threshold
   

    assessments = Assessment.query.all()
    
    stats = []
    
    for assessment in assessments:
        assessment_scores = Score.query.filter(
            Score.module_id.in_(
                [m.id for m in assessment.modules]
            )
        ).all()
        assessment_user_ids = {score.user_id for score in assessment_scores}
        total_assessment_users = len(assessment_user_ids)
        completed_count = sum(1 for score in assessment_scores if score.score >= passing_score)
        
        stats.append({
            "id": assessment.id,
            "name": assessment.nama_assessment,
            "totalUsers": total_assessment_users,
            "completed": completed_count,
        })

    return jsonify(stats)
