import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

import Navbar from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authService } from '../services/auth';

// Validation Schemas
const signupSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
    .regex(/^[a-zA-Z0-9_]+$/, 'يجب أن يحتوي اسم المستخدم على أحرف وأرقام فقط (بدون مسافات)'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير')
    .regex(/[a-z]/, 'يجب أن تحتوي كلمة المرور على حرف صغير')
    .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم')
    .regex(/[@$!%*?&#^()]/, 'يجب أن تحتوي كلمة المرور على رمز خاص (@$!%*?&#^())'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

const confirmationSchema = z.object({
  code: z.string().min(1, 'رمز التحقق مطلوب'),
});

function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmedUsername, setConfirmedUsername] = useState('');
  const [passwordForLogin, setPasswordForLogin] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  });

  const confirmationForm = useForm({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { code: '' }
  });

  // Handlers
  const onSignupSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      const result = await authService.signup(data.email, data.password, data.username);
      // Store data for confirmation step
      setConfirmedUsername(result.username);
      setPasswordForLogin(data.password);
      setNeedsConfirmation(true);
    } catch (error) {
      console.error('Signup error:', error);
      setServerError(error.message || 'حدث خطأ في إنشاء الحساب. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmationSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      await authService.confirmSignUp(confirmedUsername, data.code);
      // Auto-login after confirmation
      await authService.login(confirmedUsername, passwordForLogin);
      // Sync user to MongoDB backend
      await authService.syncUser();
      navigate('/');
    } catch (error) {
      console.error('Confirmation error:', error);
      setServerError(error.message || 'رمز التحقق غير صحيح. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      await authService.resendConfirmationCode(confirmedUsername);
      setSuccessMessage('تم إرسال رمز التحقق الجديد إلى بريدك الإلكتروني');
    } catch (error) {
      console.error('Resend code error:', error);
      setServerError(error.message || 'حدث خطأ في إعادة إرسال الرمز.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic relative overflow-hidden transition-colors duration-300">
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sand/30 dark:bg-coffee-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-saudi-green/5 dark:bg-saudi-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10 transition-colors duration-300" />

      <div className="container mx-auto px-4 py-24 md:py-32 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 md:p-10 bg-white/80 dark:bg-coffee-light/80 backdrop-blur-sm border-sand/50 dark:border-coffee-dark transition-colors duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-coffee dark:text-cream mb-3 transition-colors duration-300">
                {needsConfirmation ? 'تأكيد الحساب' : 'إنشاء حساب جديد'}
              </h1>
              <p className="text-olive dark:text-sand/60 text-lg transition-colors duration-300">
                {needsConfirmation 
                  ? 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني' 
                  : 'انضم إلينا لحفظ نتائجك ومتابعة تقدمك'}
              </p>
            </div>

            {/* Alerts */}
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 transition-colors duration-300"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{serverError}</p>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400 transition-colors duration-300"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{successMessage}</p>
              </motion.div>
            )}

            {/* Forms */}
            {!needsConfirmation ? (
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
                <Input
                  label="اسم المستخدم"
                  placeholder="مثال: ahmed_123"
                  dir="ltr"
                  error={signupForm.formState.errors.username?.message}
                  {...signupForm.register('username')}
                />
                
                <Input
                  label="البريد الإلكتروني"
                  placeholder="example@email.com"
                  dir="ltr"
                  error={signupForm.formState.errors.email?.message}
                  {...signupForm.register('email')}
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  label="كلمة المرور"
                  placeholder="••••••••"
                  dir="ltr"
                  error={signupForm.formState.errors.password?.message}
                  {...signupForm.register('password')}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-olive/60 dark:text-sand/60 hover:text-clay dark:hover:text-gold transition-colors flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="تأكيد كلمة المرور"
                  placeholder="••••••••"
                  dir="ltr"
                  error={signupForm.formState.errors.confirmPassword?.message}
                  {...signupForm.register('confirmPassword')}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-olive/60 dark:text-sand/60 hover:text-clay dark:hover:text-gold transition-colors flex items-center justify-center"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    إنشاء حساب
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={confirmationForm.handleSubmit(onConfirmationSubmit)} className="space-y-6">
                <Input
                  label="رمز التحقق"
                  placeholder="123456"
                  dir="ltr"
                  error={confirmationForm.formState.errors.code?.message}
                  {...confirmationForm.register('code')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  تأكيد الحساب
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  إعادة إرسال رمز التحقق
                </Button>
              </form>
            )}

            {/* Footer Links */}
            {!needsConfirmation && (
              <div className="mt-8 text-center space-y-4">
                <p className="text-coffee dark:text-sand transition-colors duration-300">
                  لديك حساب بالفعل؟{' '}
                  <Link
                    to="/login"
                    className="text-clay dark:text-gold hover:text-saudi-green dark:hover:text-cream font-bold transition-colors duration-300"
                  >
                    سجل دخول
                  </Link>
                </p>
                
                <div className="pt-4 border-t border-sand/50 dark:border-coffee-dark transition-colors duration-300">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-olive dark:text-sand/60 hover:text-clay dark:hover:text-gold text-sm font-medium transition-colors duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                    العودة للصفحة الرئيسية
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;
