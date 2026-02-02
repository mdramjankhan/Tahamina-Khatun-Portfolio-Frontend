'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  data: {
    hr: string[];
    finance: string[];
    soft: string[];
  };
}

export default function Skills({ data }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });

      tl.from('.skill-category', {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Animate pills inside after categories appear
      if (containerRef.current?.querySelector('.skill-pill')) {
        tl.from('.skill-pill', {
          scale: 0.8,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'back.out(1.5)',
        }, "-=0.5");
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const SkillGroup = ({ title, skills }: { title: string; skills: string[] }) => (
    <div className="skill-category bg-white dark:bg-zinc-900/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-zinc-800 pb-2 inline-block">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="skill-pill inline-block px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-default border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" ref={containerRef} className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center text-slate-800 dark:text-slate-100">
          Core Competencies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkillGroup title="HR Management" skills={data.hr} />
          <SkillGroup title="Financial Analysis" skills={data.finance} />
          <SkillGroup title="Professional Skills" skills={data.soft} />
        </div>
      </div>
    </section>
  );
}
