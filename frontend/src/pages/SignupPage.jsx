import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomeButton from '../components/HomeButton';
import { authService } from '../services/auth';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmedUsername, setConfirmedUsername] = useState(''); // Store the username for confirmation
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    // Client-side password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()])[A-Za-z\d@$!%*?&#^()]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('كلمة المرور يجب أن تحتوي على: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص (@$!%*?&#^())');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('البريد الإلكتروني غير صحيح');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.signup(formData.email, formData.password, formData.username);
      // Store the username for use in confirmation
      setConfirmedUsername(result.username);
      setNeedsConfirmation(true);
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'حدث خطأ في إنشاء الحساب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Use the username for confirmation
      await authService.confirmSignUp(confirmedUsername, confirmationCode);
      // Auto-login after confirmation (can use username or email)
      await authService.login(confirmedUsername, formData.password);
      // Sync user to MongoDB backend
      await authService.syncUser();
      navigate('/');
    } catch (error) {
      console.error('Confirmation error:', error);
      setError(error.message || 'رمز التحقق غير صحيح. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.resendConfirmationCode(confirmedUsername);
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
              <h1 className="text-4xl font-bold text-primary mb-2">
                إنشاء حساب جديد
              </h1>
              <p className="text-primary">
                انضم إلينا لحفظ نتائجك ومتابعة تقدمك
              </p>
            </div>

            {/* Signup Form or Confirmation Form */}
            {!needsConfirmation ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-primary font-semibold mb-2">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="placeholder-secondary w-full px-4 py-3 border-2 border-primary rounded-lg focus:border-secondary focus:outline-none transition-colors bg-primary"
                    placeholder="مثال: ahmed_123"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-primary/60 mt-1">
                    يمكنك استخدام هذا الاسم لتسجيل الدخول (يجب ألا يكون بريد إلكتروني)
                  </p>
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className=" placeholder-secondary w-full px-4 py-3 border-2 border-primary rounded-lg focus:border-secondary focus:outline-none transition-colors bg-primary"
                    placeholder="example@email.com"
                    required
                    disabled={loading}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="placeholder-secondary w-full px-4 py-3 pr-12 border-2 border-primary rounded-lg focus:border-secondary focus:outline-none transition-colors bg-primary"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 hover:text-secondary transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
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
                  <p className="text-xs text-primary/60 mt-1">
                    يجب أن تحتوي على: 8 أحرف، حرف كبير (A-Z)، حرف صغير (a-z)، رقم (0-9)، رمز خاص (@$!%*?&#)
                  </p>
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="placeholder-secondary w-full px-4 py-3 pr-12 border-2 border-primary rounded-lg focus:border-secondary focus:outline-none transition-colors bg-primary"
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
                  className="w-full px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-secondary hover:text-primary border-primary border-2 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmation} className="space-y-6">
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
                  <label className="block text-primary font-semibold mb-2">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                    placeholder="123456"
                    required
                    disabled={loading}
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-first text-primary font-bold rounded-lg  transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'جاري التحقق...' : 'تأكيد الحساب'}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="w-full px-6 py-3 border-2 border-first text-primary font-semibold rounded-lg hover:bg-secondary hover:text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إعادة إرسال رمز التحقق
                </button>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-primary">
                لديك حساب بالفعل؟{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-white hover:underline font-semibold transition-colors"
                >
                  سجل دخول
                </Link>
              </p>
            </div>

            {/* Back Link */}
            <div className="text-center mt-12">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-first text-primary font-bold rounded-lg hover:bg-primary hover:text-secondary border-first border-4 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              العودة للصفحة الرئيسية
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
