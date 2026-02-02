"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiBriefcase, FiAward, FiLayers, FiCpu, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import ProfileForm from '@/components/admin/ProfileForm';
import SkillsManager from '@/components/admin/SkillsManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import ProjectManager from '@/components/admin/ProjectManager';
import CertificationManager from '@/components/admin/CertificationManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: FiUser },
    { id: 'skills', label: 'Skills & Tech', icon: FiCpu },
    { id: 'experience', label: 'Experience', icon: FiBriefcase },
    { id: 'projects', label: 'Projects', icon: FiLayers },
    { id: 'certs', label: 'Certifications', icon: FiAward },
  ];

  const ActiveComponent = () => {
    switch (activeTab) {
        case 'profile': return <ProfileForm />;
        case 'skills': return <SkillsManager />;
        case 'experience': return <ExperienceManager />;
        case 'projects': return <ProjectManager />;
        case 'certs': return <CertificationManager />;
        default: return <ProfileForm />;
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 flex transition-colors duration-300 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <div 
         className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
         }`}
         onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-center border-b border-slate-200 dark:border-zinc-800">
            <h1 className="text-xl font-bold font-serif">Dash<span className="text-blue-600">Board</span></h1>
        </div>

        <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                    >
                        <Icon size={18} />
                        {tab.label}
                    </button>
                );
            })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-zinc-800">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
                <FiLogOut size={18} />
                Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-black w-full md:ml-64 relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-30">
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-slate-600 dark:text-slate-300">
                <FiMenu size={24} />
            </button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
            <div className="mb-8 mt-4 md:mt-0">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Manage your portfolio content and settings.
                </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 min-h-[500px]">
                <ActiveComponent />
            </div>
        </div>
      </main>
    </div>
  );
}
