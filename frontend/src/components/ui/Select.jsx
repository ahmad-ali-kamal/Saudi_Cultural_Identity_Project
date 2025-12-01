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
        <label className="block text-coffee font-semibold mb-2 text-sm md:text-base">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 pr-10 border-2 border-sand rounded-xl appearance-none focus:border-clay focus:ring-2 focus:ring-clay/20 focus:outline-none transition-all duration-300 bg-white text-coffee cursor-pointer',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-olive">
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
