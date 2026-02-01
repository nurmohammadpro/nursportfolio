"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

const Footer = () => {
  const pathname = usePathname();

  // Navigation array with path tracking
  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/nurmohammadpro",
      label: "Github",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/nur-mohammad-149515b4/",
      label: "Linkedin",
    },
    { icon: Twitter, href: "https://x.com/nurmohammad_pro", label: "Twitter" },
  ];

  return (
    <footer className="w-full bg-(--surface) border-t border-(--border-color) py-16 md:py-24 dashboard-engine">
      <div className="layout-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Identity */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-2xl font-medium text-(--text-main)">
              Nur<span className="text-(--text-subtle)"> Mohammad</span>
            </h3>
            <p className="p-engine-body text-(--text-subtle) max-w-sm leading-relaxed">
              Web Application Developer specializing in high-performance SaaS
              engines and automated infrastructure.
            </p>
            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 border border-(--border-color) rounded-xl text-(--text-muted) hover:text-(--text-main) hover:border-(--text-main) transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation with isActive Logic */}
          <div className="md:col-span-3 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-(--text-muted)">
              Navigation
            </p>
            <ul className="space-y-4">
              {navLinks.map((link) => {
                // Determine if the link is active based on current path
                const isActive = pathname === link.href;

                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-xs font-bold transition-colors ${
                        isActive
                          ? "text-(--text-main) border-l-2 border-(--text-main) pl-2"
                          : "text-(--text-subtle) hover:text-(--text-main)"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Status & Availability */}
          <div className="md:col-span-4 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-(--text-muted)">
              Availability
            </p>
            <div className="p-6 border border-(--border-color) rounded-2xl bg-(--subtle)/5">
              <p className="text-xs font-bold leading-relaxed">
                Currently accepting direct service inquiries via
                nurmohammad.pro.
              </p>
              <Link
                href="/#contact"
                className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest text-(--text-main) border-b border-(--text-main) pb-1"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>

        {/* Legal & System Status */}
        <div className="mt-20 pt-8 border-t border-(--border-color)/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mt-20 pt-8 border-t border-(--border-color)/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-widest text-(--text-subtle) font-bold">
              © 2026 Nur Mohammad. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] uppercase tracking-widest text-(--text-subtle) font-bold">
              <Link
                href="/privacy"
                className="hover:text-(--text-main) transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-(--text-main) transition-colors"
              >
                Terms
              </Link>
              <div className="flex items-center gap-2">
                {/* Pulse indicator for reliability */}
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p>Systems Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
