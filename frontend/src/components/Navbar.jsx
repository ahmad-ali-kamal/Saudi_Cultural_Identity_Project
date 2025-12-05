import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  // ============ STATE ============
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ============ LIFECYCLE ============
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ============ METHODS ============
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

  // ============ RENDER ============
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sand/55 dark:bg-clay/55 backdrop-blur-sm border-b border-sand dark:border-coffee-light shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo/Brand */}
          <Link to="/" className="text-clay dark:text-cream text-xl md:text-2xl lg:text-3xl font-extrabold hover:text-saudi-green dark:hover:text-gold transition-colors duration-300 flex-shrink-0 tracking-tight">
            هوية المملكة الثقافية
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/learn" className="text-coffee dark:text-sand text-lg font-medium hover:text-clay dark:hover:text-gold transition-all duration-300 hover:-translate-y-0.5">
              تعلم
            </Link>
            <Link to="/quiz" className="text-coffee dark:text-sand text-lg font-medium hover:text-clay dark:hover:text-gold transition-all duration-300 hover:-translate-y-0.5">
              اختبر نفسك
            </Link>
            <Link to="/about" className="text-coffee dark:text-sand text-lg font-medium hover:text-clay dark:hover:text-gold transition-all duration-300 hover:-translate-y-0.5">
              فريق التطوير
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-sand/50 text-coffee dark:text-cream transition-colors duration-300"
              aria-label="تبديل المظهر"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {loading ? (
              <div className="text-olive text-sm">جاري التحميل...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-coffee dark:text-cream text-sm font-medium">
                  مرحباً، {user?.name || user?.email?.split('@')[0] || 'مستخدم'}
                </span>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 text-sm font-bold border-2 text-clay border-clay rounded-xl hover:bg-clay hover:text-white transition-all duration-300"
                >
                  الملف الشخصي
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-bold bg-red-50 text-red-600 border-2 border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-bold text-white bg-clay rounded-xl hover:bg-saudi-green shadow-md hover:shadow-lg transition-all duration-300"
              >
                تسجيل دخول
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-sand/50 text-coffee dark:text-cream transition-colors duration-300"
              aria-label="تبديل المظهر"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-coffee p-2 hover:bg-sand/50 rounded-lg transition-colors duration-300"
              aria-label="قائمة"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" /> // Close icon (X)
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />  // Hamburger icon (three lines)
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-sand dark:border-coffee-light">
            <div className="flex flex-col gap-2 mt-4">
              <Link
                to="/learn"
                onClick={() => setMobileMenuOpen(false)}
                className="text-coffee dark:text-sand text-base font-semibold hover:bg-sand/30 dark:hover:bg-coffee-light px-4 py-3 rounded-lg transition-colors duration-300"
              >
                تعلم
              </Link>
              <Link
                to="/quiz"
                onClick={() => setMobileMenuOpen(false)}
                className="text-coffee dark:text-sand text-base font-semibold hover:bg-sand/30 dark:hover:bg-coffee-light px-4 py-3 rounded-lg transition-colors duration-300"
              >
                اختبر نفسك
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-coffee dark:text-sand text-base font-semibold hover:bg-sand/30 dark:hover:bg-coffee-light px-4 py-3 rounded-lg transition-colors duration-300"
              >
                فريق التطوير
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-sand dark:border-coffee-light pt-4 mt-2 px-2">
                {loading ? (
                  <div className="text-olive dark:text-olive/50 text-sm">جاري التحميل...</div>
                ) : isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-coffee dark:text-cream text-sm font-medium px-2">
                      مرحباً، {user?.name || user?.email?.split('@')[0] || 'مستخدم'}
                    </span>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-center text-sm font-bold text-clay border-2 border-clay rounded-xl hover:bg-clay hover:text-white transition-all duration-300"
                    >
                      الملف الشخصي
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-4 py-3 text-sm font-bold text-red-600 bg-red-50 border-2 border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      تسجيل خروج
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-sm font-bold text-white bg-clay rounded-xl hover:bg-saudi-green shadow-md transition-all duration-300"
                  >
                    تسجيل دخول
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

}

export default Navbar;