"use client";

import React, { forwardRef, useState } from "react";

type ButtonVariant = "contained" | "outlined" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

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
      fullWidth = false,
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

    const baseClasses = `
      relative inline-flex items-center justify-center
      font-medium rounded-md overflow-hidden
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-blue-500/50 focus-visible:ring-offset-2
      active:scale-[0.98]
      ${disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      ${fullWidth ? "w-full" : ""}
    `;

    const variantClasses: Record<ButtonVariant, string> = {
      contained: `
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
        text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700
        shadow-md hover:shadow-lg active:shadow-sm
        disabled:shadow-none
      `,
      outlined: `
        bg-transparent text-blue-600 dark:text-blue-400
        border border-gray-300 dark:border-gray-600
        hover:bg-blue-50 dark:hover:bg-blue-500/10
        active:bg-blue-100 dark:active:bg-blue-500/20
        disabled:border-gray-200 dark:disabled:border-gray-700
        disabled:text-gray-400 dark:disabled:text-gray-500
      `,
      text: `
        bg-transparent text-blue-600 dark:text-blue-400
        hover:bg-blue-50 dark:hover:bg-blue-500/10
        active:bg-blue-100 dark:active:bg-blue-500/20
        disabled:text-gray-400 dark:disabled:text-gray-500
      `,
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-sm gap-2 min-h-[36px]",
      md: "px-6 py-3 text-base gap-3 min-h-[44px]",
      lg: "px-8 py-4 text-lg gap-3 min-h-[52px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
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
            className="animate-spin h-5 w-5 mr-2"
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
          <span className="shrink-0 transition-transform duration-200">
            {icon}
          </span>
        )}

        {/* Button text */}
        <span className="relative z-10 whitespace-nowrap">{children}</span>

        {/* Icon on the right */}
        {icon && iconPosition === "right" && !loading && (
          <span className="shrink-0 transition-transform duration-200">
            {icon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
