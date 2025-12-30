import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, BookOpen, Download, Maximize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf from public folder or via Vite import
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url,
).toString();

const LearningModule = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    // Dynamic PDF URL based on id parameter
    const pdfUrl = `${window.location.origin}/assets/modulepembelajaran/${id}.pdf`;

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 h-full max-w-5xl mx-auto pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle bg-base-100 shadow-sm hover:bg-base-200">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-base-content">Modul Pembelajaran: {id?.toUpperCase()}</h1>
                            <p className="text-sm font-medium text-base-content/50">Pelajari materi di bawah ini sebelum memulai kuis.</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <a href={pdfUrl} download className="btn btn-outline btn-sm gap-2 normal-case">
                            <Download size={16} /> Unduh PDF
                        </a>
                        <div className="hidden md:flex bg-base-100 rounded-lg shadow-sm border border-base-200 p-1 gap-1">
                            <button onClick={zoomOut} className="btn btn-ghost btn-xs btn-square" title="Zoom Out">
                                <ZoomOut size={14} />
                            </button>
                            <span className="text-xs font-bold flex items-center px-2 min-w-[45px] justify-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <button onClick={zoomIn} className="btn btn-ghost btn-xs btn-square" title="Zoom In">
                                <ZoomIn size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-neutral rounded-3xl overflow-hidden shadow-2xl border-4 border-base-100 min-h-[70vh] relative group flex flex-col items-center">
                    <div className="absolute top-0 right-0 p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-black/20 rounded-bl-3xl z-10">
                        <span className="text-xs text-white font-bold tracking-widest uppercase">Interactive Viewer</span>
                    </div>

                    <div className="w-full h-full overflow-auto flex justify-center bg-base-300 p-4 custom-scrollbar">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex flex-col items-center justify-center p-20 gap-4">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <p className="text-sm font-bold animate-pulse text-base-content/60">Memuat Dokumen...</p>
                                </div>
                            }
                            error={
                                <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
                                    <div className="bg-error/10 p-4 rounded-full text-error">
                                        <BookOpen size={48} />
                                    </div>
                                    <h3 className="font-bold text-lg">Gagal Memuat PDF</h3>
                                    <p className="text-sm text-base-content/60 max-w-xs">Pastikan file modul sudah tersedia di folder assets.</p>
                                    <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm mt-2">Buka Manual</a>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                className="shadow-2xl"
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        </Document>
                    </div>

                    {numPages && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-base-100/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-white/20 z-10">
                            <button
                                onClick={goToPrevPage}
                                disabled={pageNumber <= 1}
                                className="btn btn-circle btn-xs btn-ghost disabled:opacity-30"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-primary">{pageNumber}</span>
                                <span className="text-xs font-bold text-base-content/30 italic">dari</span>
                                <span className="text-sm font-black text-base-content/60">{numPages}</span>
                            </div>

                            <button
                                onClick={goToNextPage}
                                disabled={pageNumber >= numPages}
                                className="btn btn-circle btn-xs btn-ghost disabled:opacity-30"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
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

