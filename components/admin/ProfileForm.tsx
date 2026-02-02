"use client";
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FiUpload, FiImage, FiTrash } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfileForm() {
    const [profile, setProfile] = useState<any>({ 
        hero: { title: '', subtitle: '', description: '', cta: '', resumeLink: '' },
        about: { 
            title: '', 
            description: '', 
            image: '', 
            education: { degree: '', major: '', institution: '', year: '', gpa: '' } 
        },
        contact: { email: '', phone: '', linkedin: '', location: '' }
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get('/profile');
            // Deep-merge defaults in case db is partial
            setProfile((prev: any) => ({
                ...prev,
                ...res.data,
                hero: { ...prev.hero, ...res.data?.hero },
                about: {
                    ...prev.about,
                    ...res.data?.about,
                    education: {
                        ...prev.about.education,
                        ...res.data?.about?.education
                    }
                },
                contact: { ...prev.contact, ...res.data?.contact }
            }));
        } catch (error) {
            console.error("Failed to load profile");
        }
    };

    const handleChange = (section: string, field: string, value: string) => {
        setProfile((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };
    
    // Specific handler for deep nested education
    const handleEduChange = (field: string, value: string) => {
         setProfile((prev: any) => ({
            ...prev,
            about: {
                ...prev.about,
                education: {
                    ...prev.about.education,
                    [field]: value
                }
            }
        }));
    };

    const handleFileRemove = (section: string, field: string) => {
        if(confirm("Are you sure you want to remove this file?")) {
            handleChange(section, field, '');
            toast.success('File removed');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        setUploadProgress(0);
        const toastId = toast.loading('Starting upload...');

        try {
            // Let Axios set the correct Content-Type with boundary automatically
            const res = await API.post('/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percentCompleted);
                }
            });
            handleChange(section, field, res.data.url);
            toast.success('Upload complete!', { id: toastId });
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
        setLoading(true);
        const toastId = toast.loading('Saving profile...');
        const payload = {
            hero: profile.hero,
            about: profile.about,
            contact: profile.contact
        };
        console.log("Submitting profile:", payload);
        try {
            await API.put('/profile', payload);
            toast.success('Profile Updated Successfully!', { id: toastId });
        } catch (error: any) {
            console.error("Profile update error:", error.response?.data || error.message);
            toast.error(`Update failed: ${error.response?.data?.message || 'Check console'}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl relative">
             {uploading && (
                <div className="fixed top-20 right-4 z-50 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border border-blue-100 dark:border-zinc-700 w-80 animate-in slide-in-from-right-10">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Uploading file...</span>
                        <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            )}
            
            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-slate-200 dark:border-zinc-700 pb-2 text-slate-800 dark:text-slate-100">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">Title</label>
                        <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Title" value={profile.hero.title} onChange={e => handleChange('hero', 'title', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">Subtitle</label>
                        <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Subtitle" value={profile.hero.subtitle} onChange={e => handleChange('hero', 'subtitle', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">Resume Link / File</label>
                        <div className="flex gap-2 items-center">
                            <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Resume URL" value={profile.hero.resumeLink || ''} onChange={e => handleChange('hero', 'resumeLink', e.target.value)} />
                            <label className="cursor-pointer bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 p-2.5 rounded-lg transition-colors" title="Upload PDF">
                                <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'hero', 'resumeLink')} disabled={uploading} />
                                <FiUpload />
                            </label>
                            {profile.hero.resumeLink && (
                                <div className="flex gap-1">
                                    <a href={profile.hero.resumeLink} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="View Resume">
                                        <FiImage /> 
                                    </a>
                                     <button 
                                        type="button"
                                        onClick={() => handleFileRemove('hero', 'resumeLink')}
                                        className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        title="Remove Resume"
                                    >
                                        <FiTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">CTA Text</label>
                        <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="CTA Text (e.g. View Resume)" value={profile.hero.cta} onChange={e => handleChange('hero', 'cta', e.target.value)} />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">Description</label>
                        <textarea className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={3} placeholder="Description" value={profile.hero.description} onChange={e => handleChange('hero', 'description', e.target.value)} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-slate-200 dark:border-zinc-700 pb-2 text-slate-800 dark:text-slate-100">About & Education</h3>
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">About Title</label>
                        <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Title (e.g. About Me)" value={profile.about.title} onChange={e => handleChange('about', 'title', e.target.value)} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">Profile Image</label>
                        <div className="flex flex-wrap gap-4 items-center">
                            {profile.about.image && (
                                <div className="relative group">
                                    <img src={profile.about.image} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-zinc-700" />
                                    <button 
                                        type="button"
                                        onClick={() => handleFileRemove('about', 'image')}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Photo"
                                    >
                                        <FiTrash size={10} />
                                    </button>
                                </div>
                            )}
                            <label className="cursor-pointer bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                {uploading ? 'Uploading...' : (profile.about.image ? 'Change Photo' : 'Upload Photo')}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'about', 'image')} disabled={uploading} />
                                <FiUpload />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-500 dark:text-slate-500">About Description</label>
                        <textarea className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={4} placeholder="About Description" value={profile.about.description} onChange={e => handleChange('about', 'description', e.target.value)} />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Latest Education</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Degree (e.g. MBA)" value={profile.about.education?.degree || ''} onChange={e => handleEduChange('degree', e.target.value)} />
                             <input required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Major / Field" value={profile.about.education?.major || ''} onChange={e => handleEduChange('major', e.target.value)} />
                             <input required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Institution" value={profile.about.education?.institution || ''} onChange={e => handleEduChange('institution', e.target.value)} />
                             <input required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Year" value={profile.about.education?.year || ''} onChange={e => handleEduChange('year', e.target.value)} />
                             <input required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="GPA" value={profile.about.education?.gpa || ''} onChange={e => handleEduChange('gpa', e.target.value)} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-slate-200 dark:border-zinc-700 pb-2 text-slate-800 dark:text-slate-100">Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email" value={profile.contact.email} onChange={e => handleChange('contact', 'email', e.target.value)} />
                     <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phone" value={profile.contact.phone} onChange={e => handleChange('contact', 'phone', e.target.value)} />
                     <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="LinkedIn URL" value={profile.contact.linkedin} onChange={e => handleChange('contact', 'linkedin', e.target.value)} />
                     <input className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Location" value={profile.contact.location} onChange={e => handleChange('contact', 'location', e.target.value)} />
                </div>
            </section>

            <div className="pt-4">
                <button disabled={loading} type="submit" className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50">
                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
            </div>
        </form>
    );
}
