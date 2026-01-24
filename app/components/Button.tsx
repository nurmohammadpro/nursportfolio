"use client";

import React, { forwardRef } from "react";

type ButtonVariant = "contained" | "outlined" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variants: Record<ButtonVariant, string> = {
  contained: `
    bg-primary text-on-primary
    shadow-[var(--shadow-2)]
    hover:shadow-[var(--shadow-4)]
    active:shadow-[var(--shadow-6)]
    focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
  `,
  outlined: `
    bg-transparent text-primary border border-outline
    hover:bg-primary/8 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
  `,
  text: `
    bg-transparent text-primary
    hover:bg-primary/8 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-6 py-2.5 text-base gap-2",
  lg: "px-8 py-3 text-lg gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "contained",
      size = "md",
      className = "",
      type = "button",
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      onClick,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          relative inline-flex items-center justify-center
          font-medium rounded-md
          transition-all duration-200 ease-out
          overflow-hidden
          
          /* Ripple effect container */
          before:absolute before:inset-0 before:bg-current before:opacity-0
          active:before:opacity-[0.12] active:before:animate-ripple
          
          ${variants[variant]} 
          ${sizes[size]} 
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        style={{
          color:
            variant === "contained" ? "var(--on-primary)" : "var(--primary)",
        }}
        {...rest}
      >
        {/* Icon on the left */}
        {icon && iconPosition === "left" && !loading && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}

        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {children}
            </>
          ) : (
            children
          )}
        </span>

        {/* Icon on the right */}
        {icon && iconPosition === "right" && !loading && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
