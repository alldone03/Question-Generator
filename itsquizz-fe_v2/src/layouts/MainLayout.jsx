import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-base-200/50 flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 md:px-8 max-w-7xl animate-in fade-in duration-500">
                {children}
            </main>
            <footer className="footer footer-center p-6 bg-base-100 text-base-content/40 border-t border-base-200">
                <aside>
                    <p>© 2025 - ITSQuizz Assessment System</p>
                </aside>
            </footer>
        </div>
    );
};

export default MainLayout;
