"use client";

import React, { forwardRef } from "react";
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
    const iconSize = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const iconSpacing = {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-3",
    };

    const baseClasses = `
      relative inline-flex items-center justify-center
      font-medium rounded-md
      transition-all duration-150 ease-out
      focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-(--brand) focus-visible:ring-offset-2
      ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${fullWidth ? "w-full" : ""}
    `;

    const variantClasses: Record<ButtonVariant, string> = {
      primary: `
        bg-(--brand) text-white hover:bg-(--brand-hover)
      `,
      outlined: `
        bg-transparent text-(--text-main) border border-(--border-color)
        hover:bg-(--subtle) hover:border-(--text-muted)
      `,
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
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

        {icon && iconPosition === "left" && !loading && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSize[size],
              iconClassName,
            )}
          >
            {icon}
          </span>
        )}

        <span className="relative z-10 whitespace-nowrap">{children}</span>

        {icon && iconPosition === "right" && !loading && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0",
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
