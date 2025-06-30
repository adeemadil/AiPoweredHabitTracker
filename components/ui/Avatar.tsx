"use client";
import React from "react";

interface AvatarProps {
  emailOrName: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

function getAvatarProps(emailOrName: string) {
  const initials = emailOrName
    .split("@")[0]
    .split(/[._-]/)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
  const color = `hsl(${(emailOrName.length * 37) % 360}, 70%, 60%)`;
  return { initials, color };
}

export function Avatar({
  emailOrName,
  size = 36,
  className = "",
  ariaLabel,
}: AvatarProps) {
  const { initials, color } = getAvatarProps(emailOrName);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: size * 0.5,
      }}
      aria-label={ariaLabel || `Avatar for ${emailOrName}`}
    >
      {initials}
    </span>
  );
}
