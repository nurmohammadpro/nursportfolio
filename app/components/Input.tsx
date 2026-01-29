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
      ...rest
    }: any,
    ref: any,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = useId();
    const isLabelFloated = isFocused || !!value;

    return (
      <div
        className={`relative transition-all duration-300 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <div
          className={`
        relative flex items-center h-16 px-0 bg-transparent border-b transition-all duration-500
        ${error ? "border-red-500" : isFocused ? "border-(--text-main)" : "border-(--border-color)"}
      `}
        >
          <input
            id={inputId}
            ref={ref}
            className="w-full bg-transparent outline-none text-(--text-main) pt-6 pb-2 text-lg font-light placeholder-transparent"
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
          <label
            htmlFor={inputId}
            className={`
            absolute transition-all duration-300 pointer-events-none uppercase tracking-[0.2em] font-bold
            ${isLabelFloated ? "text-[10px] -top-2 text-(--text-subtle)" : "text-xs top-6 text-(--text-muted)"}
          `}
          >
            {label}
          </label>
        </div>
        {helperText && (
          <p className="mt-2 text-[10px] uppercase font-bold text-red-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
