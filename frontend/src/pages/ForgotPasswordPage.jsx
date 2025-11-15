import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/auth';

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
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="bg-light rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-secondary mb-2">
                إعادة تعيين كلمة المرور
              </h1>
              <p className="text-primary">
                {!codeSent
                  ? 'أدخل بريدك الإلكتروني لاستلام رمز التحقق'
                  : 'أدخل رمز التحقق وكلمة المرور الجديدة'}
              </p>
            </div>

            {/* Request Code Form or Reset Password Form */}
            {!codeSent ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-secondary font-semibold mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                    placeholder="example@email.com"
                    required
                    disabled={loading}
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {successMessage}
                  </div>
                )}

                {!successMessage && (
                  <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    تم إرسال رمز التحقق إلى بريدك الإلكتروني
                  </div>
                )}

                <div>
                  <label className="block text-secondary font-semibold mb-2">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                    placeholder="123456"
                    required
                    disabled={loading}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 hover:text-secondary transition-colors"
                      disabled={loading}
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-primary/70 mt-2">
                    يجب أن تحتوي على: 8 أحرف، حرف كبير، حرف صغير، رقم، رمز خاص
                  </p>
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 hover:text-secondary transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="w-full px-6 py-3 border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إعادة إرسال رمز التحقق
                </button>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-primary">
                تذكرت كلمة المرور؟{' '}
                <Link
                  to="/login"
                  className="text-secondary hover:text-accent hover:underline font-semibold transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>

            {/* Back Link */}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-secondary hover:text-accent hover:underline font-semibold transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
