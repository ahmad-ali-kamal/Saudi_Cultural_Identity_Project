import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

import Navbar from '../components/Navbar';
import QuestionRenderer from '../components/quiz/QuestionRenderer';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  const hasFetchedRef = useRef(false);
  const configRef = useRef(null);

  useEffect(() => {
    if (!config) {
      navigate('/quiz');
      return;
    }

    const configChanged = JSON.stringify(configRef.current) !== JSON.stringify(config);

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
      setDirection(1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
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

  // Framer Motion Variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-clay dark:border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-coffee dark:text-sand font-bold text-lg">جاري تحضير الاختبار...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <Card className="max-w-lg mx-auto p-10 dark:bg-clay/55 dark:border-coffee-dark">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-coffee dark:text-cream mb-2">
              {error ? 'حدث خطأ' : 'لا توجد أسئلة متاحة'}
            </h2>
            <p className="text-olive dark:text-sand/70 mb-6">
              {error || 'لم نجد أسئلة تطابق اختيارك. جرب تغيير الفئة أو المنطقة.'}
            </p>
            <div className="flex gap-4 justify-center">
              {error && <Button onClick={fetchQuestions} variant="outline">حاول مرة أخرى</Button>}
              <Button onClick={() => navigate('/quiz')}>العودة للإعدادات</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic overflow-hidden flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Progress Bar (Fixed Top) */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-white dark:bg-clay/35 border-b border-sand dark:border-coffee-dark transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-sm font-bold text-coffee dark:text-cream">
             سؤال <span className="text-clay dark:text-gold text-lg">{currentQuestionIndex + 1}</span> من {questions.length}
          </span>
          <div className="flex-1 mx-6 h-2 bg-sand dark:bg-coffee-dark rounded-full overflow-hidden transition-colors duration-300">
            <motion.div 
              className="h-full bg-saudi-green"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm font-bold text-olive dark:text-sand">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="flex-grow container mx-auto px-4 py-32 md:py-40 flex flex-col justify-center max-w-4xl">
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="p-6 md:p-10 shadow-xl border-sand dark:border-coffee-dark min-h-[400px] flex flex-col transition-colors duration-300">
              <QuestionRenderer
                question={currentQuestion}
                selectedAnswer={currentAnswer}
                onAnswerSelect={handleAnswerSelect}
              />
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-clay/55 border-t border-sand dark:border-coffee-dark p-4 z-40 transition-colors duration-300">
        <div className="container mx-auto max-w-4xl flex justify-between items-center gap-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="text-olive dark:text-sand hover:text-coffee dark:hover:text-cream"
          >
            <ArrowLeft className="w-5 h-5 ml-2 rtl:rotate-180" /> السابق
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !hasAnswer}
              size="lg"
              className="px-8"
              variant="secondary"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إنهاء الاختبار'}
              <CheckCircle2 className="w-5 h-5 mr-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
              size="lg"
              className="px-8"
            >
              التالي
              <ArrowRight className="w-5 h-5 mr-2 rtl:rotate-180" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizTakePage;