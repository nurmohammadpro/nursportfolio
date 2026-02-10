"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export default function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the article
    const elements = Array.from(
      document.querySelectorAll("article h2, article h3")
    );

    const items: TocItem[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: parseInt(element.tagName.substring(1)),
    }));

    setHeadings(items);

    // Generate IDs for headings that don't have them
    elements.forEach((element) => {
      if (!element.id) {
        element.id =
          element.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") || "";
      }
    });
  }, []);

  useEffect(() => {
    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "hidden lg:block sticky top-24 bg-(--secondary) border border-(--border-color) rounded-lg p-4 max-h-[calc(100vh-150px)] overflow-y-auto",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-(--text-main) mb-3 flex items-center gap-2">
        <List className="w-4 h-4" />
        On this page
      </h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "text-sm text-left transition-colors hover:text-(--brand) block w-full truncate",
                  activeId === heading.id
                    ? "text-(--brand) font-medium"
                    : "text-(--text-subtle)"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
