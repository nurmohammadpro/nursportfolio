import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/Providers";
import LayoutWrapper from "./components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://nurmohammad.pro"
      : "http://localhost:3000",
  ),
  title: {
    default: "Nur Mohammad | Web Application Developer",
    template: "%s | Nur Mohammad",
  },
  description:
    "Web Application Developer who builds reliable, secure, and easy-to-use applications with React, Next.js, and Firebase.",
  keywords: [
    "Nur Mohammad",
    "Web Developer Bangladesh",
    "Next.js Developer",
    "React Developer",
    "Firebase Developer",
    "Malware Removal Services",
    "Web Application Development",
    "nurmohammad.pro",
  ],
  authors: [{ name: "Nur Mohammad" }],
  creator: "Nur Mohammad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nurmohammad.pro",
    siteName: "Nur Mohammad Portfolio",
    title: "Nur Mohammad | Web Application Developer",
    description:
      "Building reliable web applications with React, Next.js, and modern technologies.",
    images: [{ url: "/Nur-New-Photo-1.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nur Mohammad | Web Application Developer",
    description: "Building web applications with React, Next.js, and Firebase",
    images: ["/Nur-New-Photo-1.png"],
    creator: "@nurmohammaddev",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define the structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nur Mohammad",
    url: "https://nurmohammad.pro",
    image: "https://nurmohammad.pro/Nur-New-Photo-1.png",
    jobTitle: "Web Application Developer",
    description:
      "Web Application Developer working with React, Next.js, and Firebase.",
    sameAs: ["https://github.com", "https://linkedin.com"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Professional Web Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Application Development",
            description:
              "Custom web applications using MERN stack (MongoDB, Express, React, Node.js) or Next.js with modern best practices.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Design & Customization",
            description:
              "Custom WordPress themes, site designs, and customization tailored to your brand and business needs.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Security",
            description:
              "Security audits, malware removal, SSL setup, firewall configuration, and hardening WordPress sites from threats.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Automation & Bot Development",
            description:
              "Custom automation scripts, web scraping, API integrations, and intelligent bots for repetitive tasks and workflows.",
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
