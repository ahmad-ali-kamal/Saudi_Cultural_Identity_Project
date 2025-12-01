import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

function Navbar() {
  // ============ STATE ============
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo/Brand */}
          <Link to="/" className="font-aa-galaxy text-primary text-base md:text-xl lg:text-2xl font-bold hover:text-accent  flex-shrink-0  hover:text-white hover:text-3xl hover:shadow-white transition-all duration-300">
            هوية المملكة الثقافية
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/learn" className="font-aa-galaxy text-primary text-lg font-semibold hover:text-accent  hover:scale-105  hover:text-white hover:text-3xl hover:shadow-white transition-all duration-300">
              تعلم
            </Link>
            <Link to="/quiz" className="font-aa-galaxy text-primary text-lg font-semibold hover:text-accent hover:scale-105  hover:text-white hover:text-3xl hover:shadow-white transition-all duration-300">
              اختبر نفسك
            </Link>
            <Link to="/about" className="font-aa-galaxy text-primary text-lg font-semibold hover:text-accent hover:scale-105  hover:text-white hover:text-3xl hover:shadow-white transition-all duration-300">
              فريق التطوير
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center">
            {loading ? (
              <div className="text-primary text-sm">جاري التحميل...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-primary text-sm">
                  مرحباً، {user?.name || user?.email?.split('@')[0] || 'مستخدم'}
                </span>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm border-2 text-primary border-primary rounded-lg hover:bg-primary hover:text-secondary transition-all duration-300"
                >
                  الملف الشخصي
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm border-2 text-primary border-primary rounded-lg hover:bg-primary hover:text-secondary transition-all duration-300"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 text-sm border-2 text-primary border-primary rounded-lg hover:bg-primary hover:text-secondary hover:text-2xl hover:shadow-white transition-all duration-300"
              >
                تسجيل دخول
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-primary/20">
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to="/learn"
                onClick={() => setMobileMenuOpen(false)} // Close menu on link click
                className="text-primary text-base font-semibold hover:text-accent transition-colors duration-300 py-2"
              >
                تعلم
              </Link>
              <Link
                to="/quiz"
                onClick={() => setMobileMenuOpen(false)} // Close menu on link click
                className="text-primary text-base font-semibold hover:text-accent transition-colors duration-300 py-2"
              >
                اختبر نفسك
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)} // Close menu on link click
                className="text-primary text-base font-semibold hover:text-accent transition-colors duration-300 py-2"
              >
                فريق التطوير
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-primary/20 pt-3 mt-2">
                {loading ? (
                  <div className="text-primary text-sm">جاري التحميل...</div>
                ) : isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-primary text-sm">
                      مرحباً، {user?.name || user?.email?.split('@')[0] || 'مستخدم'}
                    </span>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)} // Close menu on link click
                      className="px-4 py-2 text-center text-sm border-2 text-primary border-primary rounded-lg hover:bg-primary hover:text-secondary transition-all duration-300"
                    >
                      الملف الشخصي
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false); // Close menu on link click
                        handleLogout(); // Logout on link click
                      }}
                      className="px-4 py-2 text-sm border-2 text-primary border-primary rounded-lg hover:bg-primary hover:text-secondary transition-all duration-300"
                    >
                      تسجيل خروج
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)} // Close menu on link click
                    className="block px-4 py-2 text-center text-sm border-2 text-primary border-primary rounded-lg hover:bg-primary hover:text-secondary transition-all duration-300"
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
