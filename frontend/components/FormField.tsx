"use client";

import { useState } from "react";
import clsx from "clsx";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  accept?: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export default function FormField({ label, name, type = "text", placeholder, defaultValue, value, required = false, onChange, className, accept, rows, error, disabled = false, autoComplete }: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!defaultValue || !!value);

  const isTextarea = type === "textarea";
  const isSelect = type === "select";
  const isFile = type === "file";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setHasValue(!!e.target.value);
    onChange?.(e.target.value);
  };

  const inputClasses = clsx(
    "w-full rounded-xl border bg-black/40 px-4 py-3 text-sm text-white placeholder:text-transparent outline-none transition-all duration-200",
    "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
    "hover:border-white/25",
    error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-white/15",
    isFile && "py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-brand-500",
    className,
  );

  const labelClasses = clsx("pointer-events-none absolute left-4 transition-all duration-200", (isFocused || hasValue || placeholder === undefined) && !isFile ? "-top-2.5 text-xs font-medium text-brand-500 bg-[#0b0b0f] px-1" : "top-3.5 text-sm text-gray-500");

  return (
    <div className="relative">
      {isTextarea ? (
        <textarea name={name} defaultValue={defaultValue} value={value} placeholder={placeholder || label} rows={rows || 3} required={required} disabled={disabled} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onChange={handleChange} className={inputClasses} />
      ) : isSelect ? (
        <select name={name} defaultValue={defaultValue} value={value} required={required} disabled={disabled} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onChange={handleChange} className={inputClasses}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* children passed separately */}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          value={value}
          placeholder={placeholder || label}
          required={required}
          disabled={disabled}
          accept={accept}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={inputClasses}
        />
      )}
      {!isFile && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-brand-500 ml-0.5">*</span>}
        </label>
      )}
      {isFile && (
        <label className="mb-1 block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-brand-500 ml-0.5">*</span>}
        </label>
      )}
      {error && <p className="mt-1.5 text-xs text-red-400 animate-shake">{error}</p>}
    </div>
  );
}
