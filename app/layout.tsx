import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import ThemeToggle from "@/components/ThemeToggle";
import CustomCursor from "@/components/CustomCursor";
import BackgroundBlobs from "@/components/BackgroundBlobs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tahamina-khatun.vercel.app"),
  title: {
    default: "Tahamina Khatun | HR Specialist & Financial Analyst",
    template: "%s | Tahamina Khatun"
  },
  description: "Portfolio of Tahamina Khatun - An aspiring HR Specialist and Financial Analyst bridging the gap between talent management and financial efficiency.",
  keywords: ["HR Specialist", "Financial Analyst", "BBA", "Human Resource Management", "Tahamina Khatun", "Portfolio", "Dhaka"],
  authors: [{ name: "Tahamina Khatun" }],
  creator: "Tahamina Khatun",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tahamina-khatun.vercel.app", // Conceptual URL
    title: "Tahamina Khatun | HR & Finance Portfolio",
    description: "Dedicated BBA student combining strategic human resource management with sharp financial acumen.",
    siteName: "Tahamina Khatun Portfolio",
    images: [
      {
        url: "/og-image.jpg", // We will need to ensure this exists or is handled
        width: 1200,
        height: 630,
        alt: "Tahamina Khatun Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tahamina Khatun | HR & Finance Portfolio",
    description: "Aspiring HR Specialist & Financial Analyst. View my experience, skills, and projects.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black transition-colors duration-300 relative`}
      >
        <BackgroundBlobs />
        <Providers>
          <CustomCursor />
          <SmoothScroll>
            {/* Global Glass Layer for Light Mode */}
            <div className="relative z-10 w-full overflow-x-hidden bg-white dark:bg-transparent backdrop-blur-[20px] transition-colors duration-500">
              <Navbar />
              <main className="relative w-full overflow-x-hidden">{children}</main>
              <Footer />
            </div>
            <div className="fixed bottom-6 right-6 z-50">
              <ThemeToggle />
            </div>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
