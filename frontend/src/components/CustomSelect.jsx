import { useState, useRef, useEffect } from 'react';

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 pr-12 border-2 border-first rounded-xl focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-300 text-lg bg-gradient-to-l from-primary to-secondary/10 text-secondary font-bold cursor-pointer hover:shadow-lg hover:scale-[1.02] text-right"
      >
        <span className={value ? 'text-secondary' : 'text-secondary'}>
          {displayText}
        </span>

        {/* Chevron Icon */}
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="#FFDBBA"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-primary border-2 border-secondary rounded-xl shadow-2xl max-h-80 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
  w-full px-6 py-4 text-right text-lg font-semibold transition-all duration-200
  ${ value === option.value 
      ? 'bg-primary text-secondary' 
      : 'bg-secondary text-primary' }
  ${ value !== option.value ? 'hover:bg-primary hover:text-secondary' : 'hover:bg-secondary hover:text-primary' }
  first:rounded-t-xl last:rounded-b-xl border-b border-primary/70 last:border-b-0
`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
