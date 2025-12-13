import { CheckSquare, Square } from 'lucide-react';

function MultiSelectQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = question.options || [];
  const selectedAnswers = selectedAnswer || [];

  const handleToggle = (option) => {
    if (selectedAnswers.includes(option)) {
      onAnswerSelect(selectedAnswers.filter((ans) => ans !== option));
    } else {
      onAnswerSelect([...selectedAnswers, option]);
    }
  };

  // Use image URL directly
  const imageSrc = question.imageUrl;

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
      <div>
        <h2 className={`text-2xl md:text-3xl font-extrabold text-coffee dark:text-cream leading-relaxed transition-colors duration-300 ${textAlign}`} dir={textDir}>
          {question.questionText}
        </h2>
        <p className={`text-olive dark:text-sand/60 mt-2 transition-colors duration-300 ${textAlign}`}>
          اختر جميع الإجابات الصحيحة ({selectedAnswers.length} محددة)
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid gap-4 mt-auto">
        {options.map((option, index) => {
          const isSelected = selectedAnswers.includes(option);
          return (
            <button
              key={index}
              onClick={() => handleToggle(option)}
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
              
              <div className="flex-shrink-0 ml-3">
                {isSelected ? (
                  <CheckSquare className="w-6 h-6 text-white dark:text-coffee-dark" />
                ) : (
                  <Square className="w-6 h-6 text-olive/40 dark:text-sand/40 group-hover:text-clay dark:group-hover:text-gold" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MultiSelectQuestion;