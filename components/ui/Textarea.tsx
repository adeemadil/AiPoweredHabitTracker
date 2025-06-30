"use client";
import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "error" | "success";
}

const base =
  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
const variants = {
  default: "border-gray-300",
  error: "border-red-500 focus:ring-red-500",
  success: "border-green-500 focus:ring-green-500",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "default", className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
