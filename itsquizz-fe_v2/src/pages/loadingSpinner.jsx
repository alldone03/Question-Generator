import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingSpinner = ({ redirectPath = '/dashboard', delay = 2000 }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (redirectPath) {
            const timer = setTimeout(() => {
                navigate(redirectPath);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [navigate, redirectPath, delay]);
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 z-[9999]">
            <div className="flex flex-col items-center gap-6">
                {/* Logo and Text Container */}
                <div className="flex items-center">

                    {/* Logo with OKLCH Color */}
                    <div
                        className="h-16 w-[180px] logo-oklch"
                        aria-label="myITS Logo"
                    />

                    {/* Quiz Text with requested classes */}
                    {/* Note: tx-white is placed here, so we wrap it in a blue background to make it visible */}
                    <div className="px-2 py-2 rounded-xl flex items-center justify-center">
                        <p className="font-bold text-black text-5xl tracking-[2px] mb-0 ml-[10px]">
                            Quiz
                        </p>
                    </div>
                </div>
                {/* Optional: Loading Progress Bar or Spinner */}
                <div className="flex flex-col items-center gap-2 ">
                    <div className="flex justify-center items-center mt-5 gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" role="status"></div>
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse [animation-delay:200ms]" role="status"></div>
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse [animation-delay:400ms]" role="status"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
