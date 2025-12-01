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

  // Decode base64 image if available
  const getImageSrc = () => {
    if (question.imageBase64 && question.imageMimeType) {
      return `data:${question.imageMimeType};base64,${question.imageBase64}`;
    }
    return question.imageUrl;
  };

  const imageSrc = getImageSrc();

  const isEnglish = question.contentLanguage?.toLowerCase() === 'english' ||
                    question.language?.toLowerCase() === 'english';
  const textDir = isEnglish ? 'ltr' : 'rtl';
  const textAlign = isEnglish ? 'text-left' : 'text-right';

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Question Image (if exists) */}
      {showImage && imageSrc && (
        <div className="rounded-2xl overflow-hidden mb-4 bg-sand/20 border border-sand">
          <img
            src={imageSrc}
            alt="Question visual"
            className="w-full max-h-64 object-contain mx-auto"
          />
        </div>
      )}

      {/* Question Text */}
      <div>
        <h2 className={`text-2xl md:text-3xl font-extrabold text-coffee leading-relaxed ${textAlign}`} dir={textDir}>
          {question.questionText}
        </h2>
        <p className={`text-olive mt-2 ${textAlign}`}>
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
                  ? 'bg-clay border-clay text-white shadow-lg translate-x-[-4px]'
                  : 'bg-white border-sand text-coffee hover:border-clay/50 hover:bg-sand/10'
              }`}
              dir={textDir}
            >
              <span className={`text-xl font-semibold ${isSelected ? 'text-white' : 'text-coffee'}`}>
                {option}
              </span>
              
              <div className="flex-shrink-0 ml-3">
                {isSelected ? (
                  <CheckSquare className="w-6 h-6 text-white" />
                ) : (
                  <Square className="w-6 h-6 text-olive/40 group-hover:text-clay" />
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