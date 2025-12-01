import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

import Navbar from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authService } from '../services/auth';

// Validation Schemas
const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'البريد الإلكتروني أو اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

const confirmationSchema = z.object({
  code: z.string().min(1, 'رمز التحقق مطلوب'),
});

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Store username/password for auto-login after confirmation
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  // Forms
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { usernameOrEmail: '', password: '' }
  });

  const confirmationForm = useForm({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { code: '' }
  });

  // Handlers
  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      const result = await authService.login(data.usernameOrEmail, data.password);
      
      // Check if user needs confirmation
      if (result?.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setNeedsConfirmation(true);
        setCredentials({ username: data.usernameOrEmail, password: data.password });
        return;
      }

      // Sync user to MongoDB backend
      await authService.syncUser();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      const errorType = error.__type || error.name;
      
      if (errorType === 'UserNotConfirmedException') {
        setNeedsConfirmation(true);
        setCredentials({ username: data.usernameOrEmail, password: data.password });
        setServerError('');
      } else {
        setServerError(error.message || 'حدث خطأ في تسجيل الدخول. حاول مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmationSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      await authService.confirmSignUp(credentials.username, data.code);
      // Auto-login after confirmation
      await authService.login(credentials.username, credentials.password);
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
      await authService.resendConfirmationCode(credentials.username);
      setSuccessMessage('تم إرسال رمز التحقق الجديد إلى بريدك الإلكتروني');
    } catch (error) {
      console.error('Resend code error:', error);
      setServerError(error.message || 'حدث خطأ في إعادة إرسال الرمز.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-arabic relative overflow-hidden">
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sand/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-clay/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4 py-24 md:py-32 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 md:p-10 bg-white/80 backdrop-blur-sm border-sand/50">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-coffee mb-3">
                {needsConfirmation ? 'تأكيد الحساب' : 'تسجيل الدخول'}
              </h1>
              <p className="text-olive text-lg">
                {needsConfirmation 
                  ? 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني' 
                  : 'سجل دخولك للوصول إلى جميع المميزات'}
              </p>
            </div>

            {/* Alerts */}
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{serverError}</p>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{successMessage}</p>
              </motion.div>
            )}

            {/* Forms */}
            {!needsConfirmation ? (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <Input
                  label="البريد الإلكتروني أو اسم المستخدم"
                  placeholder="example@email.com أو اسم المستخدم"
                  dir="ltr"
                  error={loginForm.formState.errors.usernameOrEmail?.message}
                  {...loginForm.register('usernameOrEmail')}
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  label="كلمة المرور"
                  placeholder="••••••••"
                  dir="ltr"
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-olive/60 hover:text-clay transition-colors flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-clay hover:text-saudi-green font-semibold transition-colors"
                  >
                    هل نسيت كلمة المرور؟
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  تسجيل الدخول
                </Button>
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
                <p className="text-coffee">
                  ليس لديك حساب؟{' '}
                  <Link
                    to="/signup"
                    className="text-clay hover:text-saudi-green font-bold transition-colors"
                  >
                    إنشاء حساب جديد
                  </Link>
                </p>
                
                <div className="pt-4 border-t border-sand/50">
                  <Link
                    to="/"
                    className="text-olive hover:text-clay text-sm font-medium transition-colors"
                  >
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

export default LoginPage;
