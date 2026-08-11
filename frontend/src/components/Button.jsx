import React from 'react';
import { cn } from '../utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-serif font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm",
    secondary: "bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] shadow-sm",
    outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground)]",
    ghost: "bg-transparent hover:bg-gray-100 text-[var(--color-foreground)]",
    danger: "bg-[var(--color-danger)] text-white hover:opacity-90 shadow-sm"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
