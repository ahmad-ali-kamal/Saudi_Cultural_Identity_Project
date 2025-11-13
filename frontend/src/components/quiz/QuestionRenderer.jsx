import MCQQuestion from './MCQQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import MultiSelectQuestion from './MultiSelectQuestion';
import OpenEndedQuestion from './OpenEndedQuestion';

function QuestionRenderer({ question, selectedAnswer, onAnswerSelect }) {
  if (!question) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-xl">لا توجد أسئلة متاحة</p>
      </div>
    );
  }

  // Determine question type and render appropriate component
  const questionType = question.type?.toLowerCase() || 'mcq';

  // Handle different type variations
  if (questionType === 'mcq' || questionType === 'multiple choice') {
    return (
      <MCQQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={onAnswerSelect}
      />
    );
  }

  if (questionType === 'true/false' || questionType === 'true_false' || questionType === 'boolean') {
    return (
      <TrueFalseQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={onAnswerSelect}
      />
    );
  }

  if (questionType === 'multi-select' || questionType === 'multiple answer' || questionType === 'checkbox') {
    return (
      <MultiSelectQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={onAnswerSelect}
      />
    );
  }

  if (questionType === 'open-ended' || questionType === 'text' || questionType === 'essay') {
    return (
      <OpenEndedQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={onAnswerSelect}
      />
    );
  }

  // Default to MCQ if type is unrecognized
  return (
    <div>
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
        <p className="text-yellow-800">
          ⚠️ نوع السؤال غير معروف: <strong>{question.type}</strong> - سيتم عرضه كسؤال اختيار من متعدد
        </p>
      </div>
      <MCQQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={onAnswerSelect}
      />
    </div>
  );
}

export default QuestionRenderer;
