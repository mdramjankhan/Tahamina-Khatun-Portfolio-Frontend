import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import axios from 'axios';
import { Metadata } from 'next';

// Metadata for SEO - Using Layout defaults primarily, but ensuring canonical presence
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://tahamina-khatun.vercel.app',
  },
};

async function getPortfolioData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await axios.get(`${apiUrl}/portfolio`);
    if (!res.data) throw new Error('No data returned');
    return res.data;
  } catch (error) {
    console.error("Backend fetch error:", error);
    // Return a safe fallback structure to prevent undefined crashes
    return {
        hero: {},
        about: {},
        skills: { hr: [], finance: [], soft: [] },
        experience: [],
        projects: [],
        certifications: [],
        contact: {}
    };
  }
}

export default async function Home() {
  const data = await getPortfolioData();

  // Ensure data exists before rendering
  if (!data) return <div className="p-20 text-center">Loading or No Data Available...</div>;

  return (
    <div className="flex flex-col gap-0 w-full">
      <Hero data={data.hero || {}} />
      <About data={data.about || {}} />
      <Experience data={data.experience || []} />
      <Skills data={data.skills || { hr: [], finance: [], soft: [] }} />
      <Projects data={data.projects || []} />
      <Certifications data={data.certifications || []} />
      {/* Pass about.education safely */}
      <Resume education={data.about?.education} />
      <Contact data={data.contact || {}} />
    </div>
  );
}
