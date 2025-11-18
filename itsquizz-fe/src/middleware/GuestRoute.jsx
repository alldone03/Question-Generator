import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GuestRoute({ children }) {
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

    if (isAuth === null) return <div>Loading...</div>;

    if (isAuth) return <Navigate to="/" replace />;

    return children;
}
