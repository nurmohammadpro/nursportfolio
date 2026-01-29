"use client";

import Link from "next/link";
import { Github, Linkedin, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-(--surface) border-t border-(--border-color) py-12 md:py-20">
      <div className="layout-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Brand Identity */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">Nur Mohammad</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-(--text-subtle) font-bold">
              Full-Stack Web Application Developer
            </p>
          </div>

          {/* Social Links & Navigation */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                Connect
              </h4>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-(--text-muted) hover:text-(--text-main) transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="#"
                  className="text-(--text-muted) hover:text-(--text-main) transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                Navigation
              </h4>
              <div className="flex gap-6 text-xs font-medium">
                <Link
                  href="#about"
                  className="text-(--text-muted) hover:text-(--text-main)"
                >
                  About
                </Link>
                <Link
                  href="#projects"
                  className="text-(--text-muted) hover:text-(--text-main)"
                >
                  Projects
                </Link>
                <Link
                  href="#contact"
                  className="text-(--text-muted) hover:text-(--text-main)"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-(--text-muted) hover:text-(--text-main) transition-all cursor-pointer"
          >
            Back to Top
            <div className="p-2 border border-(--border-color) rounded-full group-hover:-translate-y-1 transition-transform">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-20 pt-8 border-t border-(--border-color)/50 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-widest text-(--text-subtle) font-bold">
          <p>© 2026 Nur Mohammad. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-(--text-main)">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-(--text-main)">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
