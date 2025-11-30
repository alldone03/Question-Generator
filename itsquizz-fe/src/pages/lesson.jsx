import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import feather from "feather-icons";



export default function Lesson() {
    const { state } = useLocation(); // menerima state.title dari Link
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        feather.replace();
    }, [current]);

    // Ambil soal dari server
    // useEffect(() => {
    //     if (!state?.title) return;

    //     let isFetched = false; // flag untuk mencegah fetch ulang
    //     const jumlahSoal = 10;

    //     if (!isFetched) {
    //         isFetched = true;
    //         fetch(
    //             `http://localhost:5000/generatesoal?context=${encodeURIComponent(
    //                 state.title
    //             )}&count=${jumlahSoal}`
    //         )
    //             .then((res) => res.json())
    //             .then((data) => setQuestions(data))
    //             .catch((err) => console.error("Fetch error:", err));
    //     }

    //     return () => {
    //         isFetched = true; // jika unmount, hentikan fetch
    //     };
    // }, [state]);
    // const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const shuffle = (array) => {
            return array
                .map((a) => ({ sort: Math.random(), value: a }))
                .sort((a, b) => a.sort - b.sort)
                .map((a) => a.value);
        };

        const fetchQuestions = async () => {
            try {
                // fetch list soal berdasarkan level_id
                const qRes = await fetch(`http://localhost:5000/question/level/${state.level_id}`);
                const qData = await qRes.json();

                // ambil opsi dari tiap soal
                const fullQuestions = await Promise.all(
                    qData.map(async (q) => {
                        const optRes = await fetch(`http://localhost:5000/option/question/${q.id}`);
                        const optData = await optRes.json();

                        // ubah format seperti versi LLM
                        return {
                            question: q.question_text,
                            options: optData.map((o) => o.option_text),
                            answer: optData.find((o) => o.is_correct)?.option_text || "",
                        };
                    })
                );
                let shuffledQuestions = [];

                if (true) {
                    shuffledQuestions = shuffle(fullQuestions);
                } else {
                    shuffledQuestions = fullQuestions;
                }

                // console.log(shuffledQuestions);

                setQuestions(shuffledQuestions);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchQuestions();
    }, [state.level_id]);


    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>

                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    AI sedang membuat soal untukmu...
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Mohon tunggu sebentar, proses ini memerlukan waktu sekitar 1–2 menit.
                </p>

                <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 animate-pulse w-3/4 rounded-full"></div>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                    Mengumpulkan data dan menyusun pertanyaan terbaik...
                </p>
            </div>
        );
    }

    const question = questions[current];

    const handleSelect = (option) => {

        setSelected(option);
    };

    const handleCheck = () => {
        if (!selected) return;
        // console.log("Selected:", selected);

        // Mapping abjad → index
        const letterToIndex = {
            A: 0,
            B: 1,
            C: 2,
            D: 3
        };

        const selectedIndex = letterToIndex[selected];
        const selectedOption = question.options[selectedIndex];

        const correct = selectedOption.trim() === question.answer.trim();

        const updatedAnswers = {
            ...answers,
            [current]: {
                selected: selectedOption,   // simpan teks jawabannya
                selectedLetter: selected,   // opsional kalau mau simpan hurufnya
                correct
            }
        };

        setAnswers(updatedAnswers);
        setIsChecked(true);
    };


    const handleNext = () => {
        setSelected(null);
        setIsChecked(false);

        // Jika masih ada soal berikutnya
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            // Hitung total soal dan jumlah benar
            const totalQuestions = questions.length;
            const correctCount = Object.values(answers).filter((a) => a.correct).length;
            const score = Math.round((correctCount / totalQuestions) * 100);

            // Kirim hasil lengkap ke halaman /result
            navigate("/result", {
                state: {
                    title: state.title,
                    answers,
                    totalQuestions,
                    correctCount,
                    score,
                },
            });
        }
    };

    const allAnswered = Object.keys(answers).length === questions.length;

    return (
        <>

            <div>
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <a href="course.html" className="text-gray-500 hover:text-blue-600">
                                <i data-feather="arrow-left" />
                            </a>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 ml-2" style={{ maxWidth: 120 }}>
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-blue-600 font-medium">
                                <i data-feather="zap" className="mr-1" />
                                {/* <span>30 XP</span> */}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <i data-feather="user" className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                </header>
                {/* Lesson Content */}
                <main className="container mx-auto px-4 py-6">
                    {/* Lesson Title */}
                    <div className="mb-8 text-center">
                        {/* <span className="text-sm text-blue-600 font-medium">Modul 3 • Pengembangan/Penambahan Sarana dan Prasarana</span> */}
                        <h1 className="text-2xl font-bold text-gray-800 mt-1">{state.title}</h1>
                    </div>
                    {/* Practice Question */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Soal Latihan</h2>
                            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">{`${current + 1}/${questions.length}`}</span>
                        </div>
                        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">
                                {`Soal ${current + 1} dari ${questions.length}`}
                            </h2>

                            <p className="mb-6">{question.question}</p>

                            <div className="space-y-3 mb-8">
                                {question.options.map((opt, idx) => {
                                    const letter = String.fromCharCode(65 + idx); // A, B, C, D

                                    return (
                                        <div
                                            key={idx}
                                            className={`option-card bg-gray-50 p-4 rounded-lg border transition cursor-pointer 
          ${selected === letter ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                                            onClick={() => handleSelect(letter)}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border-2
              ${selected === letter ? "border-blue-500" : "border-gray-300"}`}
                                                >
                                                    {selected === letter && (
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <span>
                                                    {letter}. {opt}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!isChecked ? (
                                <button
                                    onClick={handleCheck}
                                    disabled={!selected}
                                    className={`w-full py-3 rounded-lg font-medium ${selected
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    Cek Jawaban
                                </button>
                            ) : (
                                <div>
                                    <div
                                        className={`mt-4 p-4 rounded-lg flex items-start ${answers[current]?.correct
                                            ? "bg-green-50 text-green-700"
                                            : "bg-red-50 text-red-700"
                                            }`}
                                    >
                                        <i
                                            data-feather={
                                                answers[current]?.correct ? "check-circle" : "x-circle"
                                            }
                                            className="mr-3 mt-0.5 flex-shrink-0"
                                        />

                                        <div>
                                            <h3 className="font-medium mb-1">
                                                {answers[current]?.correct ? "Benar!" : "Salah"}
                                            </h3>

                                            <p>
                                                Jawaban benar:{" "}
                                                <span className="font-semibold">
                                                    {question.answer}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
                                    >
                                        {current === questions.length - 1 ? "Finish" : "Lanjut"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
                    <div className="flex justify-around">
                        <a href="index.html" className="p-4 text-gray-500">
                            <i data-feather="home" />
                        </a>
                        <a href="course.html" className="p-4 text-gray-500">
                            <i data-feather="book" />
                        </a>
                        <a href="#" className="p-4 text-blue-600">
                            <i data-feather="award" />
                        </a>
                        <a href="#" className="p-4 text-gray-500">
                            <i data-feather="user" />
                        </a>
                    </div>
                </nav>
            </div>

        </>
    )
}
