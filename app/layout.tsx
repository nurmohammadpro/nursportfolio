import { DM_Serif_Display, Raleway, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/app/components/ThemeProvider";
import LayoutWrapper from "./components/LayoutWrapper";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dashboard",
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
    "Professional Web Application Developer specializing in React, Next.js, and Firebase. Providing custom SaaS solutions, malware removal, and scalable web architectures.",
  keywords: [
    "Nur Mohammad",
    "Web Developer Bangladesh",
    "Next.js Expert",
    "React Developer",
    "Firebase Specialist",
    "Malware Removal Services",
    "SaaS Development",
    "nurmohammad.pro",
  ],
  authors: [{ name: "Nur Mohammad" }],
  creator: "Nur Mohammad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nurmohammad.pro",
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
      "Expert in React, Next.js, Firebase, and custom SaaS development.",
    sameAs: ["https://github.com", "https://linkedin.com"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Professional Web Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom SaaS Development",
            description:
              "Building scalable SaaS applications with React, Next.js, and Firebase.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Web Application Development",
            description:
              "Building fast, reliable, modern web applications with React, Next.js, tailwindCSS, ShadcnUI etc.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Automation & Bot Development",
            description:
              "Automating web app, building custom BOT will, fill up forms, listing products, emails to the recipient, generate leads to the client",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Design & Customization",
            description:
              "Customizing and Wordpress theme designing help to get started for the StartUps",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Security & Malware Removal",
            description:
              "Specialized malware removal and security hardening for WordPress websites.",
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
