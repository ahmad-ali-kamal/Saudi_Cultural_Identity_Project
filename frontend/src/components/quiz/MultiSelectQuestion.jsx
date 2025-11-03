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

  return (
    <div className="space-y-6">
      {/* Question Image (if exists) */}
      {showImage && question.imageUrl && (
        <div className="rounded-lg overflow-hidden shadow-lg mb-6">
          <img
            src={question.imageUrl}
            alt="Question visual"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Question Text */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {question.questionText}
      </h2>

      {/* Instruction */}
      <p className="text-gray-600 text-lg mb-6">
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
              className={`w-full p-5 text-right rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'bg-saudi-green/10 border-saudi-green shadow-md'
                  : 'bg-white border-gray-300 hover:border-saudi-green hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${isSelected ? 'text-saudi-green' : 'text-gray-800'}`}>
                  {option}
                </span>
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-saudi-green border-saudi-green'
                      : 'border-gray-400 bg-white'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-white"
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
