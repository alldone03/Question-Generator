import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, FileText, BookOpen, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 border-b border-base-200 sticky top-0 z-50">
            <div className="flex-1">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                    <div className="bg-primary text-primary-content p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <FileText size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ITSQuizz</span>
                </Link>
            </div>
            <div className="flex-none gap-4">
                <div className="hidden md:flex gap-1 mr-4">
                    <Link to="/dashboard" className="btn btn-ghost btn-sm gap-2 normal-case font-medium">
                        <LayoutDashboard size={16} />
                        Dashboard
                    </Link>
                    {user?.jabatan === 'SuperAdmin' && (
                        <Link to="/admin" className="btn btn-ghost btn-sm gap-2 normal-case font-medium">
                            <Settings size={16} />
                            Admin
                        </Link>
                    )}
                </div>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full bg-base-200 flex items-center justify-center border border-base-300">
                            {user?.nama?.charAt(0) || <User size={20} />}
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-200">
                        <li className="menu-title px-4 py-2 opacity-60">
                            <p className="text-xs uppercase font-bold tracking-wider">Account</p>
                        </li>
                        <li className="px-4 py-2 border-b border-base-100 mb-1">
                            <p className="font-bold text-base-content leading-tight truncate">{user?.nama}</p>
                            <p className="text-xs text-base-content/60 truncate">{user?.jabatan}</p>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="text-error gap-3 py-3">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
