import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, BookOpen, Download } from 'lucide-react';

const LearningModule = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Use relative path for production compatibility
    const pdfUrl = `/assets/modulepembelajaran/${id}.pdf`;

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 h-full max-w-5xl mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-ghost btn-circle bg-base-100 shadow-sm hover:bg-base-200"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-base-content">
                                Modul Pembelajaran: {id?.toUpperCase()}
                            </h1>
                            <p className="text-sm font-medium text-base-content/50">
                                Pelajari materi di bawah ini sebelum memulai kuis.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <a href={pdfUrl} download className="btn btn-outline btn-sm gap-2 normal-case">
                            <Download size={16} /> Unduh PDF
                        </a>
                    </div>
                </div>

                {/* PDF Viewer Container */}
                <div className="flex-1 bg-base-300 rounded-3xl overflow-hidden shadow-2xl border-4 border-base-100 min-h-[75vh] flex flex-col relative model-viewer-container">
                    <iframe
                        src={pdfUrl}
                        title={`PDF Viewer - ${id}`}
                        className="w-full h-full min-h-[75vh] rounded-2xl"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                            <p className="font-bold">Browser Anda tidak mendukung preview PDF.</p>
                            <a href={pdfUrl} download className="btn btn-primary btn-sm">Download PDF</a>
                        </div>
                    </iframe>
                </div>

                {/* Tips Section */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Tips Belajar</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed">
                            Gunakan panel navigasi di dalam viewer untuk berpindah halaman atau memperbesar (zoom) materi. Jika PDF tidak muncul, pastikan Anda telah mengizinkan akses pada browser Anda.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LearningModule;