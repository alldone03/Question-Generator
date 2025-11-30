import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const answers = state?.answers || {};
    const title = state?.title || "Hasil Tes";
    const totalQuestions = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;

    const score = Math.round((correctCount / totalQuestions) * 100);

    // Rekomendasi Course
    const courses = [
        {
            id: 1,
            title: "Basic Electrical Safety",
            level: "Beginner",
            desc: "Belajar dasar keselamatan listrik.",
        },
        {
            id: 2,
            title: "Automation PLC Fundamentals",
            level: "Intermediate",
            desc: "Dasar PLC untuk otomasi industri.",
        },
        {
            id: 3,
            title: "Industrial Control System",
            level: "Advanced",
            desc: "Sistem kontrol industri modern.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Hasil Tes */}
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
                    <p className="text-gray-500 mb-6">Tes selesai! Berikut hasil kamu:</p>

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <span className="text-4xl font-bold text-blue-600">{score}</span>
                        </div>
                        <p className="text-gray-600">
                            Benar {correctCount} dari {totalQuestions} soal
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        Kembali ke Halaman Utama
                    </button>
                </div>
            </div>

            {/* Rekomendasi Course */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Rekomendasi Course Untuk Kamu
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                {c.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Level: {c.level}
                            </p>

                            <p className="text-gray-700 mt-3">
                                {c.desc}
                            </p>

                            <button
                                onClick={() => navigate(`/course/${c.id}`)}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
                            >
                                Mulai Belajar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}