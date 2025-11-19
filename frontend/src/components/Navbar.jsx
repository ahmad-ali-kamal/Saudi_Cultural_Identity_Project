import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userData = await authService.getUserAttributes();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary shadow-lg">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-evenly">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-primary text-2xl font-bold hover:text-accent transition-colors "
          >
            هوية المملكة الثقافية
          </Link>

          {/* Logo/Brand */}
          <Link
            to="/learn"
            className="text-primary text-2xl font-bold hover:text-accent transition-colors "
          >
          تعلم
          </Link>

          {/* Logo/Brand */}
          <Link
            to="/quiz"
            className="text-primary text-2xl font-bold hover:text-accent transition-colors "
          >
          اختبر نفسك
          </Link>

          {/* Logo/Brand */}
          <Link
            to="/about"
            className="text-primary text-2xl font-bold hover:text-accent transition-colors "
          >
          فريق التطوير
          </Link>

          {/* Login/Profile Button */}
          <div>
            {loading ? (
              <div className="text-light text-sm">جاري التحميل...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-light">
                  مرحباً، {user?.name || user?.email?.split('@')[0] || 'مستخدم'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-light text-light rounded-lg hover:bg-accent hover:border-accent transition-all duration-300"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 text-2xl border-2 border-light text-primary rounded-lg hover:bg-primary transition-all duration-300"
              >
                تسجيل دخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
