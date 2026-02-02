'use client';

export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top Left Blob - Purple (Match Dark Hue) */}
      <div className="absolute top-0 -left-4 w-96 h-96 
        bg-purple-500 opacity-20 mix-blend-normal filter blur-[100px] animate-blob
        dark:bg-purple-900 dark:opacity-30 dark:mix-blend-screen"></div>
      
      {/* Top Right Blob - Blue (Match Dark Hue) */}
      <div className="absolute top-0 -right-4 w-96 h-96 
        bg-blue-500 opacity-20 mix-blend-normal filter blur-[100px] animate-blob animation-delay-2000
        dark:bg-blue-900 dark:opacity-30 dark:mix-blend-screen"></div>
      
      {/* Bottom Left Blob - Pink (Match Dark Hue) */}
      <div className="absolute -bottom-32 left-20 w-96 h-96 
        bg-pink-500 opacity-20 mix-blend-normal filter blur-[100px] animate-blob animation-delay-4000
        dark:bg-pink-900 dark:opacity-30 dark:mix-blend-screen"></div>

      {/* Center Blob - Indigo (Match Dark Hue) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] 
        bg-indigo-500 opacity-20 mix-blend-normal filter blur-[120px] animate-blob
        dark:bg-indigo-950 dark:opacity-20 dark:mix-blend-screen"></div>
    </div>
  );
}
