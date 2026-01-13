import React, { useState, useEffect } from "react";
import { crudService } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import {
    Plus, Edit, Trash2, FileText, HelpCircle, CheckSquare,
    Search, ChevronRight, Home, X, Save, ArrowRight, MinusCircle, Check
} from "lucide-react";

export default function AdminCRUD() {
    const [view, setView] = useState("assessments");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    // Navigation State
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
        setSearch("");
    }, [view, selectedAssessment, selectedModule]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (view === "assessments") {
                res = await crudService.getAssessments();
            } else if (view === "modules" && selectedAssessment) {
                res = await crudService.getModules(selectedAssessment.id);
            } else if (view === "learning" && selectedModule) {
                res = await crudService.getLearningModules(selectedModule.id);
            } else if (view === "questions" && selectedModule) {
                res = await crudService.getQuestions(selectedModule.id);
            }

            if (res) setItems(res.data);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const payload = Object.fromEntries(data.entries());

        try {
            if (view === "assessments") {
                if (editingItem) await crudService.updateAssessment(editingItem.id, payload);
                else await crudService.createAssessment(payload);
            } else if (view === "modules") {
                const p = { ...payload, assessment_id: selectedAssessment.id };
                if (editingItem) await crudService.updateModule(editingItem.id, p);
                else await crudService.createModule(p);
            } else if (view === "learning") {
                const f = new FormData(e.target);
                f.append("module_id", selectedModule.id);
                if (editingItem) await crudService.updateLearningModule(editingItem.id, f);
                else await crudService.createLearningModule(f);
            } else if (view === "questions") {
                const p = { ...payload, module_id: selectedModule.id };
                // When creating question here via modal, just create question. Options handled in line.
                if (editingItem) await crudService.updateQuestion(editingItem.id, p);
                else await crudService.createQuestion(p);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            alert("Operation failed: " + err.message);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!confirm("Are you sure?")) return;
        try {
            if (view === "assessments") await crudService.deleteAssessment(id);
            else if (view === "modules") await crudService.deleteModule(id);
            else if (view === "learning") await crudService.deleteLearningModule(id);
            else if (view === "questions") await crudService.deleteQuestion(id);
            fetchData();
        } catch (err) {
            alert("Delete failed");
        }
    };

    // --- Inline Options Logic ---
    const handleUpdateOption = async (optId, field, value) => {
        // Optimistic update? No, just call API then refresh or update local state
        // field: 'opsi' or 'is_correct'
        const item = items.find(q => q.options.some(o => o.id === optId));
        if (!item) return;
        const opt = item.options.find(o => o.id === optId);

        const payload = { ...opt, [field]: value };

        try {
            // Optimistic update locally first for speed
            const newItems = items.map(q => {
                if (q.id === item.id) {
                    return {
                        ...q,
                        options: q.options.map(o => o.id === optId ? { ...o, [field]: value } : o)
                    };
                }
                return q;
            });
            setItems(newItems);

            await crudService.updateOption(optId, payload);
        } catch (e) {
            console.error(e);
            // Revert or fetch
            fetchData();
        }
    };

    const handleDeleteOption = async (optId) => {
        if (!confirm("Delete option?")) return;
        try {
            await crudService.deleteOption(optId);
            fetchData();
        } catch (e) { console.error(e); alert("Failed to delete option"); }
    };

    const handleAddOption = async (questionId) => {
        try {
            await crudService.createOption({
                question_id: questionId,
                opsi: "New Option",
                is_correct: false
            });
            fetchData();
        } catch (e) { console.error(e); alert("Failed to add option"); }
    };


    const openModal = (item = null, e = null) => {
        if (e) e.stopPropagation();
        setEditingItem(item);
        setFormData(item || {});
        setIsModalOpen(true);
    };

    const goToModules = (item) => { setSelectedAssessment(item); setView("modules"); };
    const goToMaterials = (item) => { setSelectedModule(item); setView("learning"); };
    const goToQuestions = (item) => { setSelectedModule(item); setView("questions"); };

    // Filter items based on search
    const filteredItems = items.filter(item => {
        const term = search.toLowerCase();
        const txt = (item.nama_assessment || item.nama_module || item.judul || item.soal || "").toLowerCase();
        // Also search in options if questions view
        if (view === 'questions' && item.options) {
            if (item.options.some(o => o.opsi.toLowerCase().includes(term))) return true;
        }
        return txt.includes(term);
    });

    const navigateBreadcrumb = (level) => {
        if (level === 'root') {
            setView("assessments");
            setSelectedAssessment(null);
            setSelectedModule(null);
        } else if (level === 'assessment') {
            setView("modules");
            setSelectedModule(null);
        } else if (level === 'module') {
            setView("modules");
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-base-300 pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Manage Data</h1>
                        <p className="text-base-content/60 font-medium">Create, edit, and organize system content.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <button onClick={() => navigateBreadcrumb('root')} className="btn btn-ghost gap-2 normal-case font-normal text-base-content/70 hover:bg-base-200">
                            <Home size={14} /> Home
                        </button>
                        {selectedAssessment && (
                            <>
                                <ChevronRight size={14} className="text-base-content/30" />
                                <button onClick={() => navigateBreadcrumb('assessment')} className="btn btn-ghost gap-2 normal-case font-bold hover:bg-base-200">
                                    {selectedAssessment.nama_assessment}
                                </button>
                            </>
                        )}
                        {selectedModule && (
                            <>
                                <ChevronRight size={14} className="text-base-content/30" />
                                <span className="badge badge-lg badge-ghost font-bold">{selectedModule.nama_module}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                {selectedModule && (view === 'learning' || view === 'questions') && (
                    <div className="tabs tabs-boxed bg-base-100 p-1 w-fit shadow-sm border border-base-200">
                        <button className={`tab tab-lg ${view === 'learning' ? 'tab-active bg-primary text-primary-content font-bold shadow-sm p-2 rounded-lg ml-1 mr-1' : ''}`} onClick={() => setView('learning')}>
                            <FileText size={16} className="mr-2" /> Materi
                        </button>
                        <button className={`tab tab-lg ${view === 'questions' ? 'tab-active bg-primary text-primary-content font-bold shadow-sm p-2 rounded-lg ml-1 mr-1' : ''}`} onClick={() => setView('questions')}>
                            <HelpCircle size={16} className="mr-2" /> Soal & Pilihan
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 bg-base-50/50 border-b border-base-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40 pointer-events-none">
                                    <Search size={16} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    className="input input-bordered input-sm w-full pl-9 rounded-lg"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary bg-primary text-white p-2 gap-2 normal-case font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            <Plus size={16} /> Add New {view === 'assessments' ? 'Assessment' : view === 'questions' ? 'Question' : view.slice(0, -1)}
                        </button>
                    </div>

                    {/* Question View Special Layout */}
                    {view === 'questions' ? (
                        <div className="p-0">
                            {loading && <div className="p-8 text-center"><span className="loading loading-spinner text-primary"></span></div>}
                            {!loading && filteredItems.length === 0 && <div className="p-8 text-center text-base-content/40">No questions found.</div>}

                            <div className="grid grid-cols-1 divide-y divide-base-200">
                                {filteredItems.map((q, idx) => (
                                    <div key={q.id} className="p-6 hover:bg-base-50 transition-colors group">
                                        {/* Question Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-base-content mb-1 whitespace-pre-wrap">{q.soal}</p>
                                                    <span className="text-xs font-mono opacity-40">ID: {q.id}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal(q)} className="btn btn-ghost btn-square" title="Edit Question Text"><Edit size={16} /></button>
                                                <button onClick={(e) => handleDelete(q.id, e)} className="btn btn-ghost btn-square text-error" title="Delete Question"><Trash2 size={16} /></button>
                                            </div>
                                        </div>

                                        {/* Options List */}
                                        <div className="pl-12 space-y-2">
                                            {q.options && q.options.map((opt) => (
                                                <div key={opt.id} className="flex items-center gap-2">
                                                    {/* Option Text Input */}
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            className={`input input-sm w-full border-transparent hover:border-base-300 focus:border-primary focus:bg-base-100 bg-transparent transition-all ${opt.is_correct ? 'font-bold text-success' : ''}`}
                                                            value={opt.opsi}
                                                            title="Click to edit option"
                                                            onChange={(e) => {
                                                                // Updates local state immediately for input but waits for blur to save
                                                                const val = e.target.value;
                                                                // We need handleUpdateOption to be smarter or use local temporary state
                                                                // Current implementation of handleUpdateOption sends API call on every change? NO.
                                                                // Let's modify handleUpdateOption to be debounced or onBlur, 
                                                                // But for now, let's just use onBlur to trigger API, and separate onChange to setState.
                                                                // Simplified: just update local state here?
                                                                // Ideally:
                                                                const newItems = items.map(qi => qi.id === q.id ? { ...qi, options: qi.options.map(o => o.id === opt.id ? { ...o, opsi: val } : o) } : qi);
                                                                setItems(newItems);
                                                            }}
                                                            onBlur={(e) => handleUpdateOption(opt.id, 'opsi', e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        {/* Is Answer Toggle */}
                                                        <label className="cursor-pointer label p-0" title="Is Correct Answer?">
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox checkbox-sm checkbox-success outline outline-1"
                                                                checked={opt.is_correct}
                                                                onChange={(e) => handleUpdateOption(opt.id, 'is_correct', e.target.checked)}
                                                            />
                                                        </label>

                                                        {/* Delete Option */}
                                                        <button onClick={() => handleDeleteOption(opt.id)} className="btn btn-xs btn-ghost btn-square text-base-content/30 hover:text-error" title="Delete Option">
                                                            <MinusCircle size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Option Button */}
                                            <button onClick={() => handleAddOption(q.id)} className="btn btn-xs btn-ghost gap-1 text-primary opacity-60 hover:opacity-100 mt-2">
                                                <Plus size={14} /> Add Option
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Default Table View for other types
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="table w-full">
                                <thead className="bg-base-200/50 text-base-content/60 uppercase text-xs font-bold tracking-wider">
                                    <tr>
                                        <th className="w-16 text-center">ID</th>
                                        <th>Content</th>
                                        <th className="w-64 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
                                    ) : filteredItems.length > 0 ? (
                                        filteredItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="group hover:bg-base-50 transition-colors cursor-pointer border-b border-base-100 last:border-0"
                                                onClick={() => {
                                                    if (view === 'assessments') goToModules(item);
                                                    else if (view === 'modules') goToQuestions(item);
                                                }}
                                            >
                                                <td className="text-center font-mono text-xs opacity-50">{item.id}</td>
                                                <td>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-base-content/90 text-lg">
                                                            {item.nama_assessment || item.nama_module || item.judul}
                                                        </span>
                                                        {/* Meta Badges */}
                                                        <div className="flex gap-2 mt-2">
                                                            {item.level && <span className="badge badge-sm badge-outline">{item.level}</span>}
                                                            {item.jenis_module && <span className="badge badge-sm badge-ghost">{item.jenis_module}</span>}
                                                            {item.file_pdf && <span className="badge badge-sm badge-info gap-1 text-white"><FileText size={10} /> PDF</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        {view === 'assessments' && (
                                                            <button onClick={() => goToModules(item)} className="btn btn-secondary btn-outline gap-2 shadow-sm hover:shadow-md transition-all">
                                                                Modules <ArrowRight size={14} />
                                                            </button>
                                                        )}
                                                        {view === 'modules' && (
                                                            <div className="join shadow-sm hover:shadow-md transition-all">
                                                                <button onClick={() => goToMaterials(item)} className="btn btn-primary join-item text-black gap-2 p-2">
                                                                    <FileText size={14} /> Materials
                                                                </button>
                                                                <button onClick={() => goToQuestions(item)} className="btn btn-secondary join-item text-black gap-2 p-2">
                                                                    <HelpCircle size={14} /> Questions
                                                                </button>
                                                            </div>
                                                        )}

                                                        <div className="divider divider-horizontal mx-1"></div>

                                                        <button onClick={(e) => openModal(item, e)} className="btn btn-square btn-ghost hover:bg-warning/20 hover:text-warning transition-colors" title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={(e) => handleDelete(item.id, e)} className="btn btn-square btn-ghost hover:bg-error/20 hover:text-error transition-colors" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-12">
                                                <div className="flex flex-col items-center justify-center gap-2 text-base-content/40">
                                                    <div className="bg-base-200 p-4 rounded-full"><Search size={24} /></div>
                                                    <span className="font-medium italic">No items found.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Diagram */}
            <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box w-11/12 max-w-2xl shadow-2xl border border-base-200 bg-base-100 p-0 overflow-hidden transform scale-100 transition-all">
                    <div className="bg-base-200/50 p-4 border-b border-base-200 flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            {editingItem ? <Edit size={18} className="text-warning" /> : <Plus size={18} className="text-primary" />}
                            {editingItem ? "Edit" : "Create New"} {view === 'learning' ? 'Material' : view.slice(0, -1)}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-circle btn-ghost hover:bg-error/20 hover:text-error transition-colors"><X size={18} /></button>
                    </div>

                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <form id="crudForm" onSubmit={handleCreate} encType={view === "learning" ? "multipart/form-data" : ""}>
                            <div className="grid gap-6">
                                {view === "assessments" && (
                                    <>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text font-bold">Assessment Name</span></label>
                                            <input name="nama_assessment" placeholder="e.g. Technical Skills v1" defaultValue={formData.nama_assessment} required className="input input-bordered w-full focus:input-primary transition-all" />
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text font-bold">Position / Jabatan</span></label>
                                            <input name="jabatan" placeholder="e.g. Senior Engineer" defaultValue={formData.jabatan} required className="input input-bordered w-full focus:input-primary transition-all" />
                                        </div>
                                    </>
                                )}
                                {view === "modules" && (
                                    <>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text font-bold">Module Name</span></label>
                                            <input name="nama_module" placeholder="Module functionality..." defaultValue={formData.nama_module} required className="input input-bordered w-full focus:input-primary transition-all" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-control w-full">
                                                <label className="label"><span className="label-text font-bold">Difficulty Level</span></label>
                                                <select name="level" defaultValue={formData.level || "Beginner"} className="select select-bordered w-full focus:select-primary transition-all">
                                                    <option>Mudah</option><option>Sedang</option><option>Sulit</option>
                                                </select>
                                            </div>
                                            <div className="form-control w-full">
                                                <label className="label"><span className="label-text font-bold">Type</span></label>
                                                <select name="jenis_module" defaultValue={formData.jenis_module || "Materi"} className="select select-bordered w-full focus:select-primary transition-all">
                                                    <option>Quiz</option><option>Puzzle</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text font-bold">Duration (Seconds)</span></label>
                                            <input name="waktu_pengerjaan" type="number" placeholder="60" defaultValue={formData.waktu_pengerjaan} className="input input-bordered w-full focus:input-primary transition-all" />
                                        </div>
                                    </>
                                )}
                                {view === "learning" && (
                                    <>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text font-bold">Title</span></label>
                                            <input name="judul" placeholder="Material Title" defaultValue={formData.judul} required className="input input-bordered w-full focus:input-primary transition-all" />
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text font-bold">Upload PDF</span></label>
                                            <input type="file" name="file_pdf" accept="application/pdf" className="file-input file-input-bordered w-full focus:file-input-primary transition-all" />
                                        </div>
                                    </>
                                )}
                                {view === "questions" && (
                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text font-bold">Question Text</span></label>
                                        <textarea name="soal" placeholder="Write your question here..." defaultValue={formData.soal} required className="textarea textarea-bordered h-32 font-mono text-sm focus:textarea-primary transition-all"></textarea>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="p-4 bg-base-200/50 border-t border-base-200 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost hover:bg-base-300">Cancel</button>
                        <button type="submit" form="crudForm" className="btn btn-primary gap-2 shadow-lg shadow-primary/20"><Save size={16} /> Save Changes</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsModalOpen(false)}>close</button>
                </form>
            </dialog>
        </MainLayout>
    );
}
