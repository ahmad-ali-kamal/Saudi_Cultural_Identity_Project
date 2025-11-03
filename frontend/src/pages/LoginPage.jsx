import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="bg-light rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-secondary mb-2">
                تسجيل الدخول
              </h1>
              <p className="text-primary">
                سجل دخولك للوصول إلى جميع المميزات
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                تسجيل الدخول
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-6 text-center">
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

export default LoginPage;
