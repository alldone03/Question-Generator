import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const answers = state?.answers || {};
    const title = state?.title || "Hasil Tes";
    const totalQuestions = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;

    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
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
    );
}