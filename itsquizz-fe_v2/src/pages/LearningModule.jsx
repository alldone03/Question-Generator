import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, BookOpen, Download, Maximize2 } from 'lucide-react';

const LearningModule = ({ route }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Using a sample PDF for demonstration
    const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 h-full max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle bg-base-100 shadow-sm hover:bg-base-200">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-base-content">Modul Pembelajaran: {id.toUpperCase()}</h1>
                            <p className="text-sm font-medium text-base-content/50">Pelajari materi di bawah ini sebelum memulai kuis.</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <a href={pdfUrl} download className="btn btn-outline btn-sm gap-2 normal-case">
                            <Download size={16} /> Unduh PDF
                        </a>
                        <button className="btn btn-primary btn-sm gap-2 normal-case shadow-md">
                            <Maximize2 size={16} /> Fullscreen
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-neutral rounded-3xl overflow-hidden shadow-2xl border-4 border-base-100 min-h-[70vh] relative group">
                    <div className="absolute top-0 right-0 p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-black/20 rounded-bl-3xl">
                        <span className="text-xs text-white font-bold tracking-widest uppercase">Interactive Viewer</span>
                    </div>
                    <iframe
                        src={`${pdfUrl}#toolbar=0`}
                        className="w-full h-full border-none bg-white scrollbar-hide"
                        title="PDF Viewer"
                    >
                        Maaf, browser Anda tidak mendukung viewer PDF.
                        <a href={pdfUrl} className="link link-primary">Klik di sini untuk melihat file.</a>
                    </iframe>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Tips Belajar</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed">
                            Fokus pada konsep-konsep utama yang ditandai dengan teks tebal. Modul ini dirancang untuk memberikan pemahaman menyeluruh tentang materi assessment. Pastikan Anda membaca setiap halaman dengan teliti.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LearningModule;
