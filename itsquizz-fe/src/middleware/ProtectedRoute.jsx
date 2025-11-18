import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("http://localhost:5000/auth/status", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (data.logged_in) {
                    // sinkronkan localStorage
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setIsAuth(true);
                } else {
                    localStorage.removeItem("user");
                    setIsAuth(false);
                }
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                localStorage.removeItem("user");
                setIsAuth(false);
            }
        };

        checkSession();
    }, []);

    // Loading state kecil
    if (isAuth === null) return <div>Loading...</div>;

    // Jika tidak login
    if (!isAuth) return <Navigate to="/login" replace />;

    // Jika login boleh lanjut
    return children;
}