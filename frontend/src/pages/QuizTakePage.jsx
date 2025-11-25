import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuestionRenderer from '../components/quiz/QuestionRenderer';
import { apiService } from '../services/api';

function QuizTakePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent multiple fetches (especially in React Strict Mode)
  const hasFetchedRef = useRef(false);
  const configRef = useRef(null);

  useEffect(() => {
    if (!config) {
      // No config, redirect to quiz setup
      navigate('/quiz');
      return;
    }

    // Check if config actually changed (allow re-fetch on new config)
    const configChanged = JSON.stringify(configRef.current) !== JSON.stringify(config);

    // Only fetch once per config
    if (!hasFetchedRef.current || configChanged) {
      hasFetchedRef.current = true;
      configRef.current = config;
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        size: config.size,
      };

      if (config.language) params.language = config.language;
      if (config.category) params.category = config.category;
      if (config.region) params.region = config.region;
      if (config.type && config.type !== 'all') params.type = config.type;

      const data = await apiService.getQuiz(params);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError(err.response?.data?.message || 'فشل في تحميل الأسئلة. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Navigate to results page with questions and answers
    navigate('/quiz/results', {
      state: {
        questions,
        answers,
      },
    });
  };

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '' &&
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-light rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-secondary mx-auto mb-6"></div>
              <p className="text-xl text-primary">جاري تحميل الأسئلة...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-light border-2 border-red-400 rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-6">❌</div>
              <h2 className="text-2xl font-bold text-red-900 mb-4">حدث خطأ</h2>
              <p className="text-lg text-red-700 mb-8">{error}</p>
              <button
                onClick={fetchQuestions}
                className="px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300 ml-4"
              >
                حاول مرة أخرى
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-secondary hover:text-light transition-all duration-300"
              >
                العودة للإعدادات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-light border-2 border-accent rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-6">🤔</div>
              <h2 className="text-2xl font-bold text-secondary mb-4">لا توجد أسئلة متاحة</h2>
              <p className="text-lg text-primary mb-8">
                لم نجد أسئلة تطابق اختيارك. جرب تغيير الفئة أو المنطقة.
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300"
              >
                العودة للإعدادات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-light">
                السؤال {currentQuestionIndex + 1} من {questions.length}
              </span>
              <span className="text-lg font-semibold text-light">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-accent rounded-full h-3 overflow-hidden">
              <div
                className="bg-secondary h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-light rounded-2xl shadow-xl p-8 md:p-12 mb-6">
            <QuestionRenderer
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onAnswerSelect={handleAnswerSelect}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="px-6 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-secondary hover:text-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← السابق
            </button>

            <div className="flex-1"></div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إنهاء الاختبار →'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي →
              </button>
            )}
          </div>

          {!hasAnswer && (
            <p className="text-center text-light mt-4 font-semibold bg-secondary/20 py-3 rounded-lg">
              ⚠️ الرجاء اختيار إجابة قبل المتابعة
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizTakePage;
