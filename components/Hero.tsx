'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    cta?: string;
    resumeLink?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Background elements fade in
      tl.from('.bg-blob', {
        scale: 0.8,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: 'power2.out',
      });

      // Text reveal animation
      tl.from('.hero-text-reveal', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
      }, "-=1.5");
      
      // CTA & Description fade in
      tl.from('.hero-fade-in', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      }, "-=0.8");

    }, heroRef);
    return () => ctx.revert();
  }, []);

  if (!data) return null;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        
        <div className="relative z-10 max-w-5xl w-full text-center">
            <h1 className="hero-text-reveal text-6xl md:text-8xl font-serif font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                {data.title || "Tahamina Khatun"}
            </h1>
            <p className="hero-text-reveal text-xl md:text-2xl font-light text-blue-600 dark:text-blue-400 mb-8">
                {data.subtitle || "HR Specialist & Finance Enthusiast"}
            </p>
            <p className="hero-fade-in max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
                {data.description || "Building bridges between talent and financial success through strategic insights and dedicated leadership."}
            </p>
            <div className="hero-fade-in flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                    href="#contact" 
                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-slate-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
                >
                    Contact Me
                </a>
                <a 
                    href={data.resumeLink || "#resume"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-transparent border-2 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded-full font-medium hover:border-slate-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                >
                    {data.cta || "View Resume"}
                </a>
            </div>
        </div>
    </section>
  );
}
