import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Email atau password salah');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
                <div className="card-body gap-6">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="bg-primary text-primary-content p-3 rounded-2xl shadow-lg">
                            <LogIn size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-base-content mt-2">Login</h1>
                        <p className="text-base-content/60">Cogniva AI Assessment System</p>
                    </div>

                    {error && (
                        <div className="alert alert-error text-sm py-3 animate-bounce">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="form-control">
                            <label className="label m-1">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@mail.com"
                                    className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label m-1">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className={`btn btn-primary  w-full text-lg font-bold text-white shadow-md hover:shadow-lg transition-all duration-300 ${loading ? 'loading-sm' : 'bg-blue-500'}`}
                                disabled={loading}
                            >
                                {loading ? 'Masuk...' : 'Masuk'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm mt-4 text-base-content/60">
                        Belum punya akun?{' '}
                        <Link to="/register" className="link link-primary font-semibold no-underline hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
