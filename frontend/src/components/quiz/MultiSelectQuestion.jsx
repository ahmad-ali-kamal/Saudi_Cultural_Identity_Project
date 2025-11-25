function MultiSelectQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = question.options || [];
  const selectedAnswers = selectedAnswer || [];

  const handleToggle = (option) => {
    if (selectedAnswers.includes(option)) {
      // Remove if already selected
      onAnswerSelect(selectedAnswers.filter((ans) => ans !== option));
    } else {
      // Add if not selected
      onAnswerSelect([...selectedAnswers, option]);
    }
  };

  // Decode base64 image if available
  const getImageSrc = () => {
    if (question.imageBase64 && question.imageMimeType) {
      return `data:${question.imageMimeType};base64,${question.imageBase64}`;
    }
    // Fallback to imageUrl for backward compatibility
    return question.imageUrl;
  };

  const imageSrc = getImageSrc();

  // Determine text direction based on language
  const isEnglish = question.contentLanguage?.toLowerCase() === 'english' ||
                    question.language?.toLowerCase() === 'english';
  const textDir = isEnglish ? 'ltr' : 'rtl';
  const textAlign = isEnglish ? 'text-left' : 'text-right';

  return (
    <div className="space-y-6">
      {/* Question Image (if exists) */}
      {showImage && imageSrc && (
        <div className="rounded-lg overflow-hidden shadow-lg mb-6 bg-gray-50">
          <img
            src={imageSrc}
            alt="Question visual"
            className="w-full max-h-96 object-contain"
          />
        </div>
      )}

      {/* Question Text */}
      <h2 className={`text-2xl md:text-3xl font-bold text-primary mb-4 ${textAlign}`} dir={textDir}>
        {question.questionText}
      </h2>

      {/* Instruction */}
      <p className={`text-primary/70 text-lg mb-6 ${textAlign}`}>
        اختر جميع الإجابات الصحيحة ({selectedAnswers.length} محددة)
      </p>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswers.includes(option);
          return (
            <button
              key={index}
              onClick={() => handleToggle(option)}
              className={`w-full p-5 ${textAlign} rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'bg-secondary/10 border-secondary shadow-md'
                  : 'bg-white border-accent hover:border-secondary hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between" dir={textDir}>
                <span className={`text-lg font-semibold ${isSelected ? 'text-secondary' : 'text-primary'}`}>
                  {option}
                </span>
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-secondary border-secondary'
                      : 'border-accent bg-white'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-light"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MultiSelectQuestion;
