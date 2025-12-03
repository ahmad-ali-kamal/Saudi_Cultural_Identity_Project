import { PenTool } from 'lucide-react';

function OpenEndedQuestion({ question, selectedAnswer, onAnswerSelect, showImage = true }) {
  const answer = selectedAnswer || '';

  // Use image URL directly
  const imageSrc = question.imageUrl;

  const isEnglish = question.contentLanguage?.toLowerCase() === 'english' ||
                    question.language?.toLowerCase() === 'english';
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

      {/* Text Input Area */}
      <div className="mt-auto">
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => onAnswerSelect(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
            className="w-full p-6 border-2 border-sand dark:border-coffee-light rounded-2xl focus:border-clay dark:focus:border-gold focus:ring-4 focus:ring-clay/10 dark:focus:ring-gold/10 focus:outline-none transition-all text-lg min-h-[200px] resize-none text-coffee dark:text-cream bg-white dark:bg-coffee-dark placeholder:text-olive/40 dark:placeholder:text-sand/30"
            dir="auto"
          />
          <div className="absolute top-4 left-4 text-olive/30 dark:text-sand/30 pointer-events-none transition-colors duration-300">
            <PenTool className="w-6 h-6" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-sm font-medium">
          <span className="text-olive dark:text-sand/60 transition-colors duration-300">{answer.length} حرف</span>
          {answer.length === 0 && (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 transition-colors duration-300">
              ⚠️ الرجاء كتابة إجابة
            </span>
          )}
        </div>

        <div className="bg-sand/20 dark:bg-coffee-light border-r-4 border-clay dark:border-gold p-4 rounded-lg mt-6 transition-colors duration-300">
          <p className="text-coffee dark:text-sand text-sm">
            💡 اكتب إجابتك بشكل واضح. سيتم مقارنتها بالإجابة الصحيحة تلقائياً.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OpenEndedQuestion;