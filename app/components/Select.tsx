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
      className="relative w-full border-b border-(--border-color) h-16 flex items-center group cursor-pointer"
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col w-full">
        <span
          className={`transition-all duration-300 uppercase tracking-[0.2em] font-bold ${value || isOpen ? "text-[10px] text-(--text-subtle)" : "text-xs text-(--text-muted)"}`}
        >
          {label}
        </span>
        <span className="text-base font-light text-(--text-main) mt-1 h-6">
          {selectedLabel}
        </span>
      </div>

      <ChevronDown
        size={14}
        className={`transition-transform duration-500 text-(--text-subtle) ${isOpen ? "rotate-180" : ""}`}
      />

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-(--surface) border border-(--border-color) shadow-2xl z-50 mt-1 py-2 animate-slide-up">
          {options.map((opt: any) => (
            <div
              key={opt.value}
              className="px-6 py-4 hover:bg-(--subtle) text-sm transition-colors border-b border-(--border-color)/30 last:border-0"
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
