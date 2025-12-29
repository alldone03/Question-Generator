import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import MainLayout from '../layouts/MainLayout';
import { Download, Search, ArrowUpDown, Filter, User } from 'lucide-react';

const mockData = [
    { nip: '001', nama: 'Aldan', assessment: 'Sarpras', nilai: 85, percobaan: 1 },
    { nip: '002', nama: 'Budi', assessment: 'Gedung', nilai: 45, percobaan: 2 },
    { nip: '003', nama: 'Caca', assessment: 'RTH', nilai: 90, percobaan: 1 },
    { nip: '004', nama: 'Dedi', assessment: 'Smart Eco', nilai: 75, percobaan: 1 },
    { nip: '005', nama: 'Eka', assessment: 'Sarpras', nilai: 60, percobaan: 3 },
    { nip: '006', nama: 'Fani', assessment: 'Gedung', nilai: 88, percobaan: 1 },
];

const AdminRecap = () => {
    const [data, setData] = useState(mockData);
    const [sortConfig, setSortConfig] = useState(null);
    const [search, setSearch] = useState('');

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
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nip.includes(search) ||
        item.assessment.toLowerCase().includes(search.toLowerCase())
    );

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
                        className="btn btn-success text-white gap-2 shadow-lg shadow-success/20 hover:shadow-success/30 transition-all font-bold"
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
                                placeholder="Cari NIP, Nama, atau Assessment..."
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
                                        <td colSpan="5" className="text-center py-20 text-base-content/40 font-bold italic">
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
