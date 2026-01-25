import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    url: "https://nurmohammad.derv",
    siteName: "Nur Mohammad Portfolio",
    title: "Nur Mohammad | Full-Stack Web Application Developer",
    description:
      "Building high-performance web applications with React, Next.js, and modern cloud technologies.",
    images: [{ url: "/Nur-New-Photo-1.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
