import { Check } from 'lucide-react';

function MCQQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = question.options || [];

  // Use image URL directly
  const imageSrc = question.imageUrl;

  // Determine text direction based on language
  const isEnglish = question.contentLanguage?.toLowerCase() === 'english' ||
                    question.language?.toLowerCase() === 'english';
  const textDir = isEnglish ? 'ltr' : 'rtl';
  const textAlign = isEnglish ? 'text-left' : 'text-right';

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Question Image (if exists) */}
      {showImage && imageSrc && (
        <div className="rounded-2xl overflow-hidden mb-4 bg-sand/20 dark:bg-coffee-dark border border-sand dark:border-coffee-light transition-colors duration-300">
          <img
            src={imageSrc}
            alt="Question visual"
            className="w-full max-h-64 object-contain mx-auto"
          />
        </div>
      )}

      {/* Question Text */}
      <h2 className={`text-2xl md:text-3xl font-extrabold text-coffee dark:text-cream leading-relaxed transition-colors duration-300 ${textAlign}`} dir={textDir}>
        {question.questionText}
      </h2>

      {/* Options Grid */}
      <div className="grid gap-4 mt-auto">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`group w-full p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${textAlign} ${
                isSelected
                  ? 'bg-clay dark:bg-gold border-clay dark:border-gold text-white dark:text-coffee-dark shadow-lg translate-x-[-4px]'
                  : 'bg-white dark:bg-coffee-dark border-sand dark:border-coffee-light text-coffee dark:text-sand hover:border-clay/50 dark:hover:border-gold/50 hover:bg-sand/10 dark:hover:bg-coffee-light'
              }`}
              dir={textDir}
            >
              <span className={`text-xl font-semibold ${isSelected ? 'text-white dark:text-coffee-dark' : 'text-coffee dark:text-sand'}`}>
                {option}
              </span>
              
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-colors ${
                  isSelected ? 'border-white dark:border-coffee-dark bg-white/20 dark:bg-coffee-dark/20' : 'border-olive/30 dark:border-sand/30 group-hover:border-clay dark:group-hover:border-gold'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-white dark:text-coffee-dark" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MCQQuestion;