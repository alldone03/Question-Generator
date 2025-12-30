import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import MainLayout from '../layouts/MainLayout';
import { Download, Search, ArrowUpDown, Filter, User, AlertCircle } from 'lucide-react';
import { adminService } from '../services/api';

/*
Contoh JSON yang diterima dari Backend:
[
    { 
        "nip": "001", 
        "nama": "Aldan", 
        "assessment": "Sarpras", 
        "module": "Layanan sarana dan prasarana", 
        "jenis_module": "Puzzle", 
        "nilai": 85, 
        "percobaan": 1 
    },
    { 
        "nip": "002", 
        "nama": "Budi", 
        "assessment": "Gedung", 
        "module": "Manajemen Aset", 
        "jenis_module": "Pilihan Ganda", 
        "nilai": 45, 
        "percobaan": 2 
    }
]
*/

const AdminRecap = () => {
    const { assessment_id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState(null);
    const [search, setSearch] = useState('');

    React.useEffect(() => {
        const fetchRecap = async () => {
            try {
                setLoading(true);
                const response = await adminService.getRecap(assessment_id);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching recap:", err);
                setError("Gagal mengambil data rekap. Pastikan backend berjalan.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecap();
    }, [assessment_id]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rekap Penilaian");
        XLSX.writeFile(wb, "rekap_penilaian.xlsx");
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };

    const filteredData = data.filter(item =>
        item.nama?.toLowerCase().includes(search.toLowerCase()) ||
        item.nip?.includes(search) ||
        item.assessment?.toLowerCase().includes(search.toLowerCase()) ||
        item.module?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content/60 font-medium">Memuat data rekap...</p>
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
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content mb-1">Rekap Penilaian</h1>
                        <p className="text-base-content/60 text-sm font-medium">Data seluruh pengerjaan assessment oleh user.</p>
                    </div>
                    <button
                        onClick={exportToExcel}
                        className="btn btn-success text-black gap-2 shadow-lg shadow-success/20 hover:shadow-success/30 transition-all font-bold"
                    >
                        <Download size={18} /> Export ke Excel
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                    <div className="p-4 bg-base-50/50 border-b border-base-200 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari NIP, Nama, Assessment, atau Module..."
                                className="input input-bordered w-full pl-10 focus:input-primary transition-all rounded-xl h-11"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-outline btn-square h-11 w-11 border-base-200 hover:bg-base-200 hover:text-base-content hover:border-transparent">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full border-collapse">
                            <thead>
                                <tr className="bg-base-200/50 border-b border-base-200">
                                    <th onClick={() => handleSort('nip')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4">
                                        <div className="flex items-center gap-2">NIP <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                    <th onClick={() => handleSort('nama')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4">
                                        <div className="flex items-center gap-2">Nama <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                    <th onClick={() => handleSort('assessment')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4">
                                        <div className="flex items-center gap-2">Assessment <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                    <th onClick={() => handleSort('module')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4">
                                        <div className="flex items-center gap-2">Module <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                    <th onClick={() => handleSort('jenis_module')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4">
                                        <div className="flex items-center gap-2">Tipe <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                    <th onClick={() => handleSort('nilai')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">Nilai <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                    <th onClick={() => handleSort('percobaan')} className="cursor-pointer hover:bg-base-200 uppercase tracking-widest text-[10px] font-black p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">Percobaan Ke- <ArrowUpDown size={12} className="opacity-40" /></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-base-100">
                                {filteredData.length > 0 ? filteredData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4 font-mono text-sm font-semibold">{item.nip}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-base-200 p-2 rounded-lg text-base-content/60 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                                                    <User size={14} />
                                                </div>
                                                <span className="font-bold">{item.nama}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="badge badge-outline border-base-300 font-bold px-3 py-3 group-hover:border-primary group-hover:text-primary transition-colors">
                                                {item.assessment}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-base-content/70">
                                                {item.module}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className={`badge badge-sm font-bold ${item.jenis_module === 'Puzzle' ? 'badge-secondary' : 'badge-primary'} badge-outline`}>
                                                {item.jenis_module}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-lg font-black ${item.nilai >= 75 ? 'text-success' : 'text-warning'}`}>
                                                {item.nilai}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-bold text-base-content/60">
                                            {item.percobaan}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-20 text-base-content/40 font-bold italic">
                                            Tidak ada data yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-base-50/50 border-t border-base-200 flex justify-between items-center text-xs font-bold text-base-content/40 uppercase tracking-widest">
                        <span>Menampilkan {filteredData.length} dari {data.length} data</span>
                        <div className="join">
                            <button className="join-item btn btn-xs btn-outline border-base-200 hover:bg-base-200 hover:text-base-content hover:border-transparent">Prev</button>
                            <button className="join-item btn btn-xs btn-outline border-base-200 hover:bg-base-200 hover:text-base-content hover:border-transparent">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminRecap;

