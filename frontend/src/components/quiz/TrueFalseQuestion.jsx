import { Check, X } from 'lucide-react';

function TrueFalseQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const isEnglish = question.contentLanguage?.toLowerCase() === 'english' ||
                    question.language?.toLowerCase() === 'english';

  const options = [
    { value: 'True', label: isEnglish ? 'True' : 'صح', icon: Check, color: 'green' },
    { value: 'False', label: isEnglish ? 'False' : 'خطأ', icon: X, color: 'red' },
  ];

  // Use image URL directly
  const imageSrc = question.imageUrl;
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

      {/* True/False Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          const Icon = option.icon;
          
          return (
            <button
              key={option.value}
              onClick={() => onAnswerSelect(option.value)}
              className={`py-10 px-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                isSelected
                  ? 'bg-clay dark:bg-gold border-clay dark:border-gold text-white dark:text-coffee-dark shadow-xl scale-105'
                  : 'bg-white dark:bg-coffee-dark border-sand dark:border-coffee-light text-coffee dark:text-sand hover:border-clay/50 dark:hover:border-gold/50 hover:bg-sand/10 dark:hover:bg-coffee-light'
              }`}
            >
              <div className={`p-4 rounded-full ${isSelected ? 'bg-white/20 dark:bg-coffee-dark/20' : 'bg-sand/30 dark:bg-clay/55'}`}>
                <Icon className={`w-12 h-12 ${isSelected ? 'text-white dark:text-coffee-dark' : option.color === 'green' ? 'text-saudi-green dark:text-green-400' : 'text-red-500 dark:text-red-400'}`} />
              </div>
              <span className="text-3xl font-bold">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TrueFalseQuestion;