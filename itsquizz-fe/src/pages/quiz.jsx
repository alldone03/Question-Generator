

// Di komponen tujuan
// import { useLocation } from "react-router-dom";

import { useLocation } from "react-router-dom";



export default function Quiz() {
    const { state } = useLocation();
    // console.log(state.title, state.description);

    const level_id = state?.level_id;

    

    return (
        <>
            <div>
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <a href="#" className="text-gray-500 hover:text-blue-600"><i data-feather="arrow-left" /></a>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 ml-2" style={{ maxWidth: 120 }}>
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-blue-600 font-medium">
                                <i data-feather="zap" className="mr-1" /><span>30 XP</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <i data-feather="user" className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                </header>
                {/* Main Content */}
                <main className="container mx-auto px-4 py-6">
                    <div className="mb-8 text-center">
                        <span className="text-sm text-blue-600 font-medium">Latihan Otomatis</span>
                        <h1 className="text-2xl font-bold text-gray-800 mt-1">Soal dari Dokumen PDF</h1>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Soal Latihan</h2>
                            <span id="question-number" className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">1/10</span>
                        </div>
                        <p id="question-text" className="mb-6 text-gray-700">Memuat soal...</p>
                        <div id="options-container" className="space-y-3 mb-8" />
                        <button id="next-btn" className="w-full py-3 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed" disabled>
                            Cek Jawaban
                        </button>
                        <div id="feedback" className="hidden mt-4 p-4 rounded-lg">
                            <div className="flex items-start">
                                <i data-feather="check-circle" className="text-green-500 mr-3 mt-0.5 flex-shrink-0 hidden" id="correct-icon" />
                                <i data-feather="x-circle" className="text-red-500 mr-3 mt-0.5 flex-shrink-0 hidden" id="wrong-icon" />
                                <div>
                                    <h3 className="font-medium mb-1 hidden" id="feedback-title" />
                                    <p className="text-sm" id="feedback-text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </>
    )
}