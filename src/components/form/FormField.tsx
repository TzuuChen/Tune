"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  error?: string;
  /** Optional trailing element (e.g. password visibility toggle) */
  trailing?: React.ReactNode;
  inputProps?: Omit<React.ComponentProps<"input">, "name" | "type" | "placeholder" | "className">;
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  className,
  inputClassName,
  error,
  trailing,
  inputProps,
}: FormFieldProps) {
  const id = React.useId();
  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <label
        htmlFor={id}
        className="text-sm font-normal leading-[1.4] text-[#21272a]"
      >
        {label}
      </label>
      <div className="flex h-12 w-full items-center gap-2 rounded-none border-b border-[#c1c7cd] bg-[#f2f4f8] px-4 py-3">
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-auto flex-1 min-w-0 border-0 bg-transparent px-0 py-0 text-base text-foreground shadow-none placeholder:text-[#697077] focus-visible:ring-0 focus-visible:ring-offset-0",
            inputClassName
          )}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p className="text-xs font-normal leading-[1.4] text-[#697077]">
          {error}
        </p>
      )}
    </div>
  );
}

export { FormField };
