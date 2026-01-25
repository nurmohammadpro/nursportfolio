// components/Input.tsx
"use client";

import React, { useState, useId, forwardRef, ForwardedRef } from "react";
import { usePasswordVisibility } from "@/app/hooks/usePasswordVisibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
export type InputVariant = "filled" | "outlined";

// The interface is simpler and more robust now
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: InputVariant;
  error?: boolean;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef(
  (
    {
      label,
      variant = "filled",
      error = false,
      helperText,
      startAdornment,
      endAdornment,
      fullWidth = false,
      type = "text", // This is now guaranteed to be in scope
      className = "",
      value,
      onFocus,
      onBlur,
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = useId();

    // Use our custom hook if the input type is password
    const { isVisible, toggleVisibility } = usePasswordVisibility();
    const isPasswordField = type === "password"; // This line will now work correctly

    const isLabelFloated = isFocused || (value !== undefined && value !== "");

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Determine the actual input type based on visibility state
    const togglePassword = type === "password" && (
      <button
        type="button"
        onClick={toggleVisibility}
        className="p-1 rounded-full hover:bg-on-surface-variant/10 transition-colors focus:outline-none"
        tabIndex={-1}
      >
        {isVisible ? (
          <VisibilityOffOutlinedIcon fontSize="small" />
        ) : (
          <VisibilityOutlinedIcon fontSize="small" />
        )}
      </button>
    );

    // Combine the provided endAdornment with the password toggle
    const finalEndAdornment = (
      <>
        {endAdornment}
        {togglePassword}
      </>
    );

    const baseClasses = `
      relative transition-all duration-200 ease-in-out
      ${fullWidth ? "w-full" : ""}
      ${className}
    `;

    // --- Filled Variant Styles ---
    if (variant === "filled") {
      return (
        <div className={`${baseClasses}`}>
          <div
            className={`
              relative flex items-center h-14 px-3 pt-2 rounded-t-md
              bg-surface border-b transition-all duration-200
              ${
                error
                  ? "border-error"
                  : isFocused
                    ? "border-primary"
                    : "border-outline"
              }
              ${isFocused ? "shadow-(--shadow-1)" : ""}
            `}
          >
            {startAdornment && (
              <span className="mr-2 text-on-surface-variant">
                {startAdornment}
              </span>
            )}

            <input
              id={inputId}
              ref={ref}
              type={type}
              className={`
                peer w-full bg-transparent outline-none text-on-surface
                placeholder-transparent autofill:pb-1
              `}
              placeholder={label}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={value}
              {...rest}
            />

            <label
              htmlFor={inputId}
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none
                text-on-surface-variant
                ${
                  isLabelFloated
                    ? "text-xs top-1.5"
                    : "text-base top-1/2 -translate-y-1/2"
                }
                ${isFocused ? "text-primary" : ""}
                ${error ? "text-error" : isFocused ? "" : ""}
                ${startAdornment ? "left-10" : "left-3"}
                ${error && !isFocused ? "animate-shake" : ""}
              `}
            >
              {label}
            </label>

            {finalEndAdornment && (
              <span className="ml-2 text-on-surface-variant flex items-center">
                {finalEndAdornment}
              </span>
            )}
          </div>

          {helperText && (
            <p
              className={`mt-1 px-3 text-xs ${error ? "text-error" : "text-on-surface-variant"}`}
            >
              {helperText}
            </p>
          )}
        </div>
      );
    }

    // --- Outlined Variant Styles ---
    return (
      <div className={`${baseClasses}`}>
        <div
          className={`
            relative flex items-center h-14 px-3 rounded-md border
            transition-all duration-200 bg-surface
            ${
              error
                ? "border-error"
                : isFocused
                  ? "border-primary"
                  : "border-outline"
            }
            ${isFocused ? "shadow-(--shadow-1)" : ""}
          `}
        >
          {startAdornment && (
            <span className="mr-2 text-on-surface-variant">
              {startAdornment}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`
              peer w-full bg-transparent outline-none text-on-surface
              placeholder-transparent autofill:pt-1
            `}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            {...rest}
          />

          <label
            htmlFor={inputId}
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              bg-surface px-1
              text-on-surface-variant
              ${
                isLabelFloated
                  ? "text-xs top-0 -translate-y-1/2"
                  : "text-base top-1/2 -translate-y-1/2"
              }
              ${isFocused ? "text-primary" : ""}
              ${error ? "text-error" : ""}
              ${startAdornment ? "left-10" : "left-3"}
              ${error && !isFocused ? "animate-shake" : ""}
            `}
          >
            {label}
          </label>

          {finalEndAdornment && (
            <span className="ml-2 text-on-surface-variant flex items-center">
              {finalEndAdornment}
            </span>
          )}
        </div>

        {helperText && (
          <p
            className={`mt-1 px-3 text-xs ${error ? "text-error" : "text-on-surface-variant"}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
