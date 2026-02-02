'use client';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  data: {
    title?: string;
    description?: string;
    image?: string;
    education?: {
        degree?: string; 
        major?: string;
        institution?: string;
        year?: string;
        gpa?: string;
    }
  };
}

export default function About({ data }: AboutProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-anim', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Defensive check: Ensure data exists
  if (!data) return null;
  
  // Safe destructuring with defaults
  const { title, description, education, image } = data;

  return (
    <section id="about" ref={containerRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-12">
          
          {/* Left Column: Image/Profile */}
          <div className="about-anim w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-56 h-56 md:w-64 md:h-64 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-xl mb-8 border-4 border-white dark:border-zinc-800 relative">
               {image ? (
                   <Image 
                     src={image} 
                     alt={title || "Profile"} 
                     fill 
                     className="object-cover"
                   />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif italic text-lg bg-slate-100 dark:bg-zinc-800">
                      <span>No Photo</span>
                   </div>
               )}
            </div>
          </div>
          
          {/* Right Column: Text Content */}
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="about-anim text-3xl md:text-4xl font-serif font-bold mb-6 text-slate-800 dark:text-slate-100">
              {title || "About Me"}
            </h2>
            <p className="about-anim text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {description || "No description available."}
            </p>

            {/* Check if education exists explicitly before rendering */}
            {education ? (
                <div className="about-anim bg-slate-50 dark:bg-zinc-900 p-6 rounded-xl border-l-4 border-blue-600 dark:border-blue-500 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Current Education</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400">Degree</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{education.degree || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400">Major</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{education.major || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400">Institution</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{education.institution || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400">Year</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{education.year || "N/A"}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-slate-500 italic">Education details not added yet.</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
