import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ClipboardList, Users, ArrowUpRight, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { adminService } from '../services/api';

/*
Contoh JSON yang diterima dari Backend:
[
    { "id": "sarpras", "name": "Sarpras", "totalUsers": 45, "completed": 32 },
    { "id": "gedung", "name": "Gedung", "totalUsers": 28, "completed": 15 },
    { "id": "rth", "name": "RTH", "totalUsers": 12, "completed": 10 },
    { "id": "smart-eco", "name": "Smart Eco Campus", "totalUsers": 8, "completed": 2 }
]
*/

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [assessmentStats, setAssessmentStats] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await adminService.getDashboardStats();
                setAssessmentStats(response.data);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Gagal mengambil data dashboard. Pastikan backend berjalan.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content/60 font-medium">Memuat data dashboard...</p>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="bg-error/10 p-4 rounded-full text-error">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
                    <p className="text-base-content/60">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary btn-sm mt-2">Coba Lagi</button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-base-content mb-2">SuperAdmin Dashboard</h1>
                        <p className="text-base-content/60">Kelola dan pantau seluruh pengerjaan assessment di sistem ini.</p>
                    </div>
                    <Link to="/admin/recap" className="btn btn-primary text-white gap-2 normal-case shadow-lg">
                        <ClipboardList size={18} /> Lihat Rekap Penilaian
                    </Link>
                    {/* <Link to="/admin/management" className="btn btn-secondary text-white gap-2 normal-case shadow-lg ml-2">
                        <Layers size={18} /> Manage Data
                    </Link> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {assessmentStats.map((item) => (
                        <div key={item.id} className="card bg-base-100 shadow-md border border-base-200 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/5 text-primary rounded-xl">
                                        <ClipboardList size={24} />
                                    </div>
                                    <div className="badge badge-outline text-[10px] font-bold tracking-widest uppercase py-2">
                                        Active
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold mb-1">{item.name}</h2>
                                <div className="flex items-center gap-2 mb-6">
                                    <Users size={14} className="text-base-content/40" />
                                    <span className="text-sm font-medium text-base-content/60">{item.totalUsers} Partisipan</span>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-primary">{item.completed}</span>
                                        <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Selesai</span>
                                    </div>
                                    <Link
                                        to={`/admin/recap/${item.id}`}
                                        className="btn btn-ghost btn-sm btn-circle bg-base-200 hover:bg-primary hover:text-primary-content transition-all"
                                    >
                                        <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            </div>
                            <div className="h-1 bg-primary/10 w-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${(item.completed / item.totalUsers) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;
