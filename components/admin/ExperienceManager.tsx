"use client";
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [form, setForm] = useState({ role: '', company: '', duration: '', description: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await API.get('/experience');
            setExperiences(res.data);
        } catch (error) {
            console.error("Failed to load experiences", error);
            // toast.error("Failed to load experiences");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? 'Updating experience...' : 'Adding experience...');
        try {
            if (editingId) {
                 await API.put(`/experience/${editingId}`, form);
                 toast.success('Experience updated successfully', { id: loadingToast });
                 setEditingId(null);
            } else {
                 await API.post('/experience', form);
                 toast.success('Experience added successfully', { id: loadingToast });
            }
            setForm({ role: '', company: '', duration: '', description: '' });
            load();
        } catch (error) {
            toast.error(editingId ? 'Failed to update experience' : 'Failed to add experience', { id: loadingToast });
        }
    };

    const startEdit = (exp: any) => {
        setForm({ 
            role: exp.role, 
            company: exp.company, 
            duration: exp.duration, 
            description: exp.description 
        });
        setEditingId(exp._id);
        toast('Edit mode enabled', { icon: '✏️' });
    };

    const cancelEdit = () => {
        setForm({ role: '', company: '', duration: '', description: '' });
        setEditingId(null);
        toast('Edit mode cancelled', { icon: '✖️' });
    };

    const handleDelete = async (id: string) => {
        if(confirm('Delete?')) {
            const loadingToast = toast.loading('Deleting experience...');
            try {
                await API.delete(`/experience/${id}`);
                toast.success('Experience deleted successfully', { id: loadingToast });
                load();
            } catch (error) {
                toast.error('Failed to delete experience', { id: loadingToast });
            }
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
                <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-lg border border-slate-200 dark:border-zinc-700 space-y-4 sticky top-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        {editingId ? 'Edit Experience' : 'Add New Experience'}
                    </h3>
                    
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Position</label>
                        <input required placeholder="e.g. Senior HR Manager" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={form.role} onChange={e => setForm({...form, role: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Company</label>
                        <input required placeholder="e.g. Tech Solutions Inc." className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={form.company} onChange={e => setForm({...form, company: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Duration</label>
                        <input required placeholder="e.g. Jan 2020 - Present" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Description</label>
                        <textarea required placeholder="Key achievements and responsibilities..." className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
                    </div>

                    <div className="flex gap-2">
                         {editingId && (
                             <button type="button" onClick={cancelEdit} className="w-full bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-slate-200 py-2.5 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-zinc-600 transition">Cancel</button>
                         )}
                         <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">{editingId ? 'Update Position' : 'Add Position'}</button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Current Experience List</h3>
                {experiences.length === 0 && <p className="text-slate-500 italic">No experience added yet.</p>}
                
                {experiences.map(exp => (
                    <div key={exp._id} className="bg-white dark:bg-zinc-800/80 p-5 rounded-lg border border-slate-200 dark:border-zinc-700 relative group transition hover:border-blue-300 dark:hover:border-blue-800">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                             <button 
                                onClick={() => startEdit(exp)}
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded transition-all"
                                title="Edit Position"
                            >
                                <FaEdit size={14} />
                            </button>
                            <button 
                                onClick={() => handleDelete(exp._id)} 
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded transition-all"
                                title="Delete Position"
                            >
                                <FaTrash size={14}/>
                            </button>
                        </div>
                        
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 pr-10">{exp.role}</h4>
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{exp.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-mono mt-1">{exp.duration}</p>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-slate-200 dark:border-zinc-700">
                            {exp.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
