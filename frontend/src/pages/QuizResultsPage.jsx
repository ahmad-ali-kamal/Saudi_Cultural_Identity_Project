import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

function QuizResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (!questions || !answers) {
      navigate('/quiz');
      return;
    }

    // Auto-submit if user is authenticated
    if (authService.isAuthenticated() && !submitted && !submitting) {
      submitToBackend();
    }
  }, [questions, answers, navigate, submitted, submitting]);

  const submitToBackend = async () => {
    try {
      setSubmitting(true);
      setSubmissionError(null);

      // Convert answers to backend format
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId,
        userAnswer: Array.isArray(answers[questionId])
          ? answers[questionId].join(', ')
          : String(answers[questionId]),
      }));

      await apiService.submitQuiz(formattedAnswers);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setSubmissionError(err.response?.data?.message || 'فشل في حفظ النتيجة');
    } finally {
      setSubmitting(false);
    }
  };

  if (!questions || !answers) {
    return null;
  }

  // Calculate score
  const results = questions.map((question) => {
    const userAnswer = answers[question.id];
    const correctAnswer = question.answer;

    let isCorrect = false;

    // Handle different answer types
    if (Array.isArray(userAnswer)) {
      // Multi-select: compare arrays
      const sortedUser = [...userAnswer].sort().join(',');
      const sortedCorrect = Array.isArray(correctAnswer)
        ? [...correctAnswer].sort().join(',')
        : correctAnswer;
      isCorrect = sortedUser === sortedCorrect;
    } else {
      // Single answer: case-insensitive comparison
      isCorrect =
        String(userAnswer).trim().toLowerCase() ===
        String(correctAnswer).trim().toLowerCase();
    }

    return {
      question,
      userAnswer,
      correctAnswer,
      isCorrect,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Determine performance message
  let performanceMessage = '';
  let performanceColor = '';
  if (percentage >= 90) {
    performanceMessage = '🎉 ممتاز! أداء رائع!';
    performanceColor = 'text-green-600';
  } else if (percentage >= 70) {
    performanceMessage = '👍 جيد جداً! استمر!';
    performanceColor = 'text-blue-600';
  } else if (percentage >= 50) {
    performanceMessage = '😊 جيد! يمكنك التحسن';
    performanceColor = 'text-yellow-600';
  } else {
    performanceMessage = '💪 حاول مرة أخرى!';
    performanceColor = 'text-orange-600';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">نتيجتك</h1>

            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#028b1b"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(percentage / 100) * 553} 553`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-saudi-green">
                  {percentage}%
                </span>
                <span className="text-gray-600 mt-2">
                  {score} من {totalQuestions}
                </span>
              </div>
            </div>

            {/* Performance Message */}
            <h2 className={`text-3xl font-bold mb-6 ${performanceColor}`}>
              {performanceMessage}
            </h2>

            {/* Submission Status */}
            {authService.isAuthenticated() ? (
              submitting ? (
                <p className="text-gray-600">جاري حفظ النتيجة...</p>
              ) : submitted ? (
                <p className="text-green-600 font-semibold">✓ تم حفظ النتيجة بنجاح</p>
              ) : submissionError ? (
                <p className="text-red-600">{submissionError}</p>
              ) : null
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="text-yellow-800">
                  ⚠️ سجل دخولك لحفظ نتائجك ومتابعة تقدمك
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => navigate('/quiz')}
                className="px-8 py-3 bg-saudi-green text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                حاول مرة أخرى
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                الصفحة الرئيسية
              </button>
            </div>
          </div>

          {/* Review Answers */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              مراجعة الإجابات
            </h2>

            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.question.id}
                  className={`p-6 rounded-xl border-2 ${
                    result.isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  {/* Question Number & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-700">
                      السؤال {index + 1}
                    </span>
                    <span
                      className={`text-2xl ${
                        result.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {result.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-xl font-semibold text-gray-900 mb-4">
                    {result.question.questionText}
                  </p>

                  {/* User's Answer */}
                  <div className="mb-3">
                    <span className="font-bold text-gray-700">إجابتك: </span>
                    <span
                      className={
                        result.isCorrect ? 'text-green-700' : 'text-red-700'
                      }
                    >
                      {Array.isArray(result.userAnswer)
                        ? result.userAnswer.join(', ')
                        : result.userAnswer || 'لم تجب'}
                    </span>
                  </div>

                  {/* Correct Answer (if wrong) */}
                  {!result.isCorrect && (
                    <div>
                      <span className="font-bold text-gray-700">
                        الإجابة الصحيحة:{' '}
                      </span>
                      <span className="text-green-700 font-semibold">
                        {Array.isArray(result.correctAnswer)
                          ? result.correctAnswer.join(', ')
                          : result.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default QuizResultsPage;
