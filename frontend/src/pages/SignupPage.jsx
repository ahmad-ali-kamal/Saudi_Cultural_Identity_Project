import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    // TODO: Implement AWS Cognito signup
    alert('AWS Cognito registration will be implemented here');
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
                إنشاء حساب جديد
              </h1>
              <p className="text-primary">
                انضم إلينا لحفظ نتائجك ومتابعة تقدمك
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-secondary font-semibold mb-2">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                  placeholder="اسمك"
                  required
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                  placeholder="example@email.com"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
              >
                إنشاء حساب
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-primary">
                لديك حساب بالفعل؟{' '}
                <Link
                  to="/login"
                  className="text-secondary hover:text-accent hover:underline font-semibold transition-colors"
                >
                  سجل دخول
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

export default SignupPage;
