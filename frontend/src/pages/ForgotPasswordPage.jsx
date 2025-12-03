import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { authService } from '../services/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password requirements
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل';
    }
    if (!/[A-Z]/.test(password)) {
      return 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
    }
    if (!/[a-z]/.test(password)) {
      return 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل';
    }
    if (!/[0-9]/.test(password)) {
      return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل';
    }
    return null;
  };

  // Step 1: Request reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate email
    if (!isValidEmail(email)) {
      setError('البريد الإلكتروني غير صحيح');
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email);
      setCodeSent(true);
      setSuccessMessage('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
    } catch (error) {
      console.error('Send code error:', error);
      setError(error.message || 'حدث خطأ في إرسال رمز التحقق. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm reset with code and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    // Validate password requirements
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      await authService.confirmResetPassword(email, code, newPassword);
      setSuccessMessage('تم إعادة تعيين كلمة المرور بنجاح! جاري التوجيه إلى صفحة تسجيل الدخول...');

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة'
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'حدث خطأ في إعادة تعيين كلمة المرور. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.resetPassword(email);
      setSuccessMessage('تم إرسال رمز التحقق الجديد إلى بريدك الإلكتروني');
    } catch (error) {
      console.error('Resend code error:', error);
      setError(error.message || 'حدث خطأ في إعادة إرسال الرمز.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic relative overflow-hidden transition-colors duration-300">
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sand/30 dark:bg-coffee-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-clay/10 dark:bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10 transition-colors duration-300" />

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
                إعادة تعيين كلمة المرور
              </h1>
              <p className="text-olive dark:text-sand/60 text-lg transition-colors duration-300">
                {!codeSent
                  ? 'أدخل بريدك الإلكتروني لاستلام رمز التحقق'
                  : 'أدخل رمز التحقق وكلمة المرور الجديدة'}
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 transition-colors duration-300"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
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

            {/* Request Code Form or Reset Password Form */}
            {!codeSent ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  disabled={loading}
                  dir="ltr"
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={loading}
                >
                  إرسال رمز التحقق
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <Input
                  label="رمز التحقق"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  disabled={loading}
                  dir="ltr"
                />

                <Input
                  label="كلمة المرور الجديدة"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  dir="ltr"
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-olive/60 dark:text-sand/60 hover:text-clay dark:hover:text-gold transition-colors flex items-center justify-center"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
                <p className="text-sm text-olive/70 dark:text-sand/50 mt-[-15px] mb-2">
                  يجب أن تحتوي على: 8 أحرف، حرف كبير، حرف صغير، رقم، رمز خاص
                </p>

                <Input
                  label="تأكيد كلمة المرور"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  dir="ltr"
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={loading}
                >
                  إعادة تعيين كلمة المرور
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  إعادة إرسال رمز التحقق
                </Button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-coffee dark:text-sand transition-colors duration-300">
                تذكرت كلمة المرور؟{' '}
                <Link
                  to="/login"
                  className="text-clay dark:text-gold hover:text-saudi-green dark:hover:text-cream font-bold transition-colors duration-300"
                >
                  تسجيل الدخول
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
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;