function TrueFalseQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = [
    { value: 'True', label: 'صح ✓', color: 'green' },
    { value: 'False', label: 'خطأ ✗', color: 'red' },
  ];

  // Decode base64 image if available
  const getImageSrc = () => {
    if (question.imageBase64 && question.imageMimeType) {
      return `data:${question.imageMimeType};base64,${question.imageBase64}`;
    }
    // Fallback to imageUrl for backward compatibility
    return question.imageUrl;
  };

  const imageSrc = getImageSrc();

  return (
    <div className="space-y-6">
      {/* Question Image (if exists) */}
      {showImage && imageSrc && (
        <div className="rounded-lg overflow-hidden mb-6 bg-light-50">
          <img
            src={imageSrc}
            alt="Question visual"
            className="w-full max-h-96 object-contain"
          />
        </div>
      )}

      {/* Question Text */}
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
        {question.questionText}
      </h2>

      {/* True/False Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswerSelect(option.value)}
              className={`p-8 rounded-2xl border-3 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? option.color === 'green'
                    ? 'bg-secondary text-primary border border-primary shadow-2xl scale-105'
                    : 'bg-secondary text-primary border border-primary shadow-2xl scale-105'
                  : 'bg-first text-primary border border-accent hover:shadow-lg'
              }`}
            >
              <div className="text-3xl font-bold">{option.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TrueFalseQuestion;
