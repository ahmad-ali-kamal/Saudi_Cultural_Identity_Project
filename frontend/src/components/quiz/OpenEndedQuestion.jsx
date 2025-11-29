function OpenEndedQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const answer = selectedAnswer || '';

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
        <div className="rounded-lg overflow-hidden mb-6 bg-light-50">
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

      {/* Text Input */}
      <div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerSelect(e.target.value)}
          placeholder="اكتب إجابتك هنا..."
          className="w-full p-5 border-2 border-primary rounded-xl focus:border-secondary focus:outline-none transition-colors text-lg min-h-[150px] resize-none text-first"
          dir="auto"
        />
        <div className="flex justify-between items-center mt-2 text-sm text-primary/60">
          <span>{answer.length} حرف</span>
          {answer.length === 0 && (
            <span className="text-amber-600">⚠️ الرجاء كتابة إجابة</span>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <div className="bg-light/30 border-r-4 border-secondary p-4 rounded-lg">
        <p className="text-primary">
          💡 اكتب إجابتك بشكل واضح. سيتم مقارنتها بالإجابة الصحيحة.
        </p>
      </div>
    </div>
  );
}

export default OpenEndedQuestion;
