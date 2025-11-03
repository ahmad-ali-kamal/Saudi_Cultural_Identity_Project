function MCQQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = question.options || [];

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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
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
              className={`w-full p-5 text-right rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                isSelected
                  ? 'bg-saudi-green text-white border-saudi-green shadow-lg scale-102'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-saudi-green hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{option}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-white' : 'border-gray-400'
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
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
