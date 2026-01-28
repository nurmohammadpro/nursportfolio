"use client";

import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "./ThemeProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--md-sys-color-outline)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-[var(--md-sys-color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-base">NM</span>
              </div>
              <span className="text-xl font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
                Nur Mohammad
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] font-semibold rounded-lg hover:bg-[var(--md-sys-color-primary-container)]/50 transition-all duration-200 text-sm"
              >
                {item.name}
              </a>
            ))}

            <div className="mx-4 h-6 w-px bg-[var(--md-sys-color-outline)]" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface-variant)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Brightness7Icon className="w-5 h-5 text-yellow-500" />
              ) : (
                <Brightness4Icon className="w-5 h-5" />
              )}
            </button>

            {/* CTA Button */}
            <a
              href="#contact"
              className="ml-2 px-6 py-2.5 bg-[var(--md-sys-color-primary)] text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:bg-[#2b6be6] hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Hire Me
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-[var(--md-sys-color-surface-variant)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Brightness7Icon className="w-5 h-5 text-yellow-500" />
              ) : (
                <Brightness4Icon className="w-5 h-5 text-[var(--md-sys-color-on-surface-variant)]" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-variant)] transition-all duration-200"
            >
              {isMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]">
            <div className="px-2 pt-4 pb-6 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3.5 rounded-xl font-bold text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)]/50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 px-4">
                <a
                  href="#contact"
                  className="block w-full py-3.5 bg-[var(--md-sys-color-primary)] text-white font-extrabold rounded-xl text-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hire Me
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
