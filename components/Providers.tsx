"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' }, success: { iconTheme: { primary: '#4ade80', secondary: 'black' } } }} />
    </ThemeProvider>
  );
}
