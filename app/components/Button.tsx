"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "../lib/utils";

type ButtonVariant = "primary" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  iconClassName?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      type = "button",
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      onClick,
      fullWidth = false,
      iconClassName = "",
      ...rest
    },
    ref,
  ) => {
    const [ripple, setRipple] = useState<{
      x: number;
      y: number;
      key: number;
    } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!loading && !disabled) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRipple({ x, y, key: Date.now() });
        setTimeout(() => setRipple(null), 600);

        onClick?.(e);
      }
    };

    // Icon size based on button size
    const iconSize = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    // Icon spacing based on button size
    const iconSpacing = {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-3",
    };

    const baseClasses = `
      relative inline-flex items-center justify-center
      font-medium uppercase rounded-md overflow-hidden
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-(--text-main)/50 focus-visible:ring-offset-2
      active:scale-[0.98]
      ${disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      ${fullWidth ? "w-full" : ""}
    `;

    const variantClasses: Record<ButtonVariant, string> = {
      primary: `
        bg-(--text-main) text-(--surface) hover:opacity-90
        shadow-md hover:shadow-lg active:shadow-sm
        disabled:shadow-none
      `,
      outlined: `
        bg-transparent text-(--text-main) border border-(--text-main)
        hover:bg-(--text-main) hover:text-(--surface)
        disabled:border-(--text-subtle) disabled:text-(--text-subtle)
      `,
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-sm min-h-9",
      md: "px-6 py-3 text-base min-h-11",
      lg: "px-8 py-4 text-lg min-h-13",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={handleClick}
        disabled={disabled || loading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          iconSpacing[size],
          className,
        )}
        {...rest}
      >
        {/* Ripple effect */}
        {ripple && (
          <span
            key={ripple.key}
            className="absolute w-2 h-2 bg-current/30 rounded-full animate-ripple"
            style={{
              left: ripple.x - 4,
              top: ripple.y - 4,
            }}
          />
        )}

        {/* Loading spinner */}
        {loading && (
          <svg
            className={cn("animate-spin shrink-0", iconSize[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon on the left */}
        {icon && iconPosition === "left" && !loading && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0 transition-transform duration-200",
              iconSize[size],
              iconClassName,
            )}
          >
            {icon}
          </span>
        )}

        {/* Button text */}
        <span className="relative z-10 whitespace-nowrap">{children}</span>

        {/* Icon on the right */}
        {icon && iconPosition === "right" && !loading && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0 transition-transform duration-200",
              iconSize[size],
              iconClassName,
            )}
          >
            {icon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
