import { useState } from 'react';
import Navbar from '../components/Navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement AWS Cognito login
    alert('AWS Cognito authentication will be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saudi-green/10 to-green-50">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                تسجيل الدخول
              </h1>
              <p className="text-gray-600">
                سجل دخولك للوصول إلى جميع المميزات
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-saudi-green focus:outline-none transition-colors"
                  placeholder="example@email.com"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-saudi-green focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-saudi-green text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                تسجيل الدخول
              </button>
            </form>

            {/* Info Note */}
            <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>ملاحظة:</strong> سيتم دمج نظام تسجيل الدخول مع AWS Cognito قريباً
              </p>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-saudi-green hover:underline font-semibold"
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

export default LoginPage;
