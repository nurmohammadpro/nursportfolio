import { DM_Serif_Display, Raleway, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/app/components/ThemeProvider";
import LayoutWrapper from "./components/LayoutWrapper";

// Configure the Serif for headings
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading", // This maps to your CSS variable
});

// Configure Raleway for body text
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body", // This maps to your CSS variable
});

// Backend font: Inter is perfect for the "Engine" workstation
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dashboard",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${raleway.variable} ${inter.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
