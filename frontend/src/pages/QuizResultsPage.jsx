import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

// FALSE answer variants (mirrors backend logic)
const FALSE_VARIANTS = ['false', 'خطأ', 'حطا', 'خاطئ', 'خاطئة'];

function QuizResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Ref to prevent duplicate submissions (StrictMode-safe)
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!questions || !answers) {
      navigate('/quiz');
      return;
    }

    // Auto-submit if user is authenticated (only once)
    if (authService.isAuthenticated() && !hasSubmitted.current) {
      hasSubmitted.current = true; // Set immediately (synchronous)
      submitToBackend();
    }
  }, [questions, answers, navigate]);

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
      hasSubmitted.current = false; // Reset ref to allow retry on error
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
    } else if (question.type === 'true_false') {
      // TRUE/FALSE: Use same logic as backend
      let normalizedUser = String(userAnswer).trim();

      // Convert "False" to "خطأ" for Arabic questions (mirrors backend)
      if (question.contentLanguage === 'arabic' && normalizedUser.toLowerCase() === 'false') {
        normalizedUser = 'خطأ';
      }

      // Check if both have same "falseness" status
      const userInFalse = FALSE_VARIANTS.includes(normalizedUser.toLowerCase());
      const correctInFalse = FALSE_VARIANTS.includes(String(correctAnswer).trim().toLowerCase());
      isCorrect = userInFalse === correctInFalse;
    } else {
      // Other question types: case-insensitive comparison
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
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Score Card */}
          <div className="bg-light rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-center">
            <h1 className="text-4xl font-bold text-secondary mb-6">نتيجتك</h1>

            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#C2B09F"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#623F1F"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(percentage / 100) * 553} 553`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-secondary">
                  {percentage}%
                </span>
                <span className="text-primary mt-2">
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
                <p className="text-primary">جاري حفظ النتيجة...</p>
              ) : submitted ? (
                <p className="text-green-600 font-semibold">✓ تم حفظ النتيجة بنجاح</p>
              ) : submissionError ? (
                <p className="text-red-600">{submissionError}</p>
              ) : null
            ) : (
              <div className="bg-accent/30 border-2 border-accent rounded-lg p-4">
                <p className="text-primary font-semibold">
                  ⚠️ سجل دخولك لحفظ نتائجك ومتابعة تقدمك
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => navigate('/quiz')}
                className="px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-105 shadow-lg"
              >
                حاول مرة أخرى
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-secondary hover:text-light transition-all duration-300"
              >
                الصفحة الرئيسية
              </button>
            </div>
          </div>

          {/* Review Answers */}
          <div className="bg-light rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
              مراجعة الإجابات
            </h2>

            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.question.id}
                  className={`p-6 rounded-xl border-2 ${
                    result.isCorrect
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  {/* Question Number & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">
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
                  <p className="text-xl font-semibold text-secondary mb-4">
                    {result.question.questionText}
                  </p>

                  {/* User's Answer */}
                  <div className="mb-3">
                    <span className="font-bold text-primary">إجابتك: </span>
                    <span
                      className={
                        result.isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'
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
                      <span className="font-bold text-primary">
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
