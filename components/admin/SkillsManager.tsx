"use client";
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SkillsManager() {
    const [skills, setSkills] = useState<any[]>([]);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'hr' });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await API.get('/skills');
            setSkills(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load skills');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(editingId ? 'Updating skill...' : 'Adding skill...');
        try {
            if (editingId) {
                const res = await API.put(`/skills/${editingId}`, newSkill);
                setSkills(skills.map(s => s._id === editingId ? res.data : s));
                setEditingId(null);
            } else {
                const res = await API.post('/skills', newSkill);
                setSkills([...skills, res.data]);
            }
            setNewSkill({ ...newSkill, name: '' }); 
            toast.success(editingId ? 'Skill updated!' : 'Skill added!', { id: toastId });
        } catch (error) {
            toast.error('Operation failed', { id: toastId });
        }
    };

    const startEdit = (skill: any) => {
        setNewSkill({ name: skill.name, category: skill.category });
        setEditingId(skill._id);
    };

    const cancelEdit = () => {
         setNewSkill({ ...newSkill, name: '' });
         setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if(!confirm('Are you sure you want to delete this skill?')) return;
        const toastId = toast.loading('Deleting...');
        try {
            await API.delete(`/skills/${id}`);
            setSkills(skills.filter(s => s._id !== id));
            toast.success('Skill deleted', { id: toastId });
        } catch (error) {
             toast.error('Failed to delete skill', { id: toastId });
        }
    };

    // Grouping for display
    const categories = ['hr', 'finance', 'soft'];

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-lg border border-slate-200 dark:border-zinc-700 h-fit">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    {editingId ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-2">Skill Name</label>
                        <input 
                            required 
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="e.g. Employee Relations"
                            value={newSkill.name} 
                            onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-2">Category</label>
                        <select 
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newSkill.category}
                            onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                        >
                            <option value="hr">HR Management</option>
                            <option value="finance">Finance/Accounting</option>
                            <option value="soft">Soft Skills</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        {editingId && (
                             <button type="button" onClick={cancelEdit} className="w-full bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-slate-200 py-2.5 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-zinc-600 transition">Cancel</button>
                        )}
                        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">{editingId ? 'Update Skill' : 'Add Skill'}</button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                {categories.map(cat => (
                    <div key={cat} className="space-y-2">
                        <h4 className="font-bold uppercase text-slate-500 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-zinc-700 pb-2 mb-3">
                            {cat === 'hr' ? 'HR Management' : cat === 'finance' ? 'Finance & Accounting' : 'Leadership & Soft Skills'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                             {skills.filter(s => s.category === cat).map(skill => (
                                 <span key={skill._id} className="group bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 pl-3 pr-2 py-1.5 rounded-full text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 transition hover:border-blue-300 dark:hover:border-blue-800">
                                     {skill.name}
                                     <button 
                                        onClick={() => startEdit(skill)}
                                        className="w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 transition-colors"
                                        title="Edit Skill"
                                     >
                                         <FaEdit size={10} />
                                     </button>
                                     <button 
                                        onClick={() => handleDelete(skill._id)} 
                                        className="w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 transition-colors"
                                        title="Delete Skill"
                                     >
                                        <FaTrash size={10}/>
                                     </button>
                                 </span>
                             ))}
                             {skills.filter(s => s.category === cat).length === 0 && (
                                <span className="text-slate-400 dark:text-slate-600 text-sm italic py-2">No skills added yet.</span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
