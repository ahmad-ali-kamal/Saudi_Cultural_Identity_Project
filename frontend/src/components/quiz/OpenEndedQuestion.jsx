function OpenEndedQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const answer = selectedAnswer || '';

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

      {/* Text Input */}
      <div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerSelect(e.target.value)}
          placeholder="اكتب إجابتك هنا..."
          className="w-full p-5 border-2 border-gray-300 rounded-xl focus:border-saudi-green focus:outline-none transition-colors text-lg min-h-[150px] resize-none"
          dir="auto"
        />
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>{answer.length} حرف</span>
          {answer.length === 0 && (
            <span className="text-amber-600">⚠️ الرجاء كتابة إجابة</span>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 border-r-4 border-saudi-green p-4 rounded-lg">
        <p className="text-gray-700">
          💡 اكتب إجابتك بشكل واضح. سيتم مقارنتها بالإجابة الصحيحة.
        </p>
      </div>
    </div>
  );
}

export default OpenEndedQuestion;
