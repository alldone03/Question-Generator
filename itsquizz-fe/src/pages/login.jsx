import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Email dan password wajib diisi");
            setLoading(false);
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Format email tidak valid");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                credentials: "include",   // WAJIB untuk session Flask
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login gagal");
                setLoading(false);
                return;
            }

            // Simpan user di localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            setLoading(false);
            navigate("/");

        } catch (error) {
            setError("Tidak dapat terhubung ke server " + error.message);
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-lg rounded-2xl p-8 w-80"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login - ITS Quizz</h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <div className="mb-4">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                    />
                </div>
                <Link to="/register" className="text-sm text-blue-500 hover:underline mb-4 inline-block">
                    Belum punya akun? Register
                </Link>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}
