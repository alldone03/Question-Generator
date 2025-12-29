import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, BookOpen, ChevronRight, PlayCircle } from 'lucide-react';
import { assementModuleService } from '../services/api';

const AssessmentModules = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const locations = useLocation();
    const { nameAssessment } = locations.state;


    useEffect(() => {
        const fetchAssessmentModule = async () => {
            try {
                setLoading(true);
                const response = await assementModuleService.getAssesmentModule(id);

                // Sesuaikan struktur API response dengan format modules
                const formattedModules = response.data.modules.map(module => ({
                    id: module.id,
                    name: module.name,
                    level: module.level || 'Mudah',
                    score: module.score || 0,
                    feedback: module.feedback || 'Belum ada feedback.',
                    link: module.link_module_pembelajaran || '#',
                    waktu_pengerjaan: module.waktu_pengerjaan,
                    jenis_module: module.jenis_module,
                    is_openend: module.is_openend
                }));

                setModules(formattedModules);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch assessments:', err);
                setError('Gagal memuat data assessment');
                setModules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessmentModule();
    }, [id]);


    return (
        <MainLayout>
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-circle shadow-sm bg-base-100">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-base-content capitalize">{nameAssessment}</h1>
                        <p className="text-base-content/60 text-sm">Pilih modul untuk mulai mengerjakan assessment.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div key={module.id} className="card bg-base-100 shadow-md border border-base-200 overflow-hidden flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`badge ${module.level === 'Mudah' ? 'badge-success' : module.level === 'Sedang' ? 'badge-warning' : 'badge-error'} badge-outline font-bold px-4 py-3`}>
                                        {module.level}
                                    </div>
                                    {module.score > 0 && (
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-base-content/40 uppercase block mb-1">Nilai</span>
                                            <span className="text-2xl font-black text-primary">{module.score}</span>
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold mb-4">{module.name}</h2>

                                <div className="bg-base-200/50 rounded-xl p-4 mb-6 min-h-[100px]">
                                    <p className="text-sm font-semibold text-base-content/40 uppercase tracking-tight mb-2">Saran Belajar</p>
                                    <p className="text-sm italic text-base-content/70 leading-relaxed">
                                        "{module.feedback}"
                                    </p>
                                </div>

                                {module.waktu_pengerjaan && (
                                    <div className="text-xs text-base-content/60 mb-4">
                                        ⏱️ Waktu: {module.waktu_pengerjaan} menit
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-base-50 border-t border-base-200 space-y-2 ">
                                <Link to={`/learning/${module.id}`} className="btn btn-ghost btn-block justify-between normal-case border border-base-200 hover:bg-base-200 group">
                                    <span className="flex items-center gap-2">
                                        <BookOpen size={16} className="text-primary" />
                                        Modul Pembelajaran
                                    </span>
                                    <ChevronRight size={16} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    disabled={!module.is_openend}
                                    onClick={() => navigate(`/quiz/${module.id}`, { state: { id: module.id, moduleName: module.name, waktu_pengerjaan: module.waktu_pengerjaan, nameAssessment: nameAssessment } })}
                                    className="btn btn-primary btn-block justify-between normal-case group"
                                >
                                    <span className="flex items-center gap-2 ">
                                        {module.is_openend && <PlayCircle size={18} />}
                                        {module.is_openend ? 'Mulai Assessment' : 'Terkunci'}
                                    </span>
                                    {module.is_openend && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default AssessmentModules;
