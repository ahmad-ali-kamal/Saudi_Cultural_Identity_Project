function TrueFalseQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const options = [
    { value: 'True', label: 'صح ✓', color: 'green' },
    { value: 'False', label: 'خطأ ✗', color: 'red' },
  ];

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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
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
                    ? 'bg-green-600 text-white border-green-600 shadow-2xl scale-105'
                    : 'bg-red-600 text-white border-red-600 shadow-2xl scale-105'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:shadow-lg'
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
