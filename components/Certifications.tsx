'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CertificationsProps {
  data: {
    id: string; // MongoDB ID
    name?: string; 
    title?: string; // CMS uses title
    issuer: string;
    date?: string;
    year?: string; // CMS uses year
    link?: string;
  }[];
}

export default function Certifications({ data }: CertificationsProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from('.cert-card', {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.2)',
        });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if(!data?.length) return null;

  return (
    <section id="certifications" ref={containerRef} className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center text-slate-800 dark:text-slate-100">
          Certifications & Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((cert) => (
            <a
              key={cert.id}
              href={cert.link || '#'}
              target={cert.link ? "_blank" : "_self"}
              className={`cert-card block flex flex-col p-6 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-colors ${cert.link ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {cert.title || cert.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {cert.issuer}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-mono text-slate-500">
                  {cert.year || cert.date}
                </span>
                {cert.link && (
                    <span className="text-xs text-blue-500">View Credential</span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
