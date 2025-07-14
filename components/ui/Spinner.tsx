import React from "react";

export function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className={`inline ${className} text-gray-200 animate-spin fill-primary-600`}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          className="opacity-25"
        />
        <path
          d="M50 5a45 45 0 1 1-31.82 76.82"
          fill="currentColor"
          className="opacity-75"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
} 