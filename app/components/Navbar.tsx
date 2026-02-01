"use client";

import Image from "next/image";
import Link from "next/link";
import { TextAlignJustify, X, Sun, Moon } from "lucide-react";
import Button from "./Button";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import Logo from "./Logo";

const navItems = ["About", "Skills", "Projects", "Contact"];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  // Intersection Observer logic for scroll spying
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const item of navItems) {
        const section = item.toLowerCase();
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use the new CSS-variable based logo logic or standard paths
  const logoSrc = theme === "dark" ? "/Nur-New-Light.png" : "/Nur-New-Dark.png";

  return (
    <nav className="sticky top-0 z-50 w-full bg-(--surface)/90 backdrop-blur-md border-b border-(--border-color) transition-all duration-300">
      <div className="layout-container flex items-center justify-between h-16 md:h-20">
        {/* Logo Section */}
        <div className="shrink-0">
          <Link href="/" onClick={closeMenu} className="block">
            <Image src={logoSrc} alt="Nur Logo" width={48} height={48} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.toLowerCase();
              return (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`px-4 py-2 text-xs uppercase  font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-(--main)"
                      : "text-(--text-muted) hover:text-(--text-main)"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-(--border-color)">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-(--text-muted) hover:text-(--text-main) hover:bg-(--subtle) transition-all duration-300 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Reusable Button Component */}
            <Link href="/signin">
              <Button variant="outlined" size="sm" className="px-5">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-(--text-muted) bg-(--subtle) transition-all"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="p-2 text-(--text-main) hover:bg-(--subtle) rounded-lg transition-all"
            onClick={toggleMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <TextAlignJustify size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-x-0 top-16 z-40 bg-(--surface) border-t border-(--border-color) shadow-2xl transition-all duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-8 gap-6">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={closeMenu}
              className={`text-sm uppercase font-bold tracking-widest pb-4 border-b border-(--border-color) ${
                activeSection === item.toLowerCase()
                  ? "text-(--brand)"
                  : "text-(--text-main)"
              }`}
            >
              {item}
            </Link>
          ))}
          <Button variant="primary" size="lg" fullWidth onClick={closeMenu}>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
