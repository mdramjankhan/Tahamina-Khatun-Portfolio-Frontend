"use client";
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FaTrash, FaImage, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProjectManager() {
    const [projects, setProjects] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', technologies: '', description: '', link: '', image: '' });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await API.get('/projects');
            setProjects(res.data);
        } catch (error) {
             toast.error('Failed to load projects');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        setUploadProgress(0);
        const toastId = toast.loading('Starting upload...');

        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        
        try {
            const res = await API.post('/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percentCompleted);
                    toast.loading(`Uploading... ${percentCompleted}%`, { id: toastId });
                }
            });
            setForm({ ...form, image: res.data.url });
            toast.success('Image uploaded!', { id: toastId });
        } catch (error) {
            toast.error('Image upload failed', { id: toastId });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(editingId ? 'Updating project...' : 'Adding project...');
        
        // Convert comma separated techs to array if backend handles logic or keep string? 
        // Backend Project model: technologies: [String]
        const payload = {
            ...form,
            technologies: form.technologies.split(',').map(s => s.trim())
        };
        
        try {
            if (editingId) {
                 await API.put(`/projects/${editingId}`, payload);
                 setEditingId(null);
            } else {
                 await API.post('/projects', payload);
            }
            
            setForm({ title: '', technologies: '', description: '', link: '', image: '' });
            load();
            toast.success(editingId ? 'Project updated!' : 'Project added!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save project', { id: toastId });
        }
    };

    const startEdit = (proj: any) => {
        setForm({ 
            title: proj.title, 
            description: proj.description, 
            link: proj.link || '', 
            image: proj.image || '',
            technologies: proj.technologies ? proj.technologies.join(', ') : '' 
        });
        setEditingId(proj._id);
    };

    const cancelEdit = () => {
         setForm({ title: '', technologies: '', description: '', link: '', image: '' });
         setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if(confirm('Are you sure you want to delete this project?')) {
            const toastId = toast.loading('Deleting...');
            try {
                await API.delete(`/projects/${id}`);
                load();
                toast.success('Project deleted', { id: toastId });
            } catch (error) {
                toast.error('Deletion failed', { id: toastId });
            }
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 relative">
             {uploading && (
                <div className="fixed top-20 right-4 z-50 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border border-blue-100 dark:border-zinc-700 w-80 animate-in slide-in-from-right-10">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Uploading image...</span>
                        <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            )}

            <div className="lg:col-span-5">
                <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-lg border border-slate-200 dark:border-zinc-700 space-y-4 sticky top-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        {editingId ? 'Edit Project' : 'Add New Project'}
                    </h3>
                    
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Title</label>
                        <input required placeholder="Project Title" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Tools/Tech (Comma Separated)</label>
                        <input required placeholder="Excel, SAP, PowerBI" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Description</label>
                        <textarea required placeholder="Project details..." className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Link (Optional)</label>
                        <input placeholder="https://..." className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={form.link} onChange={e => setForm({...form, link: e.target.value})}/>
                    </div>
                
                    <div className="border border-dashed border-slate-300 dark:border-zinc-600 p-4 rounded-lg bg-slate-50 dark:bg-zinc-900/50 text-center">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 cursor-pointer hover:text-blue-500 transition-colors">
                            <FaImage className="mx-auto mb-1" size={20}/>
                            {form.image ? 'Change Cover Image' : 'Upload Cover Image'}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                        </label>
                        {form.image && (
                            <div className="mt-2 relative">
                                <img src={form.image} alt="Preview" className="h-32 w-full rounded-lg object-cover mx-auto"/>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                         {editingId && (
                             <button type="button" onClick={cancelEdit} className="w-full bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-slate-200 py-2.5 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-zinc-600 transition">Cancel</button>
                         )}
                         <button disabled={uploading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                             {uploading ? 'Processing...' : (editingId ? 'Update Project' : 'Add Project')}
                         </button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-7 grid gap-4 content-start">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Projects Gallery</h3>
                {projects.map(proj => (
                    <div key={proj._id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row gap-4 relative group">
                         <div className="absolute top-2 right-2 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all z-10">
                             <button 
                                onClick={() => startEdit(proj)}
                                className="p-2 bg-white dark:bg-zinc-700 rounded-full text-slate-400 hover:text-indigo-600 shadow-sm"
                                title="Edit Project"
                             >
                                <FaEdit size={12} />
                            </button>
                             <button 
                                onClick={() => handleDelete(proj._id)} 
                                className="p-2 bg-white dark:bg-zinc-700 rounded-full text-slate-400 hover:text-red-600 shadow-sm"
                                title="Delete Project"
                             >
                                <FaTrash size={12}/>
                             </button>
                         </div>
                         
                         <div className="shrink-0 w-full sm:w-32 h-32 relative rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-900">
                            {proj.image ? (
                                <img src={proj.image} className="w-full h-full object-cover" alt={proj.title} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-300">
                                    <FaImage size={24}/>
                                </div>
                            )}
                         </div>
                         
                         <div className="flex-1 min-w-0 py-1">
                             <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{proj.title}</h4>
                             <div className="flex flex-wrap gap-1 my-2">
                                {(proj.technologies || []).map((t: string) => (
                                    <span key={t} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                                        {t}
                                    </span>
                                ))}
                             </div>
                             <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
