"use client";

import React, { useState, useId, forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error = false,
      helperText,
      fullWidth = false,
      className = "",
      value,
      onFocus,
      onBlur,
      endAdornment,
      ...rest
    }: any,
    ref: any,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = useId();
    const isLabelFloated = isFocused || !!value;

    return (
      <div
        className={`relative transition-all duration-200 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <div
          className={`
        relative flex items-center h-14 px-0 bg-transparent border-b transition-all duration-200
        ${error ? "border-red-500" : isFocused ? "border-(--text-main)" : "border-(--border-color)"}
      `}
        >
          <input
            id={inputId}
            ref={ref}
            className="w-full bg-transparent outline-none text-(--text-main) pt-5 pb-2 text-base font-normal placeholder-transparent"
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            value={value}
            {...rest}
          />

          {endAdornment && (
            <div className="flex items-center ml-2 transition-colors">
              {endAdornment}
            </div>
          )}

          <label
            htmlFor={inputId}
            className={`
            absolute transition-all duration-200 pointer-events-none font-medium
            ${isLabelFloated ? "text-xs -top-1 text-(--text-subtle)" : "text-sm top-4 text-(--text-muted)"}
          `}
          >
            {label}
          </label>
        </div>
        {helperText && (
          <p className="mt-1.5 text-xs text-red-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
