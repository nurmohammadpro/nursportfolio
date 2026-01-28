"use client";

import React, { useState, useId, forwardRef, ForwardedRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export type SelectVariant = "filled" | "outlined";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  variant?: SelectVariant;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

const Select = forwardRef(
  (
    {
      label,
      variant = "outlined",
      error = false,
      helperText,
      fullWidth = false,
      options,
      className = "",
      value,
      onFocus,
      onBlur,
      disabled,
      ...rest
    }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputId = useId();

    const isLabelFloated = isFocused || !!value || value === "";

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleMouseEnter = () => !disabled && setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const baseClasses = `relative transition-all duration-200 ease-out ${fullWidth ? "w-full" : ""} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

    // Enhanced select styles with better spacing
    const selectStyles = `
      peer w-full bg-transparent outline-none 
      text-gray-900 dark:text-gray-100 appearance-none
      cursor-pointer
      py-4 pr-10
      ${disabled ? "cursor-not-allowed" : ""}
    `;

    // Option styles that work better across browsers
    const optionStyles = {
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "16px",
      paddingRight: "16px",
      backgroundColor: "white",
      color: "#1f2937",
      fontSize: "16px",
      lineHeight: "24px",
    };

    const darkOptionStyles = {
      ...optionStyles,
      backgroundColor: "#111827",
      color: "#f3f4f6",
    };

    if (variant === "filled") {
      return (
        <div className={baseClasses}>
          <div
            className={`
              relative flex items-center min-h-14 px-4 pt-2 rounded-t-md
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
            <select
              id={inputId}
              ref={ref}
              value={value}
              className={selectStyles}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              aria-invalid={error}
              aria-describedby={helperText ? `${inputId}-helper` : undefined}
              style={{
                // Ensure proper height for the select element
                height: "100%",
              }}
              {...rest}
            >
              <option value="" disabled hidden style={optionStyles}>
                {/* Empty option for label floating */}
              </option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={optionStyles}
                >
                  {option.label}
                </option>
              ))}
            </select>

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
                    ? "top-2 left-4"
                    : "top-1/2 -translate-y-1/2 left-4"
                }
              `}
            >
              {label}
            </label>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <KeyboardArrowDownIcon
                className={`transition-transform ${isFocused ? "rotate-180" : ""}`}
              />
            </div>
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
            relative flex items-center min-h-14 px-4 rounded-md border
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
          <select
            id={inputId}
            ref={ref}
            value={value}
            className={selectStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            style={{
              // Ensure proper height for the select element
              height: "100%",
            }}
            {...rest}
          >
            <option value="" disabled hidden style={optionStyles}>
              {/* Empty option for label floating */}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={optionStyles}
              >
                {option.label}
              </option>
            ))}
          </select>

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
                  : "top-1/2 -translate-y-1/2 left-4"
              }
            `}
          >
            {label}
          </label>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
            <KeyboardArrowDownIcon
              className={`transition-transform ease-in-out duration-200 ${isFocused ? "rotate-180" : ""}`}
            />
          </div>
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

Select.displayName = "Select";

export default Select;
