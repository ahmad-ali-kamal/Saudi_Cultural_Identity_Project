import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Home, RotateCcw, Save } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// FALSE answer variants (mirrors backend logic)
const FALSE_VARIANTS = ['false', 'خطأ', 'حطا', 'خاطئ', 'خاطئة'];

function QuizResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!questions || !answers) {
      navigate('/quiz');
      return;
    }

    const checkAuthAndSubmit = async () => {
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth && !hasSubmitted.current) {
        hasSubmitted.current = true;
        submitToBackend();
      }
    };

    checkAuthAndSubmit();
  }, [questions, answers, navigate]);

  const submitToBackend = async () => {
    try {
      setSubmitting(true);
      setSubmissionError(null);

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
      hasSubmitted.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  if (!questions || !answers) {
    return null;
  }

  // Calculate score logic (preserved)
  const results = questions.map((question) => {
    const userAnswer = answers[question.id];
    const correctAnswer = question.answer;
    let isCorrect = false;

    if (Array.isArray(userAnswer)) {
      const normalizeArray = (arr) => arr.map(item => String(item).trim().toLowerCase()).sort();
      const userNormalized = normalizeArray(userAnswer);
      const correctNormalized = Array.isArray(correctAnswer)
        ? normalizeArray(correctAnswer)
        : correctAnswer.split(',').map(item => item.trim().toLowerCase()).sort();

      isCorrect = JSON.stringify(userNormalized) === JSON.stringify(correctNormalized);
    } else if (question.type === 'true_false') {
      let normalizedUser = String(userAnswer).trim();
      if (question.contentLanguage === 'arabic' && normalizedUser.toLowerCase() === 'false') {
        normalizedUser = 'خطأ';
      }
      const userInFalse = FALSE_VARIANTS.includes(normalizedUser.toLowerCase());
      const correctInFalse = FALSE_VARIANTS.includes(String(correctAnswer).trim().toLowerCase());
      isCorrect = userInFalse === correctInFalse;
    } else if (question.type === 'open_ended') {
      const userLower = String(userAnswer).trim().toLowerCase();
      const correctLower = String(correctAnswer).trim().toLowerCase();
      isCorrect = correctLower === userLower || correctLower.includes(userLower);
    } else {
      isCorrect = String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
    }

    return { question, userAnswer, correctAnswer, isCorrect };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  let performanceMessage = '';
  let performanceColor = '';
  if (percentage >= 90) {
    performanceMessage = 'ممتاز! أداء رائع!';
    performanceColor = 'text-saudi-green';
  } else if (percentage >= 70) {
    performanceMessage = 'جيد جداً! استمر!';
    performanceColor = 'text-clay';
  } else if (percentage >= 50) {
    performanceMessage = 'جيد! يمكنك التحسن';
    performanceColor = 'text-olive';
  } else {
    performanceMessage = 'حاول مرة أخرى!';
    performanceColor = 'text-red-600';
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Score Card */}
          <Card className="p-8 md:p-12 text-center relative overflow-hidden dark:bg-coffee-light dark:border-coffee-dark">
             {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sand/30 dark:bg-sand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

            <h1 className="text-3xl md:text-4xl font-bold text-coffee dark:text-cream mb-8">نتيجة الاختبار</h1>

            {/* Score Circle */}
            <div className="relative w-56 h-56 mx-auto mb-8">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  className="stroke-sand dark:stroke-coffee-dark transition-colors duration-300"
                  strokeWidth="16"
                  fill="none"
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke={percentage >= 70 ? '#1D2F1F' : percentage >= 50 ? '#D4AF37' : '#855D38'}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray="628"
                  strokeDashoffset="628"
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 - (percentage / 100) * 628 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-extrabold text-coffee dark:text-cream transition-colors duration-300">
                  {percentage}%
                </span>
                <span className="text-olive dark:text-sand/70 font-medium mt-2 transition-colors duration-300">
                  {score} من {totalQuestions}
                </span>
              </div>
            </div>

            {/* Performance Message */}
            <h2 className={`text-3xl font-bold mb-6 ${performanceColor}`}>
              {performanceMessage}
            </h2>

            {/* Submission Status */}
            {isAuthenticated ? (
              submitting ? (
                <div className="flex items-center justify-center gap-2 text-olive dark:text-sand mb-6">
                  <div className="w-4 h-4 border-2 border-olive dark:border-sand border-t-transparent rounded-full animate-spin"></div>
                  جاري حفظ النتيجة...
                </div>
              ) : submitted ? (
                <div className="flex items-center justify-center gap-2 text-saudi-green dark:text-green-400 font-bold mb-6 bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-lg inline-flex">
                  <CheckCircle className="w-5 h-5" />
                  تم حفظ النتيجة بنجاح
                </div>
              ) : submissionError ? (
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-6 bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-lg inline-flex">
                  <AlertTriangle className="w-5 h-5" />
                  {submissionError}
                </div>
              ) : null
            ) : (
              <div className="bg-sand/30 dark:bg-coffee-dark/50 border border-sand dark:border-coffee-dark rounded-xl p-4 mb-8 inline-block">
                <p className="text-coffee dark:text-sand font-semibold flex items-center gap-2">
                  <Save className="w-5 h-5 text-clay dark:text-gold" />
                  سجل دخولك لحفظ نتائجك ومتابعة تقدمك
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate('/quiz')}
                variant="primary"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                حاول مرة أخرى
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
              >
                <Home className="w-5 h-5 ml-2" />
                الصفحة الرئيسية
              </Button>
            </div>
          </Card>

          {/* Review Answers */}
          <Card className="p-8 md:p-12 dark:bg-coffee-light dark:border-coffee-dark">
            <h2 className="text-2xl font-bold text-coffee dark:text-cream mb-8 text-center border-b border-sand dark:border-coffee-dark pb-4 transition-colors duration-300">
              مراجعة الإجابات
            </h2>

            <div className="space-y-6">
              {results.map((result, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={result.question.id}
                  className={`p-6 rounded-2xl border-2 transition-colors duration-300 ${
                    result.isCorrect
                      ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-olive dark:text-sand/80 bg-white dark:bg-coffee-dark px-3 py-1 rounded-full border border-sand dark:border-coffee-dark transition-colors duration-300">
                      السؤال {index + 1}
                    </span>
                    {result.isCorrect ? (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                        <CheckCircle className="w-6 h-6" />
                        <span>صحيح</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                        <XCircle className="w-6 h-6" />
                        <span>خاطئ</span>
                      </div>
                    )}
                  </div>

                  {/* Question Text */}
                  <p className="text-lg md:text-xl font-bold text-coffee dark:text-cream mb-6 leading-relaxed transition-colors duration-300">
                    {result.question.questionText}
                  </p>

                  {/* Answers Comparison */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-coffee-dark p-4 rounded-xl border border-sand/50 dark:border-coffee-light transition-colors duration-300">
                      <span className="text-xs font-bold text-olive dark:text-sand/60 uppercase tracking-wider mb-1 block">إجابتك</span>
                      <p className={`font-bold text-lg ${result.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                         {Array.isArray(result.userAnswer)
                          ? result.userAnswer.join(', ')
                          : result.userAnswer || 'لم تجب'}
                      </p>
                    </div>

                    {!result.isCorrect && (
                      <div className="bg-white dark:bg-coffee-dark p-4 rounded-xl border border-sand/50 dark:border-coffee-light transition-colors duration-300">
                        <span className="text-xs font-bold text-olive dark:text-sand/60 uppercase tracking-wider mb-1 block">الإجابة الصحيحة</span>
                        <p className="font-bold text-lg text-green-700 dark:text-green-400">
                          {Array.isArray(result.correctAnswer)
                            ? result.correctAnswer.join(', ')
                            : result.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default QuizResultsPage;