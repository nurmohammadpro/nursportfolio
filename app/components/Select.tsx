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
        {/* Scaled down the label to p-engine-sm equivalent */}
        <span
          className={`transition-all duration-300 uppercase tracking-[0.15em] font-black ${
            value || isOpen
              ? "text-[8px] text-(--text-subtle) -translate-y-1"
              : "text-[10px] text-(--text-muted)"
          }`}
        >
          {label}
        </span>
        {/* Refined selected text to match p-body utility */}
        <span className="text-[12px] font-bold text-(--text-main) h-4 truncate">
          {selectedLabel}
        </span>
      </div>

      <ChevronDown
        size={12}
        className={`transition-transform duration-500 text-(--text-subtle) ${isOpen ? "rotate-180" : ""}`}
      />

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-(--surface) border border-(--border-color) shadow-2xl z-150 mt-1 py-1 animate-slide-up rounded-xl overflow-hidden">
          {options.map((opt: any) => (
            <div
              key={opt.value}
              className="px-4 py-2.5 hover:bg-(--subtle) text-[11px] font-bold transition-colors border-b border-(--border-color)/30 last:border-0 text-(--text-main)"
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
