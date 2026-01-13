import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-screen bg-base-200/50">
                {/* Navbar (Mobile Header) */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 animate-in fade-in duration-500">
                    <div className="container mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>

                <footer className="footer footer-center p-6 bg-base-100/50 text-base-content/40 border-t border-base-200">
                    <aside>
                        <p>© {new Date().getFullYear()} - Cogniva Assessment System</p>
                    </aside>
                </footer>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <Sidebar />
            </div>
        </div>
    );
};

export default MainLayout;
