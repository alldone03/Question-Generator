import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Clock, ChevronLeft, CheckCircle2, AlertCircle, RefreshCw, Trash2, ArrowRight } from "lucide-react";
import { quizService } from "../services/api";

export default function PuzzleAC() {
    const { id: module_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { moduleName, waktu_pengerjaan, nameAssessment } = location.state || {};

    const opsiAwal = [
        "Periksa sumber listrik dan MCB",
        "Kencangkan baut bracket indoor",
        "Cek posisi pipa refrigeran agar tidak tertekuk",
        "Lakukan vakum minimal 15 menit sampai -30 inHg",
        "Tes kebocoran sambungan flare dengan air sabun",
        "Nyalakan AC dan pantau arus kompresor",
        "Ukur suhu hembusan, pastikan turun 1–2°C dalam 10 menit",
        "Amati getaran dan suara mesin",
        "Periksa aliran air pada drainase"
    ];

    const jawabanBenar = [...opsiAwal];

    const [opsi, setOpsi] = useState([]);
    const [target, setTarget] = useState(Array(9).fill(null));
    const [dragItem, setDragItem] = useState(null);
    const [checkStatus, setCheckStatus] = useState("idle");
    const [feedbackList, setFeedbackList] = useState([]);
    const [timeLeft, setTimeLeft] = useState(waktu_pengerjaan || 600);
    const [showResults, setShowResults] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const shuffle = useCallback((array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, []);

    useEffect(() => {
        setOpsi(shuffle(opsiAwal));
    }, [shuffle]);

    useEffect(() => {
        if (showResults) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [showResults]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const onDragStart = (item) => {
        setDragItem(item);
        setCheckStatus("idle");
    };

    const onDrop = (index) => {
        if (!dragItem) return;
        if (target[index]) return;

        const newTarget = [...target];
        const newOpsi = opsi.filter((o) => o !== dragItem);

        newTarget[index] = dragItem;

        setTarget(newTarget);
        setOpsi(newOpsi);
        setDragItem(null);
        setCheckStatus("idle");
    };

    const removePlaced = (index) => {
        const item = target[index];
        if (!item) return;

        const newTarget = [...target];
        newTarget[index] = null;

        setTarget(newTarget);
        setOpsi([...opsi, item]);
        setCheckStatus("idle");
    };

    const handleFinish = async () => {
        let correctCount = 0;
        const feedback = target.map((item, i) => {
            const isCorrect = item === jawabanBenar[i];
            if (isCorrect) correctCount++;
            return {
                status: item ? (isCorrect ? "benar" : "salah") : "kosong",
                benar: jawabanBenar[i],
                isi: item
            };
        });

        const score = Math.round((correctCount / jawabanBenar.length) * 100);
        setFinalScore(score);
        setFeedbackList(feedback);
        setShowResults(true);

        // Submit to API
        try {
            setIsSubmitting(true);
            const timeTaken = (waktu_pengerjaan) - timeLeft;
            const payload = {
                score: score,
                timeSpent: timeTaken,
                module_id: module_id,
                answers: feedback.map((f, i) => ({
                    step: i + 1,
                    correct: f.benar,
                    userAnswer: f.isi,
                    isCorrect: f.status === "benar"
                }))
            };
            console.log("Submitting Puzzle Result:", payload);
            await quizService.resultAssesment(payload);
        } catch (error) {
            console.error("Failed to submit results:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAll = () => {
        setTarget(Array(9).fill(null));
        setOpsi(shuffle(opsiAwal));
        setCheckStatus("idle");
        setFeedbackList([]);
        setShowResults(false);
    };

    const getFeedbackUI = (score) => {
        if (score === 100) return { title: "Luar Biasa!", text: "Anda memahami seluruh prosedur dengan sempurna!", color: "text-success", icon: <CheckCircle2 size={48} className="text-success" /> };
        if (score >= 90) return { title: "Sangat Bagus!", text: "Hampir sempurna, perhatikan lagi beberapa urutan kecil.", color: "text-primary", icon: <CheckCircle2 size={48} className="text-primary" /> };
        if (score >= 80) return { title: "Cukup Baik!", text: "Anda memahami dasarnya, namun urutannya masih perlu diperbaiki.", color: "text-warning", icon: <AlertCircle size={48} className="text-warning" /> };
        return { title: "Ayo Belajar Lagi!", text: "Urutan kerja adalah kunci keselamatan. Pelajari kembali modulnya.", color: "text-error", icon: <AlertCircle size={48} className="text-error" /> };
    };

    if (showResults) {
        const feedbackUI = getFeedbackUI(finalScore);
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <div className="card w-full max-w-3xl bg-base-100 shadow-2xl border border-base-200 animate-in zoom-in duration-300">
                    <div className="card-body items-center text-center p-8 md:p-12">
                        <div className="mb-6 bg-base-100 p-6 rounded-full shadow-inner ring-8 ring-base-200">
                            {feedbackUI.icon}
                        </div>

                        <h2 className={`text-4xl font-black mb-2 ${feedbackUI.color}`}>{feedbackUI.title}</h2>
                        <p className="text-base-content/60 max-w-md mx-auto mb-8 font-medium">
                            {feedbackUI.text}
                        </p>

                        <div className="stats shadow bg-base-200 w-full mb-8">
                            <div className="stat">
                                <div className="stat-title uppercase text-sm font-bold tracking-widest">Skor Akhir</div>
                                <div className={`stat-value text-5xl font-black ${feedbackUI.color}`}>{finalScore}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title uppercase text-sm font-bold tracking-widest">Waktu</div>
                                <div className="stat-value text-5xl font-black text-base-content/40">
                                    {formatTime((waktu_pengerjaan) - timeLeft)}
                                </div>
                                <div className="stat-desc font-bold mt-1">Durasi Pengerjaan</div>
                            </div>
                        </div>

                        <div className="w-full text-left bg-base-200/50 rounded-2xl p-6 mb-8 overflow-y-auto max-h-60">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <AlertCircle size={18} /> Review Prosedur
                            </h3>
                            <ul className="space-y-3">
                                {feedbackList.map((f, i) => (
                                    <li key={i} className={`text-base p-3 rounded-xl border ${f.status === 'benar' ? 'bg-success/10 border-success/20 text-success' : 'bg-error/10 border-error/20 text-error'}`}>
                                        <div className="font-bold flex justify-between">
                                            <span>Langkah {i + 1}</span>
                                            {f.status === 'benar' ? '✔ Tepat' : '✘ Keliru'}
                                        </div>
                                        <div className="mt-1">
                                            {f.status === 'benar' ? (
                                                f.isi
                                            ) : (
                                                <>
                                                    <div className="opacity-70 line-through">Input: {f.isi || '(Kosong)'}</div>
                                                    <div className="font-semibold text-base-content mt-1">Seharusnya: {f.benar}</div>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-outline flex-1 normal-case shadow-sm"
                            >
                                Kembali ke Dashboard
                            </button>
                            <button
                                onClick={resetAll}
                                className="btn btn-primary flex-1 normal-case shadow-md"
                            >
                                <RefreshCw size={18} /> Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Header */}
            <header className="bg-base-100 shadow-md border-b border-base-200 px-6 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center max-w-6xl">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle btn-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">Puzzle Prosedur: {moduleName}</h1>
                            <span className="text-sm font-medium text-base-content/50 truncate max-w-[200px] md:max-w-none">{nameAssessment}</span>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${timeLeft < 60 ? 'bg-error/10 border-error/20 text-error animate-pulse' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                        <Clock size={18} />
                        <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 max-w-6xl mx-auto w-full">
                {/* Instructions */}
                <div className="alert bg-primary/10 border-primary/20 shadow-sm rounded-2xl py-3 px-4">
                    <AlertCircle className="text-primary w-5 h-5" />
                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-primary">Instruksi Puzzle</h3>
                        <p className="text-sm opacity-80">Tarik langkah ke kotak urutan yang benar.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Target Area */}
                    <div className="flex-1 w-full space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest text-base-content/40 flex items-center gap-2">
                            <CheckCircle2 size={24} className="text-primary" /> Urutan Prosedur
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-base-100 p-4 rounded-3xl shadow-xl border border-base-200">
                            {target.map((item, index) => (
                                <div
                                    key={index}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => onDrop(index)}
                                    className={`
                                        relative group min-h-[100px] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-3 text-center
                                        ${item ? 'bg-primary/5 border-primary border-solid' : 'bg-base-200/50 border-base-300 hover:border-primary/50 hover:bg-base-200'}
                                    `}
                                >
                                    <div className={`
                                        absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center font-black text-sm shadow-sm
                                        ${item ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/40'}
                                    `}>
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                                        {item ? (
                                            <>
                                                <p className="text-sm font-bold text-primary leading-tight">{item}</p>
                                                <button
                                                    onClick={() => removePlaced(index)}
                                                    className="btn btn-ghost btn-circle btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-base-content/30 text-sm font-medium italic">Tarik ke sini...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleFinish}
                            disabled={isSubmitting || target.some(t => t === null)}
                            className="btn btn-primary btn-block h-12 rounded-xl shadow-lg normal-case text-sm font-bold"
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <>
                                    Selesaikan Assessment <ArrowRight size={16} className="ml-2" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Options Area */}
                    <div className="flex-1 w-full space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest text-base-content/40 flex items-center gap-2">
                            <RefreshCw size={24} /> Pilihan Langkah
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {opsi.map((item, i) => (
                                <div
                                    key={i}
                                    draggable
                                    onDragStart={() => onDragStart(item)}
                                    className="
                                        group select-none cursor-grab active:cursor-grabbing bg-base-100 p-3 rounded-xl border border-base-200 shadow-sm 
                                        hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2
                                    "
                                >
                                    <div className="w-1 h-6 bg-base-300 rounded-full group-hover:bg-primary transition-colors"></div>
                                    <span className="text-sm font-bold leading-tight">{item}</span>
                                </div>
                            ))}
                            {opsi.length === 0 && (
                                <div className="col-span-full text-center py-6 opacity-30 select-none">
                                    <div className="flex justify-center mb-2 text-primary">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <p className="text-sm font-medium">Langkah sudah ditempatkan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
