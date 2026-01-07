import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { quizService } from '../services/api';

// questions will be fetched from backend

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [resultResp, setResultResp] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // default 10 minutes in seconds
    const [showResults, setShowResults] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [quizError, setQuizError] = useState(null);
    // const [suggestions, setSuggestions] = useState(null);
    // const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    // const [suggestionsError, setSuggestionsError] = useState(null);
    const location = useLocation();
    const { moduleName, waktu_pengerjaan, nameAssessment } = location.state || {};


    useEffect(() => {
        setTimeLeft(waktu_pengerjaan ?? 600);
    }, [waktu_pengerjaan]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoadingQuestions(true);
                const response = await quizService.getQuiz(id);
                // backend may return array or object; normalize
                // console.log(response.data);

                const data = response.data.questions ?? [];
                const formatted = (Array.isArray(data) ? data : []).map(q => ({
                    id: q.id,
                    text: q.text ?? q.soal,
                    options: q.options ?? [],
                    correct: typeof q.correct === 'number' ? q.correct : 0,
                }));


                setQuestions(formatted.sort(() => Math.random() - 0.5));

                setQuizError(null);
            } catch (err) {
                console.error('Failed to fetch quiz:', err);
                setQuizError('Gagal memuat data kuis');
                setQuestions([]);
            } finally {
                setLoadingQuestions(false);
            }
        };

        if (id) fetchQuiz();
    }, [id]);



    useEffect(() => {
        if (showResults) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [showResults]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (index) => {
        setAnswers({ ...answers, [currentQuestion]: index });
    };



    const handleFinish = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) {
                correctCount++;
            }
        });
        const score = Math.round((correctCount / questions.length) * 100);
        setFinalScore(score);
        setShowResults(true);
        handleResultAssesment();
    };

    const buildLearningPayload = () => {
        return questions.map((q, idx) => ({
            question_id: q.id,
            question: q.text,
            selected_answer_id: q.options[answers[idx]]?.id ?? null,
            correct_answer_id: q.options[q.correct]?.id ?? null,
            isCorrect: answers[idx] === q.correct,
            timeSpent: waktu_pengerjaan - timeLeft // Assuming timeSpent is calculated this way
        }));
    };

    const handleResultAssesment = async () => {
        try {
            // setLoadingSuggestions(true);
            // setSuggestionsError(null);
            const payload = { answers: buildLearningPayload(), score: finalScore, timeSpent: waktu_pengerjaan - timeLeft, module_id: id, };

            // console.log(payload);

            const res = await quizService.resultAssesment(payload);
            // assume backend returns { suggestions: string }
            setResultResp(res.data ?? res.data);
        } catch (err) {
            console.error('Failed to get suggestions:', err);
            // setSuggestionsError('Gagal mendapatkan rekomendasi. Coba lagi.');
        } finally {
            // setLoadingSuggestions(false);
        }
    };

    // const getFeedback = (score) => {
    //     if (score === 100) return { title: "Luar Biasa!", text: "Anda memahami seluruh materi dengan sempurna. Pertahankan prestasi ini!", color: "text-success", icon: <CheckCircle2 size={48} className="text-success" /> };
    //     if (score >= 80) return { title: "Sangat Bagus!", text: "Anda memiliki pemahaman yang kuat tentang materi ini. Sedikit lagi menuju sempurna.", color: "text-primary", icon: <CheckCircle2 size={48} className="text-primary" /> };
    //     if (score >= 50) return { title: "Kerja Bagus!", text: "Anda sudah memahami dasar-dasarnya, namun masih ada beberapa bagian yang perlu dipelajari kembali.", color: "text-warning", icon: <AlertCircle size={48} className="text-warning" /> };
    //     return { title: "Tetap Semangat!", text: "Jangan berkecil hati. Pelajari kembali modul pembelajaran dan coba kuis ini lagi untuk hasil yang lebih baik.", color: "text-error", icon: <AlertCircle size={48} className="text-error" /> };
    // };
    const normalizeKategori = (value = "") => {
        const v = value.toLowerCase();
        if (v.includes("mudah")) return "mudah";
        if (v.includes("sedang")) return "sedang";
        if (v.includes("sulit")) return "sulit";
        return null;
    };

    const getFeedback = (score) => {
        const kategori = normalizeKategori(moduleName);
        const namaBab = nameAssessment || "tertentu";

        // ===== MUDAH =====
        if (kategori === "mudah") {
            const naikLevel = score > 80;

            return {
                title: "Asesmen Kategori Mudah Selesai",
                level: naikLevel ? "Sedang" : "Mudah",
                text: naikLevel
                    ? `Selamat, Anda telah menyelesaikan asesmen kategori Mudah pada Bab ${namaBab} dengan skor ${score}.
Hasil ini menunjukkan penguasaan materi yang baik.
Anda dinilai siap melanjutkan ke asesmen kategori Sedang.`
                    : `Terima kasih, Anda telah menyelesaikan asesmen kategori Mudah pada Bab ${namaBab} dengan skor ${score}.
Berdasarkan hasil ini, AI memetakan kompetensi Anda masih berada pada level Mudah.
Disarankan untuk mempelajari kembali modul dan mengerjakan ulang asesmen.`,
                color: naikLevel ? "text-success" : "text-warning",
                icon: naikLevel
                    ? <CheckCircle2 size={48} className="text-success" />
                    : <AlertCircle size={48} className="text-warning" />
            };
        }

        // ===== SEDANG =====
        if (kategori === "sedang") {
            const naikLevel = score > 80;

            return {
                title: "Asesmen Kategori Sedang Selesai",
                level: naikLevel ? "Sulit" : "Sedang",
                text: naikLevel
                    ? `Selamat, Anda telah menyelesaikan asesmen kategori Sedang pada Bab ${namaBab} dengan skor ${score}.
AI memetakan kompetensi teknis Anda siap untuk naik ke kategori Sulit.
Silakan melanjutkan ke asesmen tingkat lanjutan.`
                    : `Anda telah menyelesaikan asesmen kategori Sedang pada Bab ${namaBab} dengan skor ${score}.
Berdasarkan hasil ini, kompetensi Anda masih berada pada level Sedang.
Disarankan untuk meninjau kembali materi sebelum melanjutkan.`,
                color: naikLevel ? "text-success" : "text-warning",
                icon: naikLevel
                    ? <CheckCircle2 size={48} className="text-success" />
                    : <AlertCircle size={48} className="text-warning" />
            };
        }

        // ===== SULIT (FINAL) =====
        if (kategori === "sulit") {
            const advanced = score > 80;

            return {
                title: advanced
                    ? "Profil Akhir: Advanced"
                    : "Profil Kompetensi Ditahan",
                level: advanced ? "Advanced" : "Sulit",
                text: advanced
                    ? `Selamat, Anda telah menyelesaikan seluruh asesmen pada Bab ${namaBab} dengan skor ${score}.
AI menetapkan profil akhir Anda pada level Advanced.
Sistem merekomendasikan Anda mengikuti course lanjutan atau melanjutkan ke bab pembelajaran lain.`
                    : `Anda telah menyelesaikan asesmen kategori Sulit pada Bab ${namaBab} dengan skor ${score}.
Berdasarkan hasil ini, kompetensi Anda masih berada pada level Sulit.
Disarankan untuk mempelajari kembali modul dan mengulang asesmen.`,
                color: advanced ? "text-success" : "text-warning",
                icon: advanced
                    ? <CheckCircle2 size={48} className="text-success" />
                    : <AlertCircle size={48} className="text-warning" />
            };
        }

        return null;
    };

    const isCompleted = Object.keys(answers).length === questions.length;

    if (loadingQuestions) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (quizError) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <div className="alert alert-error">{quizError}</div>
            </div>
        );
    }

    if (showResults) {

        const feedback = getFeedback(finalScore);
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border border-base-200 animate-in zoom-in duration-300">
                    <div className="card-body items-center text-center p-12">
                        <div className="mb-6 bg-base-100 p-6 rounded-full shadow-inner ring-8 ring-base-200">
                            {feedback.icon}
                        </div>

                        <h2 className={`text-4xl font-black mb-2 ${feedback.color}`}>{feedback.title}</h2>
                        <p className="text-base-content/60 max-w-md mx-auto mb-8 font-medium">
                            {feedback.text}
                        </p>
                        <div className='text-sm text-left italic text-base-content/70 leading-relaxed'>
                            {finalScore >= 80 ? (<>Tingkatan Kompetensi berikutnya telah terbuka</>) : ""}
                            <br />
                            {finalScore < 80 && (
                                <>
                                    <p>Pelajari Materi:</p>
                                    {resultResp.recommendation?.trim()
                                        ? resultResp.recommendation
                                            .split('\n')
                                            .filter(line => line.trim().length > 0)
                                            .map((line) => {
                                                const parts = line.split('|');
                                                if (parts.length < 4) return null;

                                                const [path, page, id, title] = parts;

                                                return (
                                                    <p key={id ?? `${path}-${page}-${title}`}>
                                                        - {path}, Halaman <strong>{page}</strong>: {title}
                                                    </p>
                                                );
                                            })
                                        : null}
                                </>
                            )}
                        </div>

                        <div className="stats shadow bg-base-200 w-full mb-8">
                            <div className="stat">
                                <div className="stat-title uppercase text-[10px] font-bold tracking-widest">Skor Akhir</div>
                                <div className={`stat-value text-5xl font-black ${feedback.color}`}>{finalScore}</div>
                                {/* <div className="stat-desc font-bold mt-1">Sertifikasi Modular: {finalScore >= 75 ? 'LULUS' : 'TIDAK LULUS'}</div> */}
                            </div>
                            <div className="stat">
                                <div className="stat-title uppercase text-[10px] font-bold tracking-widest">Waktu Tersisa</div>
                                <div className="stat-value text-5xl font-black text-base-content/40">{formatTime(timeLeft)}</div>
                                <div className="stat-desc font-bold mt-1">Total 10 Menit</div>
                            </div>
                        </div>

                        {/* <div className="w-full mb-6">
                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={handleGetSuggestions}
                                    disabled={loadingSuggestions}
                                    className="btn btn-outline w-full max-w-sm normal-case py-3"
                                >
                                    {loadingSuggestions ? <span className="loading loading-spinner" /> : 'Dapatkan Rekomendasi Belajar'}
                                </button>

                                {suggestionsError && <div className="text-error text-sm mt-2">{suggestionsError}</div>}

                                {suggestions && (
                                    <div className="card w-full max-w-2xl bg-base-100 mt-4 p-4 border border-base-200">
                                        <div className="card-body">
                                            <h4 className="font-bold mb-2">Rekomendasi Belajar</h4>
                                            <div className="text-sm whitespace-pre-line">
                                                {typeof suggestions === 'string' ? suggestions : JSON.stringify(suggestions, null, 2)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-outline flex-1 normal-case py-4 h-auto shadow-sm"
                            >
                                Kembali ke Dashboard
                            </button>
                            {/* <button
                                onClick={() => navigate(`/assessment/${id}`)}
                                className="btn btn-primary flex-1 normal-case py-4 h-auto shadow-md"
                            >
                                Lihat Detail Modul
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Quiz Header */}
            <header className="bg-base-100 shadow-md border-b border-base-200 px-6 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center max-w-5xl">
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">Kuis Assessment: {nameAssessment} {moduleName}</h1>
                        {/* <span className="text-xs font-medium text-base-content/50">Wajib diisi untuk mendapatkan sertifikasi modular</span> */}
                    </div>

                    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${timeLeft < 60 ? 'bg-error/10 border-error/20 text-error animate-pulse' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                        <Clock size={18} />
                        <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 flex flex-col items-center gap-6 overflow-y-auto">
                {/* Progress Stepper */}
                <div className="container max-w-5xl">
                    <div className="bg-base-100 p-2 rounded-2xl flex gap-1 mb-4 shadow-sm">
                        {questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`flex-1 h-3 rounded-full transition-all duration-300 ${currentQuestion === idx
                                    ? 'bg-primary ring-4 ring-primary/20'
                                    : answers[idx] !== undefined
                                        ? 'bg-primary/40'
                                        : 'bg-base-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="container max-w-5xl grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Question Side */}
                    <div className="lg:col-span-3 card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-primary text-primary-content font-black w-10 h-10 flex items-center justify-center rounded-xl shadow-lg ring-4 ring-primary/20">
                                    {currentQuestion + 1}
                                </span>
                                <span className="font-bold text-base-content/40 uppercase tracking-widest text-sm">Pertanyaan dari {questions.length}</span>
                            </div>

                            <h2 className="text-2xl font-bold mb-8 leading-snug">
                                {questions[currentQuestion].text}
                            </h2>

                            <div className="flex flex-col gap-3">
                                {questions[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectOption(idx)}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 group ${answers[currentQuestion] === idx
                                            ? 'bg-primary/10 border-primary ring-4 ring-primary/10'
                                            : 'bg-base-100 border-base-200 hover:border-primary/50 hover:bg-base-50'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${answers[currentQuestion] === idx ? 'bg-primary border-primary' : 'border-base-300 group-hover:border-primary/50'
                                            }`}>
                                            {answers[currentQuestion] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className={`font-medium ${answers[currentQuestion] === idx ? 'text-primary' : ''}`}>
                                            {option["text"]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-base-50/50 border-t border-base-200">
                            <button
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                                className="btn btn-ghost gap-2 normal-case font-bold disabled:opacity-30"
                            >
                                <ChevronLeft size={20} /> Sebelumnya
                            </button>

                            {currentQuestion < questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                                    className="btn btn-primary gap-2 min-w-[140px] shadow-md"
                                >
                                    Selanjutnya <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinish}
                                    disabled={!isCompleted}
                                    className="btn btn-success text-black gap-2 shadow-md min-w-[140px]"
                                >
                                    <CheckCircle2 size={18} /> Selesai Kuis
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation Grid (Sidebar) */}
                    <div className="card bg-base-100 shadow-md border border-base-200 p-6 flex flex-col gap-6">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50">Navigasi Soal</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`w-full aspect-square flex items-center justify-center rounded-xl text-sm font-bold border-2 transition-all ${currentQuestion === idx
                                        ? 'bg-primary border-primary text-primary-content ring-4 ring-primary/20'
                                        : answers[idx] !== undefined
                                            ? 'bg-primary/20 border-primary/20 text-primary'
                                            : 'bg-base-100 border-base-200 hover:border-primary/50'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <div className="divider my-0 opacity-50"></div>

                        <div className="bg-warning/10 p-4 rounded-xl border border-warning/20">
                            <div className="flex items-center gap-2 text-warning font-bold text-xs mb-1 uppercase">
                                <AlertCircle size={14} /> Perhatian
                            </div>
                            <p className="text-[11px] text-warning-content opacity-70 leading-relaxed font-medium">
                                Pastikan semua soal terjawab sebelum menekan tombol Selesai. Progress akan tersimpan otomatis.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizPage;
