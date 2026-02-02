'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  id: string; // Changed to string for MongoDB _id
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface ExperienceProps {
  data: ExperienceItem[];
}

export default function Experience({ data }: ExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if(!containerRef.current) return;
      
      // Animate the vertical line drawing down
      gsap.from('.timeline-line', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
        height: 0,
        duration: 2,
        ease: 'power2.inOut',
      });

      // Animate experience items coming in
      gsap.from('.experience-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!data?.length) return null;

  return (
    <section id="experience" ref={containerRef} className="py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-serif font-bold mb-16 text-center text-slate-800 dark:text-slate-100">
          Professional Experience
        </h2>

        {/* Vertical Timeline Line */}
        <div className="timeline-line absolute left-4 sm:left-1/2 top-32 bottom-10 w-0.5 bg-blue-200 dark:bg-blue-900 opacity-50 sm:-translate-x-1/2"></div>

        <div className="space-y-12">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`experience-item flex flex-col sm:flex-row gap-4 sm:gap-12 relative ${
                index % 2 === 0 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 sm:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-zinc-900 sm:-translate-x-1/2 mt-1.5 z-10 shadow-md"></div>

              {/* Content Card */}
              <div className={`w-full sm:w-1/2 ${
                  index % 2 === 0 ? 'sm:pl-12 pl-8' : 'sm:pr-12 pl-8'
                } sm:text-${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {item.role}
                  </h3>
                  <div className="text-blue-600 font-medium mb-1">
                    {item.company}
                  </div>
                  <div className="text-sm text-slate-400 mb-3 font-mono">
                    {item.duration}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Balancer for the other side */}
              <div className="hidden sm:block sm:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
