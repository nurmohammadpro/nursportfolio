import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/app/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nur Mohammad | Full-Stack Web Developer",
    template: "%s | Nur Mohammad",
  },
  description:
    "Professional Web Application Developer specializing in React, Next.js, and Firebase. Providing custom SaaS solutions, malware removal, and scalable web architectures.",
  keywords: [
    "Nur Mohammad",
    "Web Developer Bangladesh",
    "Next.js Expert",
    "React Developer",
    "Firebase Specialist",
    "Malware Removal Services",
    "SaaS Development",
  ],
  authors: [{ name: "Nur Mohammad" }],
  creator: "Nur Mohammad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nurmohammad.dev",
    siteName: "Nur Mohammad Portfolio",
    title: "Nur Mohammad | Full-Stack Web Application Developer",
    description:
      "Building high-performance web applications with React, Next.js, and modern cloud technologies.",
    images: [{ url: "/Nur-New-Photo-1.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nur Mohammad | Full-Stack Web Developer",
    description: "Expert in React, Next.js, Firebase, and SaaS development",
    images: ["/Nur-New-Photo-1.png"],
    creator: "@nurmohammaddev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
