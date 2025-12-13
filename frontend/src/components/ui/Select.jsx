import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Select = forwardRef(({ className, label, error, options = [], ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-coffee dark:text-sand font-semibold mb-2 text-sm md:text-base transition-colors duration-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 pr-10 border-2 border-sand dark:border-coffee-dark rounded-xl appearance-none focus:border-clay dark:focus:border-gold focus:ring-2 focus:ring-clay/20 dark:focus:ring-gold/20 focus:outline-none transition-all duration-300 bg-white dark:bg-clay/55 text-coffee dark:text-cream cursor-pointer',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-clay/55">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-olive dark:text-sand/60 transition-colors duration-300">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
