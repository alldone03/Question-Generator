import { useState } from "react";

export default function RegisterPage() {
    const [form, setForm] = useState({
        nama: "",
        email: "",
        password: "",
        confirmPassword: "",
        jabatan: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const jabatanList = [
        "Teknisi",
        "Supervisor",
        "Manager",
        "Admin",
        "Operator",
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.nama || !form.email || !form.password || !form.confirmPassword || !form.jabatan) {
            setError("Semua kolom wajib diisi");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(form.email)) {
            setError("Format email tidak valid");
            return;
        }

        if (form.password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Konfirmasi password tidak cocok");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: form.nama,
                    email: form.email,
                    password: form.password,
                    jabatan: form.jabatan,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registrasi gagal");
                setLoading(false);
                return;
            }

            setSuccess("Registrasi berhasil");
            setForm({
                nama: "",
                email: "",
                password: "",
                confirmPassword: "",
                jabatan: "",
            });
        } catch (err) {
            setError(`Tidak dapat terhubung ke server ${err.message}`);
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white shadow-lg rounded-2xl p-8 w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

                <div className="mb-4">
                    <label className="block text-sm mb-1">Nama</label>
                    <input
                        type="text"
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                        placeholder="Masukkan nama lengkap"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                        placeholder="Masukkan email"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                        placeholder="Masukkan password"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Konfirmasi Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                        placeholder="Ulangi password"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm mb-1">Jabatan</label>
                    <select
                        name="jabatan"
                        value={form.jabatan}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Pilih Jabatan</option>
                        {jabatanList.map((jab, index) => (
                            <option key={index} value={jab}>{jab}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Menyimpan..." : "Daftar"}
                </button>
            </form>
        </div>
    );
}
