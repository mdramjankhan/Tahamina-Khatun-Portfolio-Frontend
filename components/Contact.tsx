'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMail, FiPhone, FiLinkedin, FiMapPin } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  data: {
    email?: string;
    phone?: string;
    linkedin?: string;
    location?: string;
  };
}

export default function Contact({ data }: ContactProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from('.contact-anim', {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
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

  if (!data) return null;

  return (
    <section id="contact" ref={containerRef} className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="contact-anim text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-slate-800 dark:text-slate-100">
            Get In Touch
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
            Available for opportunities and collaborations.
            </p>
        </div>

        <div className="contact-anim bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 md:p-12 border border-slate-100 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="flex flex-col items-center md:items-start space-y-2">
                     <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-1">
                        <FiMail size={20} />
                        <span className="font-semibold text-slate-900 dark:text-white">Email</span>
                     </div>
                     <a href={`mailto:${data.email || ''}`} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                        {data.email || "Email not available"}
                     </a>
                </div>

                 <div className="flex flex-col items-center md:items-start space-y-2">
                     <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-1">
                        <FiPhone size={20} />
                        <span className="font-semibold text-slate-900 dark:text-white">Phone</span>
                     </div>
                     <a href={`tel:${data.phone || ''}`} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                        {data.phone || "Phone not available"}
                     </a>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-2">
                     <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-1">
                        <FiLinkedin size={20} />
                         <span className="font-semibold text-slate-900 dark:text-white">LinkedIn</span>
                     </div>
                     <a href={data.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                        {data.linkedin ? "Visit Profile" : "Not Linked"}
                     </a>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-2">
                     <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-1">
                        <FiMapPin size={20} />
                        <span className="font-semibold text-slate-900 dark:text-white">Location</span>
                     </div>
                     <p className="text-slate-600 dark:text-slate-300">
                        {data.location || "Location not specified"}
                     </p>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
}
