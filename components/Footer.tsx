'use client';

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="py-8 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Tahamina Khatun. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
