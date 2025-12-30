import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Briefcase } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        nama: '',
        nip: '',
        email: '',
        password: '',
        jabatan: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran');
        } finally {
            setLoading(false);
        }
    };

    const jabatanList = [
        "Teknisi",
        "Supervisor",
        "Manager",
        "Admin",
        "Operator",
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/10 to-primary/10">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200">
                <div className="card-body gap-6">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="bg-secondary text-secondary-content p-3 rounded-2xl shadow-lg">
                            <UserPlus size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-base-content mt-2">Daftar Akun</h1>
                        <p className="text-base-content/60">Gabung dengan Quiz & Assessment System</p>
                    </div>

                    {error && (
                        <div className="alert alert-error text-sm py-3">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control md:col-span-1">
                            <label className="label">
                                <span className="label-text font-medium">Nama Lengkap</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                    <User size={18} />
                                </div>
                                <input
                                    name="nama"
                                    type="text"
                                    placeholder="Aldan"
                                    className="input input-bordered w-full pl-10 focus:input-secondary transition-all"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control md:col-span-1">
                            <label className="label">
                                <span className="label-text font-medium">NIP</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                    <span className="text-xs font-bold font-mono">ID</span>
                                </div>
                                <input
                                    name="nip"
                                    type="text"
                                    placeholder="002"
                                    className="input input-bordered w-full pl-10 focus:input-secondary transition-all"
                                    value={formData.nip}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="aldan@mail.com"
                                    className="input input-bordered w-full pl-10 focus:input-secondary transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control md:col-span-1">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full pl-10 focus:input-secondary transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control md:col-span-1">
                            <label className="label">
                                <span className="label-text font-medium">Jabatan</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 z-10">
                                    <Briefcase size={18} />
                                </div>
                                <select
                                    name="jabatan"
                                    className="select select-bordered w-full pl-10 focus:select-secondary transition-all appearance-none"
                                    value={formData.jabatan}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Pilih Jabatan</option>
                                    {jabatanList.map((jabatan) => (
                                        <option key={jabatan} value={jabatan}>
                                            {jabatan}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="form-control md:col-span-2 mt-4">
                            <button
                                type="submit"
                                className={`btn btn-secondary w-full text-lg shadow-md hover:shadow-lg transition-all duration-300 ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm mt-2 text-base-content/60">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="link link-secondary font-semibold no-underline hover:underline">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
