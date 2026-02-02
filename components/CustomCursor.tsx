"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorSm = useRef<HTMLDivElement>(null);
  const cursorLg = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  // 1. Detect device type safely
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      // Also consider standard laptop breakpoint
      const isSmall = window.innerWidth < 1024;
      setIsMobile(isTouch || isSmall);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. GSAP Animation Logic
  useEffect(() => {
    if (isMobile) return;
    const sm = cursorSm.current;
    const lg = cursorLg.current;
    if (!sm || !lg) return;

    // Initial State: Hidden & Centered
    gsap.set([sm, lg], { xPercent: -50, yPercent: -50, opacity: 0 });

    // Create QuickTo setters for performance
    const xSetLg = gsap.quickTo(lg, "x", { duration: 0.5, ease: "power3" });
    const ySetLg = gsap.quickTo(lg, "y", { duration: 0.5, ease: "power3" });
    const xSetSm = gsap.quickTo(sm, "x", { duration: 0.1, ease: "power3" });
    const ySetSm = gsap.quickTo(sm, "y", { duration: 0.1, ease: "power3" });

    // Interaction Handlers
    const onMouseMove = (e: MouseEvent) => {
      gsap.to([sm, lg], { opacity: 1, duration: 0.3, overwrite: "auto" });
      xSetLg(e.clientX);
      ySetLg(e.clientY);
      xSetSm(e.clientX);
      ySetSm(e.clientY);
    };

    const onMouseLeaveDoc = () => {
       gsap.to([sm, lg], { opacity: 0, duration: 0.3 });
    };

    const onHover = () => {
      // Scale up outer circle, soften color
      gsap.to(lg, { 
        width: 60,
        height: 60,
        backgroundColor: "rgba(59, 130, 246, 0.15)", // Subtle Blue
        borderColor: "rgba(59, 130, 246, 0.5)",
        duration: 0.3,
        ease: "power2.out"
      });
      // Hide inner dot for cleaner look
      gsap.to(sm, { opacity: 0, duration: 0.2 });
    };

    const onUnhover = () => {
      // Reset to default
      gsap.to(lg, { 
        width: 32,
        height: 32,
        backgroundColor: "transparent",
        borderColor: "", // Will revert to CSS class
        duration: 0.3,
        ease: "power2.out",
        clearProps: "backgroundColor,borderColor" // Important: allows dark mode CSS classes to work again
      });
      gsap.to(sm, { opacity: 1, duration: 0.2 });
    };

    const onMouseDown = () => {
       gsap.to(lg, { scale: 0.9, duration: 0.1 });
    };

    const onMouseUp = () => {
       gsap.to(lg, { scale: 1, duration: 0.2 });
    };

    // Global Event Listener for Hover Detection
    const handleMouseOver = (e: MouseEvent) => {
       const target = e.target as HTMLElement;
       
       // Detect interactive elements
       const isInteractive = 
          target.closest('a') || 
          target.closest('button') || 
          target.closest('[role="button"]') ||
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT';

       if (isInteractive) onHover();
       else onUnhover();
    };

    // Attach Listeners
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeaveDoc);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", handleMouseOver); // Using mouseover for delegation

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Primary Dot */}
      <div 
        ref={cursorSm} 
        className="fixed top-0 left-0 w-2 h-2 bg-slate-900 dark:bg-white rounded-full pointer-events-none z-[9999]"
      />
      {/* Follower Circle */}
      <div 
        ref={cursorLg}
        className="fixed top-0 left-0 w-8 h-8 border border-slate-400 dark:border-slate-500 rounded-full pointer-events-none z-[9999] transition-opacity" 
      />
    </>
  );
}
