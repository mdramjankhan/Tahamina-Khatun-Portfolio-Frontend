'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ResumeProps {
  education?: {
    degree?: string;
    institution?: string;
    year?: string;
    gpa?: string;
  };
}

export default function Resume({ education }: ResumeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        if(!containerRef.current) return;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 75%',
            }
        });

        // Basic animation for Resume section
        tl.from('.resume-header', { opacity: 0, y: 30, duration: 0.8 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resume" ref={containerRef} className="py-20 bg-slate-100 dark:bg-zinc-800 bg-opacity-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="resume-header text-3xl font-serif font-bold mb-8 text-slate-800 dark:text-slate-100">
          Resume & Academic Summary
        </h2>
        
        {education ? (
            <div className="resume-header bg-white dark:bg-black p-8 rounded-lg shadow-lg inline-block text-left w-full max-w-2xl">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Education</h3>
            <p className="text-lg text-black dark:text-slate-400 font-semibold">{education.degree || "Degree Name"}</p>
            <p className="text-slate-600 dark:text-slate-400">{education.institution || "Institution Name"}</p>
            <div className="flex justify-between mt-4 border-t pt-4 dark:border-zinc-800">
                <span className="font-mono text-sm text-slate-500">{education.year || "Year"}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">GPA: {education.gpa || "N/A"}</span>
            </div>
            </div>
        ) : (
            <p className="text-slate-500 mb-8">Resume details are currently unavailable.</p>
        )}

        <div className="mt-8">
            <a href="#" className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                Download Full Resume
            </a>
        </div>
      </div>
    </section>
  );
}
