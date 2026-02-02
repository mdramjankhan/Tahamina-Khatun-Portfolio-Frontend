'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // For admin routes, we want a clean layout without the public site structure
  // This prevents style conflicts (like backdrop-filter looking constraints)
  if (isAdmin) {
      return <main className="relative w-full min-h-screen">{children}</main>;
  }

  return (
    <>
        <Navbar />
        {/* Global Glass Layer for Light Mode */}
        <div className="relative z-10 w-full overflow-x-hidden bg-white dark:bg-transparent backdrop-blur-[20px] transition-colors duration-500">
            <main className="relative w-full overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    </>
  );
}
