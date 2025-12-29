import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const answers = state?.answers || {};
    const title = state?.title || "Hhasil Tes";
    const totalQuestions = Object.keys(answers).length;

    // gunakan state agar bisa diubah
    const [correctCount, setCorrectCount] = useState(
        Object.values(answers).filter((a) => a.correct).length
    );

    // function untuk mengubah correctCount
    const updateCorrectCount = (value) => {
        setCorrectCount(value);
    };

    const score  = Math.round((correctCount / totalQuestions) * 100);

    const courses = [
        { id: 1, title: "Teknisi Pemeliharaan Sarana dan Prasarana", level: "Mudah" },
        { id: 2, title: "Teknisi Pemeliharaan Sarana dan Prasarana", level: "Sedang" },
        { id: 3, title: "Teknisi Pemeliharaan Sarana dan Prasarana", level: "Sulit" },
    ];

    let levelRekomendasi = "";
    if (score <= 70) levelRekomendasi = "Mudah";
    else if (score <= 80) levelRekomendasi = "Sedang";
    else if (score >= 90) levelRekomendasi = "Sulit";

    const rekomendasiPesan = {
        Mudah: `Terima kasih, Anda sudah berusaha menyelesaikan semua pertanyaan!
        Saat ini kompetensi Anda berada pada kategori Mudah.
        Beberapa konsep dasar mengenai Prosedur Kelistrikan dan Pemeliharan Perlengkapan Kantor masih memerlukan penguatan.
        Rekomendasi: Pelajari kembali Materi Dasar – Prosedur Kelistrikan dan Pemeliharan Perlengkapan Kantor sebelum mencoba latihan berikutnya.`,

        Sedang: `Bagus! Kompetensi Anda berada pada kategori Intermediate.
        Anda sudah memahami banyak konsep, namun masih ada beberapa hal yang perlu diperdalam.
        Rekomendasi: Lanjutkan ke Materi Menengah untuk memperkuat pemahaman Anda.`,

        Sulit: `Hebat! Kompetensi Anda berada pada kategori Advanced.
        Anda sudah menguasai sebagian besar konsep dengan baik.
        Rekomendasi: Coba tantangan tingkat lanjut untuk menguji kemampuan Anda lebih jauh.`
    };

    const filteredCourses = courses.filter((c) => c.level === levelRekomendasi);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
                    <p className="text-gray-500 mb-6">Tes selesai! Berikut hasil kamu:</p>

                    <div onClick={() => updateCorrectCount(correctCount + 1)} className="flex flex-col items-center mb-8">
                        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <span className="text-4xl font-bold text-blue-600">{score}</span>
                        </div>
                        <p className="text-gray-600">
                            Benar {correctCount} dari {totalQuestions} soal
                        </p>
                    </div>

                    {/* contoh tombol untuk mengubah correctCount */}
                    {/* <button
                        
                        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Tambah Nilai Benar
                    </button> */}

                    <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                        <p className="text-gray-700 whitespace-pre-line">
                            {rekomendasiPesan[levelRekomendasi]}
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

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Rekomendasi Course Untuk Kamu ({levelRekomendasi})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">Level: {c.level}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
