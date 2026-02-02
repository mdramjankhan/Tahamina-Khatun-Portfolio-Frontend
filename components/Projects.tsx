'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string; // MongoDB ID is string
  title: string;
  category?: string;
  description: string;
  type?: string; 
  technologies?: string[];
  link?: string;
  image: string;
}

interface ProjectsProps {
  data: Project[];
}

export default function Projects({ data }: ProjectsProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
        // Ensure elements are visible if JS fails or before animation starts (optional, but good practice)
        // But with fromTo we control both states.
        
        gsap.fromTo('.project-card', 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%', // Trigger slightly earlier
                    toggleActions: 'play none none reverse',
                }
            }
        );
        
        // Refresh ScrollTrigger after a short delay to account for layout shifts
        setTimeout(() => ScrollTrigger.refresh(), 500);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if(!data?.length) return null;

  return (
    <section id="projects" ref={containerRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center text-slate-800 dark:text-slate-100">
          Academic Projects & Case Studies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((project) => (
            <div
              key={project.id}
              className="project-card group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                <Image
                  src={project.image || '/placeholder-project.png'}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!project.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <span className="text-sm">No Image</span>
                    </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                    {project.title}
                  </h3>
                  {project.category && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900">
                      {project.category}
                    </span>
                  )}
                </div>

                {project.technologies && project.technologies.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map(tech => (
                            <span key={tech} className="text-xs bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                {tech}
                            </span>
                        ))}
                     </div>
                )}

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-4 leading-relaxed flex-1">
                  {project.description}
                </p>

                {project.link && (
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View Case Study &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
