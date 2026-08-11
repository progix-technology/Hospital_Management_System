import React from 'react';
import { cn } from '../utils/cn';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: "bg-[var(--color-primary)] text-white",
    secondary: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-yellow-700",
    danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
    outline: "text-[var(--color-foreground)] border border-[var(--color-border)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
