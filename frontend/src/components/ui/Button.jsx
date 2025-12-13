import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const variants = {
    primary: 'bg-clay text-white hover:bg-saudi-green hover:shadow-lg shadow-md border-transparent',
    secondary: 'bg-saudi-green text-white hover:bg-clay hover:shadow-lg shadow-md border-transparent',
    outline: 'bg-transparent border-2 border-clay text-clay hover:bg-clay hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-coffee-dark',
    ghost: 'bg-transparent text-coffee dark:text-sand hover:bg-sand/30 dark:hover:bg-coffee-light',
    danger: 'bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-600 hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
