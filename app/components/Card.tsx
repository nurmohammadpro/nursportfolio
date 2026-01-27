// components/Card.tsx
"use client";

import React from "react";
import Image from "next/image"; // 1. Import the Next.js Image component
import Button from "./Button";

// Define the different visual styles for the card
const cardVariants = {
  default:
    "bg-surface border border-outline shadow-[var(--shadow-2)] hover:shadow-[var(--shadow-4)]",
  outlined: "bg-transparent border border-outline hover:bg-surface-variant/50",
  text: "bg-transparent border-0 hover:bg-surface-variant/30",
};

interface CardProps {
  // Content
  topSubHeading?: string;
  heading: string;
  bottomSubHeading?: string;
  description?: string;
  imageUrl?: string;
  icon?: React.ReactNode;

  // Action
  actionLabel?: string;
  onActionClick?: () => void;

  // Behavior
  onClick?: () => void;
  variant?: keyof typeof cardVariants;
  priority?: boolean; // 2. Add a priority prop

  // Styling
  className?: string;
  children?: React.ReactNode;
}

const Card = ({
  topSubHeading,
  heading,
  bottomSubHeading,
  description,
  imageUrl,
  icon,
  actionLabel,
  onActionClick,
  onClick,
  variant = "default",
  priority = false, // Default priority to false
  className = "",
  children,
}: CardProps) => {
  const isClickable = !!onClick;

  return (
    <div
      className={`
        group relative flex flex-col overflow-hidden rounded-xl
        transition-all duration-300 ease-out
        ${cardVariants[variant]}
        ${isClickable ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
    >
      {/* Optional Image Section */}
      {imageUrl && (
        // The parent div controls the aspect ratio and positioning
        <div className="relative aspect-video w-full overflow-hidden bg-surface-variant">
          {/* 3. Use the Next.js Image component */}
          <Image
            src={imageUrl}
            alt={heading}
            fill // `fill` makes the image cover the parent container
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Helps the browser choose the right image size
            priority={priority} // Pass the priority prop to the Image component
          />
        </div>
      )}

      {/* Main Content Section */}
      <div className="flex flex-1 flex-col p-6">
        {/* Top Section: Icon and Sub-heading */}
        <div className="flex items-center justify-between mb-2">
          {icon && <div className="text-primary">{icon}</div>}
          {topSubHeading && (
            <p className="text-sm font-medium text-on-surface-variant">
              {topSubHeading}
            </p>
          )}
        </div>

        {/* Main Heading */}
        <h3 className="text-xl font-semibold text-on-surface mb-2">
          {heading}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-on-surface-variant flex-1 mb-4">
            {description}
          </p>
        )}

        {/* Bottom Section: Sub-heading and Action Button */}
        <div className="flex items-center justify-between mt-auto">
          {bottomSubHeading && (
            <p className="text-sm text-on-surface-variant">
              {bottomSubHeading}
            </p>
          )}
          {actionLabel && onActionClick && (
            <Button
              variant="text"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the card's onClick from firing
                onActionClick();
              }}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
