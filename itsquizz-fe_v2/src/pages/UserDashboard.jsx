import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { LayoutGrid, Building2, Trees, GraduationCap, ChevronRight, CheckCircle2, BookOpen, Zap, BarChart3, Globe } from 'lucide-react';
import { assesmentService } from '../services/api';
import { AuthContext } from '../context/AuthContext';


// Icon yang tersedia untuk di-randomize
const availableIcons = [
    { component: LayoutGrid, color: 'text-blue-500' },
    { component: Building2, color: 'text-amber-500' },
    { component: Trees, color: 'text-emerald-500' },
    { component: GraduationCap, color: 'text-purple-500' },
    { component: BookOpen, color: 'text-rose-500' },
    { component: Zap, color: 'text-yellow-500' },
    { component: BarChart3, color: 'text-cyan-500' },
    { component: Globe, color: 'text-indigo-500' },
];

const getRandomIcon = () => {
    const randomIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)];
    return {
        component: randomIcon.component,
        color: randomIcon.color
    };
};



const UserDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                setLoading(true);
                const response = await assesmentService.getAssesments({ jabatan: user.jabatan });

                // console.log(response.data.assessments);
                // Tambahkan random icon ke setiap assessment
                const assessmentsWithIcons = (response.data.assessments || []).map(assessment => {
                    const randomIcon = getRandomIcon();

                    return {
                        ...assessment,
                        icon: React.createElement(randomIcon.component, {
                            className: randomIcon.color
                        })
                    };
                });
                setAssessments(assessmentsWithIcons);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch assessments:', err);
                setError('Gagal memuat data assessment');
            } finally {
                setLoading(false);
            }
        };

        // Jangan fetch sebelum user tersedia
        if (user) fetchAssessments();
    }, [user]);

    return (
        <MainLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-base-content mb-2">Assessment</h1>
                    <p className="text-base-content/60">Pilih layanan assessment yang tersedia untuk memulai atau melanjutkan pengerjaan.</p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {assessments.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/assessment/${item.id}`, { state: { nameAssessment: item.name } })}
                                className="group card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 cursor-pointer overflow-hidden active:scale-95"
                            >
                                <div className="card-body p-6 flex-col justify-between">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-base-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            {React.cloneElement(item.icon, { size: 24 })}
                                        </div>
                                        {item.progress === 100 && (
                                            <div className="badge badge-success badge-sm gap-1 py-3 px-3 border-none text-white">
                                                <CheckCircle2 size={12} /> Selesai
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="card-title text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                                        {item.name}
                                    </h2>

                                    <div className="flex items-center justify-between mt-4 mb-2">
                                        <span className="text-sm font-semibold text-base-content/60">Progres</span>
                                        <span className="text-sm font-bold text-primary">{item.progress}%</span>
                                    </div>

                                    <progress
                                        className="progress progress-primary w-full h-2 rounded-full"
                                        value={item.progress}
                                        max="100"
                                    ></progress>

                                    <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-base-content/40 group-hover:text-primary transition-colors">
                                        Detail Assessment
                                        <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default UserDashboard;
