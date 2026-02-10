"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Select = ({ label, options, value, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((opt: any) => opt.value === value)?.label || "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full border-b border-(--border-color) h-12 flex items-center group cursor-pointer"
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col w-full">
        <span
          className={`transition-all duration-200 font-medium ${
            value || isOpen
              ? "text-xs text-(--text-subtle) -translate-y-1"
              : "text-sm text-(--text-muted)"
          }`}
        >
          {label}
        </span>
        <span className="text-sm font-medium text-(--text-main) h-4 truncate">
          {selectedLabel}
        </span>
      </div>

      <ChevronDown
        size={16}
        className={`transition-transform duration-200 text-(--text-subtle) ${isOpen ? "rotate-180" : ""}`}
      />

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-(--surface) border border-(--border-color) shadow-lg z-50 mt-1 py-1 rounded-lg overflow-hidden">
          {options.map((opt: any) => (
            <div
              key={opt.value}
              className="px-4 py-2.5 hover:bg-(--subtle) text-sm font-medium transition-colors text-(--text-main)"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
