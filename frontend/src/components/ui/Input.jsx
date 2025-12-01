import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = forwardRef(({ className, error, label, startIcon, endIcon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-coffee font-semibold mb-2 text-sm md:text-base">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Start Icon (Right side in RTL) */}
        {startIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-olive/50 pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 border-sand rounded-xl focus:border-clay focus:ring-2 focus:ring-clay/20 focus:outline-none transition-all duration-300 bg-white placeholder:text-olive/50 text-coffee',
            startIcon && 'pr-12', // Add padding for start icon
            endIcon && 'pl-12',   // Add padding for end icon
            error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        />
        
        {/* End Icon (Left side in RTL) */}
        {endIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive/60">
            {endIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };