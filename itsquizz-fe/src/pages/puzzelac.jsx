import { useEffect, useState } from "react";

export default function PuzzleAC() {
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

    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    useEffect(() => {
        setOpsi(shuffle(opsiAwal));
    }, []);

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

    const checkOrder = () => {
        const feedback = target.map((item, i) => {
            if (!item) return { status: "kosong", benar: jawabanBenar[i] };
            if (item === jawabanBenar[i]) return { status: "benar", benar: jawabanBenar[i] };
            return { status: "salah", benar: jawabanBenar[i] };
        });

        setFeedbackList(feedback);

        const isCorrect = feedback.every((f) => f.status === "benar");
        setCheckStatus(isCorrect ? "success" : "wrong");
    };

    const resetAll = () => {
        setTarget(Array(9).fill(null));
        setOpsi(shuffle(opsiAwal));
        setCheckStatus("idle");
        setFeedbackList([]);
    };

    return (
        <div className="p-6 space-y-10">

            {/* Header */}
            <div className="flex flex-col items-center space-y-2">
                <h2 className="text-lg font-bold">Ujian Prosedur Pemasangan AC</h2>

                <button
                    onClick={checkOrder}
                    className={`
            px-6 py-2 rounded text-white font-bold
            ${checkStatus === "success" ? "bg-green-600" : "bg-blue-600"}
          `}
                >
                    {checkStatus === "success" ? "Benar" : "Check"}
                </button>

                {checkStatus === "success" && (
                    <span className="text-green-700 font-semibold">Sukses</span>
                )}

                {checkStatus === "wrong" && (
                    <span className="text-red-600 font-semibold">Urutan belum tepat</span>
                )}

                {checkStatus === "wrong" && (
                    <button
                        onClick={resetAll}
                        className="px-4 py-1 rounded bg-red-600 text-white font-bold"
                    >
                        Coba Lagi
                    </button>
                )}
            </div>

            {/* Feedback Salah */}
            {checkStatus === "wrong" && (
                <div className="bg-red-50 border border-red-300 p-4 rounded shadow">
                    <h3 className="font-bold mb-2 text-red-700">Petunjuk Urutan Benar:</h3>

                    <ul className="space-y-1">
                        {feedbackList.map((f, i) => (
                            <li key={i} className="text-sm">
                                {f.status === "benar" && (
                                    <span className="text-green-700">
                                        {i + 1}. ✔ {f.benar}
                                    </span>
                                )}
                                {f.status === "salah" && (
                                    <span className="text-red-700">
                                        {i + 1}. ✘ Salah — Seharusnya: {f.benar}
                                    </span>
                                )}
                                {f.status === "kosong" && (
                                    <span className="text-gray-600">
                                        {i + 1}. Kosong — Seharusnya: {f.benar}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Area Target */}
            <div className="flex gap-3 pt-1.5">
                {target.map((item, index) => (
                    <div
                        key={index}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop(index)}
                        className="border rounded-lg bg-gray-100 h-40 flex items-center justify-between px-4 shadow w-1/3"
                    >
                        {item ? (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm">{index + 1}. {item}</span>
                                <button
                                    onClick={() => removePlaced(index)}
                                    className="text-red-500 font-bold"
                                >
                                    X
                                </button>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm">Letakkan di sini</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Opsi */}
            <div>
                <h2 className="text-lg font-bold mb-3">Opsi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opsi.map((item, i) => (
                        <div
                            key={i}
                            draggable
                            onDragStart={() => onDragStart(item)}
                            className="border rounded-lg bg-white p-4 shadow cursor-grab active:cursor-grabbing text-sm"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
