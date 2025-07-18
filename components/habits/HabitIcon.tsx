import React from "react";
import PropTypes from "prop-types";

/**
 * SVG icon components for each habit type. Memoized for performance.
 * Accepts a size prop for dynamic sizing.
 */
const RunningIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#bae6fd" />
    <circle cx="32" cy="28" r="12" fill="#38bdf8" />
    <rect x="28" y="40" width="8" height="16" rx="4" fill="#0284c7" />
    <path d="M32 40c-8-8-16-8-16-24" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 40c8-8 16-8 16-24" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
  </svg>
));
RunningIcon.displayName = "RunningIcon";
const CookingIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#fef9c3" />
    <rect x="20" y="32" width="24" height="16" rx="8" fill="#fbbf24" />
    <rect x="28" y="20" width="8" height="16" rx="4" fill="#fde68a" />
    <circle cx="32" cy="28" r="6" fill="#f59e42" />
  </svg>
));
CookingIcon.displayName = "CookingIcon";
const GardeningIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#d1fae5" />
    <rect x="28" y="40" width="8" height="16" rx="4" fill="#34d399" />
    <path d="M32 40C32 30 20 28 20 16" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
    <circle cx="20" cy="16" r="6" fill="#4ade80" />
    <path d="M32 40C32 30 44 28 44 16" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
    <circle cx="44" cy="16" r="6" fill="#facc15" />
  </svg>
));
GardeningIcon.displayName = "GardeningIcon";
const PlantIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#bae6fd" />
    <rect x="28" y="40" width="8" height="16" rx="4" fill="#38bdf8" />
    <path d="M32 40C32 30 20 28 20 16" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
    <circle cx="20" cy="16" r="6" fill="#4ade80" />
    <path d="M32 40C32 30 44 28 44 16" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
    <circle cx="44" cy="16" r="6" fill="#facc15" />
  </svg>
));
PlantIcon.displayName = "PlantIcon";
const YogaIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#fef9c3" />
    <rect x="28" y="32" width="8" height="24" rx="4" fill="#fbbf24" />
    <circle cx="32" cy="24" r="10" fill="#f59e42" />
    <rect x="24" y="48" width="16" height="8" rx="4" fill="#fde68a" />
  </svg>
));
YogaIcon.displayName = "YogaIcon";
const BookIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#f3e8ff" />
    <rect x="16" y="20" width="32" height="28" rx="6" fill="#a78bfa" />
    <rect x="20" y="24" width="24" height="20" rx="3" fill="#fff" />
    <rect x="24" y="28" width="16" height="12" rx="2" fill="#e0e7ff" />
  </svg>
));
BookIcon.displayName = "BookIcon";
const MeditateIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#d1fae5" />
    <circle cx="32" cy="28" r="10" fill="#34d399" />
    <rect x="24" y="38" width="16" height="12" rx="6" fill="#6ee7b7" />
  </svg>
));
MeditateIcon.displayName = "MeditateIcon";
const JournalIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#fef3c7" />
    <rect x="20" y="20" width="24" height="28" rx="4" fill="#fbbf24" />
    <rect x="24" y="24" width="16" height="20" rx="2" fill="#fff" />
    <rect x="28" y="28" width="8" height="12" rx="1" fill="#fde68a" />
  </svg>
));
JournalIcon.displayName = "JournalIcon";
const CleanIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="32" cy="60" rx="24" ry="4" fill="#e0e7ff" />
    <rect x="28" y="32" width="8" height="24" rx="4" fill="#6366f1" />
    <rect x="20" y="20" width="24" height="12" rx="4" fill="#a5b4fc" />
    <rect x="24" y="24" width="16" height="4" rx="2" fill="#fff" />
  </svg>
));
CleanIcon.displayName = "CleanIcon";
const DefaultIcon = React.memo(({ size = 80, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <rect x="8" y="16" width="48" height="32" rx="12" fill="#bae6fd" />
    <circle cx="32" cy="32" r="12" fill="#38bdf8" />
    <ellipse cx="32" cy="48" rx="10" ry="3" fill="#0284c7" opacity="0.15" />
  </svg>
));
DefaultIcon.displayName = "DefaultIcon";

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  running: RunningIcon,
  cooking: CookingIcon,
  gardening: GardeningIcon,
  plant: PlantIcon,
  yoga: YogaIcon,
  book: BookIcon,
  meditate: MeditateIcon,
  journal: JournalIcon,
  clean: CleanIcon,
  default: DefaultIcon,
};

function getIconKey(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("run")) return "running";
  if (lower.includes("cook")) return "cooking";
  if (lower.includes("garden")) return "gardening";
  if (lower.includes("plant")) return "plant";
  if (lower.includes("yoga")) return "yoga";
  if (lower.includes("read")) return "book";
  if (lower.includes("meditat")) return "meditate";
  if (lower.includes("journal")) return "journal";
  if (lower.includes("clean")) return "clean";
  return "default";
}

/**
 * Props for HabitIcon component.
 */
export interface HabitIconProps {
  type: string;
  size?: number;
  className?: string; // Optional className for styling
}

/**
 * Atomic, scalable icon component for habits. Selects icon by type, supports dynamic sizing.
 * @param type - The habit type or name
 * @param size - Optional icon size (default 80)
 */
export default function HabitIcon({ type, size = 80, className }: HabitIconProps) {
  const key = getIconKey(type);
  const Icon = iconMap[key] || iconMap.default;
  return <Icon size={size} className={className} />;
}

HabitIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
}; 