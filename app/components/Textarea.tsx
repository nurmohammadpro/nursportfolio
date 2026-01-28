"use client";

import React, { useState, useId, forwardRef, ForwardedRef } from "react";

export type TextareaVariant = "filled" | "outlined";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  variant?: TextareaVariant;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = forwardRef(
  (
    {
      label,
      variant = "outlined",
      error = false,
      helperText,
      fullWidth = false,
      rows = 4,
      resize = "vertical",
      className = "",
      value,
      onFocus,
      onBlur,
      disabled,
      ...rest
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputId = useId();

    const isLabelFloated = isFocused || !!value || rest.placeholder;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleMouseEnter = () => !disabled && setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const baseClasses = `relative transition-all duration-200 ease-out ${fullWidth ? "w-full" : ""} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    if (variant === "filled") {
      return (
        <div className={baseClasses}>
          <div
            className={`
              relative flex items-start pt-6 pb-2 px-4 rounded-t-md
              bg-gray-50 dark:bg-gray-800 border-b-2 transition-all duration-200
              ${
                error
                  ? "border-red-500 dark:border-red-400"
                  : isFocused
                    ? "border-blue-600 dark:border-blue-400"
                    : "border-gray-300 dark:border-gray-600"
              }
              ${isHovered && !isFocused && !error ? "border-gray-400 dark:border-gray-500" : ""}
              ${disabled ? "bg-gray-50/50 dark:bg-gray-800/50" : ""}
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <label
              htmlFor={inputId}
              className={`
                absolute transition-all duration-200 pointer-events-none
                ${isLabelFloated ? "text-xs" : "text-base"}
                ${
                  error
                    ? "text-red-500 dark:text-red-400"
                    : isFocused
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                }
                ${disabled ? "opacity-50" : ""}
                ${error && !isFocused ? "animate-shake" : ""}
                ${isLabelFloated ? "top-2 left-4" : "top-6 left-4"}
              `}
            >
              {label}
            </label>

            <textarea
              id={inputId}
              ref={ref}
              rows={rows}
              value={value}
              className={`
                peer w-full bg-transparent outline-none 
                text-gray-900 dark:text-gray-100 placeholder-transparent
                ${resizeClasses[resize]} min-h-15
                ${disabled ? "cursor-not-allowed" : ""}
              `}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              aria-invalid={error}
              aria-describedby={helperText ? `${inputId}-helper` : undefined}
              {...rest}
            />
          </div>

          {helperText && (
            <p
              id={`${inputId}-helper`}
              className={`mt-2 px-4 text-sm ${
                error
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {helperText}
            </p>
          )}
        </div>
      );
    }

    // Outlined variant
    return (
      <div className={baseClasses}>
        <div
          className={`
            relative flex items-start pt-6 pb-2 px-4 rounded-md border
            transition-all duration-200 bg-white dark:bg-gray-900
            ${
              error
                ? "border-red-500 dark:border-red-400"
                : isFocused
                  ? "border-blue-600 dark:border-blue-400 border-2"
                  : "border-gray-300 dark:border-gray-600"
            }
            ${isHovered && !isFocused && !error ? "border-gray-400 dark:border-gray-500" : ""}
            ${disabled ? "bg-white/50 dark:bg-gray-900/50" : ""}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <label
            htmlFor={inputId}
            className={`
              absolute transition-all duration-200 pointer-events-none
              ${isLabelFloated ? "text-xs" : "text-base"}
              ${
                error
                  ? "text-red-500 dark:text-red-400"
                  : isFocused
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
              }
              ${disabled ? "opacity-50" : ""}
              ${error && !isFocused ? "animate-shake" : ""}
              ${
                isLabelFloated
                  ? "top-0 -translate-y-1/2 left-3 px-1 bg-white dark:bg-gray-900"
                  : "top-6 left-4"
              }
            `}
          >
            {label}
          </label>

          <textarea
            id={inputId}
            ref={ref}
            rows={rows}
            value={value}
            className={`
              peer w-full bg-transparent outline-none 
              text-gray-900 dark:text-gray-100 placeholder-transparent
              ${resizeClasses[resize]} min-h-15
              ${disabled ? "cursor-not-allowed" : ""}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
        </div>

        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={`mt-2 px-4 text-sm ${
              error
                ? "text-red-500 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
