"use client";
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FaTrash, FaCertificate, FaEdit, FaUpload, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CertificationManager() {
    const [certs, setCerts] = useState<any[]>([]);
    // Matching Mongoose Model: name, issuer, date, link
    const [form, setForm] = useState({ name: '', issuer: '', date: '', link: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await API.get('/certifications');
            setCerts(res.data);
        } catch (error) {
            console.error("Failed to load certs");
            toast.error("Failed to load certifications");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        setUploadProgress(0);
        const toastId = toast.loading('Starting upload...');

        try {
            const res = await API.post('/upload', formData, {
                 onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percentCompleted);
                    toast.loading(`Uploading... ${percentCompleted}%`, { id: toastId });
                 }
            });
            setForm({ ...form, link: res.data.url });
            toast.success('File uploaded!', { id: toastId });
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Upload failed', { id: toastId });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(editingId ? 'Updating certification...' : 'Adding certification...');
        try {
            if (editingId) {
                await API.put(`/certifications/${editingId}`, form);
                setEditingId(null);
            } else {
                await API.post('/certifications', form);
            }
            setForm({ name: '', issuer: '', date: '', link: '' });
            load();
            toast.success(editingId ? 'Certification updated!' : 'Certification added!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save certification', { id: toastId });
        }
    };

    const startEdit = (cert: any) => {
        setForm({ 
            name: cert.name || cert.title || '', 
            issuer: cert.issuer || '', 
            date: cert.date || cert.year || '',
            link: cert.link || ''
        });
        setEditingId(cert._id);
    };

    const cancelEdit = () => {
         setForm({ name: '', issuer: '', date: '', link: '' });
         setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if(confirm('Are you sure you want to delete this certification?')) {
            const toastId = toast.loading('Deleting...');
            try {
                await API.delete(`/certifications/${id}`);
                setCerts(certs.filter(c => c._id !== id));
                toast.success('Deleted successfully', { id: toastId });
            } catch (error) {
                toast.error('Deletion failed', { id: toastId });
            }
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 relative">
             {uploading && (
                <div className="fixed top-20 right-4 z-50 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border border-purple-100 dark:border-zinc-700 w-80 animate-in slide-in-from-right-10">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Uploading credential...</span>
                        <span className="text-sm font-bold text-purple-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            )}

            <div className="lg:col-span-12 xl:col-span-5">
                <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-lg border border-slate-200 dark:border-zinc-700 space-y-4 sticky top-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        {editingId ? 'Edit Certification' : 'Add Certification'}
                    </h3>
                    
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Certification Name</label>
                        <input required placeholder="e.g. Certified HR Professional" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Issuing Organization</label>
                        <input required placeholder="e.g. SHRM or HRCI" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Date / Year</label>
                        <input required placeholder="e.g. 2023" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Credential Link / File</label>
                        <div className="flex gap-2">
                            <input placeholder="https://..." className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none" value={form.link} onChange={e => setForm({...form, link: e.target.value})}/>
                            <label className="cursor-pointer bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 p-2.5 rounded-lg transition-colors text-slate-600 dark:text-slate-300" title="Upload File">
                                <FaUpload />
                                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading}/>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2">
                         {editingId && (
                             <button type="button" onClick={cancelEdit} className="w-full bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-slate-200 py-2.5 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-zinc-600 transition">Cancel</button>
                         )}
                         <button disabled={uploading} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-500/20 disabled:opacity-50">{editingId ? 'Update Certificate' : 'Add Certificate'}</button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-12 xl:col-span-7 grid gap-4 content-start">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">My Certifications</h3>
                {certs.length === 0 && <p className="text-slate-500 italic">No certifications listed.</p>}
                
                {certs.map(cert => (
                    <div key={cert._id} className="bg-white dark:bg-zinc-800 p-5 rounded-lg border border-slate-200 dark:border-zinc-700 flex justify-between items-center group shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                             <div className="mt-1 p-2 bg-purple-50 dark:bg-zinc-700 text-purple-600 dark:text-purple-400 rounded-lg">
                                <FaCertificate size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                    {cert.name}
                                    {cert.link && (
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-200 dark:hover:bg-zinc-600 transition-colors inline-flex items-center gap-1">
                                            <FaLink size={10} /> View
                                        </a>
                                    )}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {cert.issuer} <span className="mx-2">•</span> <span className="text-slate-400 dark:text-slate-500 font-mono">{cert.date}</span>
                                </p>
                             </div>
                        </div>
                        <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                             <button 
                                onClick={() => startEdit(cert)}
                                className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/40 rounded-full transition-colors"
                                title="Edit"
                            >
                                <FaEdit size={16}/>
                            </button>
                            <button 
                                onClick={() => handleDelete(cert._id)} 
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-full transition-colors"
                                title="Delete"
                            >
                                <FaTrash size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
