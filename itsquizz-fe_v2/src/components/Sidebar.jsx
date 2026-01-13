import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Settings, Layers } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="menu p-4 w-80 min-h-full bg-base-100/95 backdrop-blur-sm border-r border-base-200 text-base-content flex flex-col">
            {/* Logo Section */}
            <div className="flex items-center gap-2 mb-8 px-2">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold tracking-tight text-primary">Cogniva</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/dashboard"
                            className={`${isActive('/dashboard') ? 'active' : ''} font-medium gap-3`}
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </Link>
                    </li>
                    {user?.jabatan === 'SuperAdmin' && (
                        <li>
                            <Link
                                to="/admin"
                                className={`${isActive('/admin') ? 'active' : ''} font-medium gap-3`}
                            >
                                <Settings size={20} />
                                Admin
                            </Link>
                        </li>
                    )}
                    {user?.jabatan === 'SuperAdmin' && (
                        <li>
                            <Link
                                to="/admin/management"
                                className={`${isActive('/admin/management') ? 'active' : ''} font-medium gap-3`}
                            >
                                <Layers size={20} />
                                Manage Data
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            {/* User Profile Section - Bottom */}
            <div className="border-t border-base-200 pt-4 mt-auto">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="avatar placeholder">
                        <div className="bg-primary/10 text-primary rounded-full w-10 border border-primary/20">
                            {user?.nama?.charAt(0) || <User size={20} />}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{user?.nama}</p>
                        <p className="text-xs text-base-content/60 truncate">{user?.jabatan}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn btn-error btn-outline btn-sm w-full gap-2"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
