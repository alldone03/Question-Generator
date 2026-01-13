import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm px-4 border-b border-base-200 lg:hidden sticky top-0 z-40">
            <div className="flex-none">
                <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
            </div>
            <div className="flex-1">
                <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">Cogniva</Link>
            </div>
        </div>
    );
};

export default Navbar;
