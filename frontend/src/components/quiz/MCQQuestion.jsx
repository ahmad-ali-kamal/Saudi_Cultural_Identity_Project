function MCQQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = question.options || [];

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
      <h2 className={`text-2xl md:text-3xl font-bold text-primary mb-6 ${textAlign}`} dir={textDir}>
        {question.questionText}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`w-full p-5 ${textAlign} rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                isSelected
                  ? 'bg-secondary text-light border-secondary shadow-lg scale-102'
                  : 'bg-white text-primary border-accent hover:border-secondary hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between" dir={textDir}>
                <span className="text-lg font-semibold">{option}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-light' : 'border-accent'
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-light"></div>
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

export default MCQQuestion;
