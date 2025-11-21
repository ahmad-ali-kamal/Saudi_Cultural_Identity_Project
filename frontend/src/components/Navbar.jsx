import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

function Navbar() {
  // ============ STATE ============
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="mx-auto px-4 md:px-16 lg:px-72 py-4 md:py-6">
        <div className="flex items-center justify-between gap-2 md:gap-4">

          {/* Navigation Links */}
          <div className="flex items-center ml-60 gap-3 md:gap-6 lg:gap-8 ">
            <Link to="/" className="pl-7 text-primary text-sm md:text-lg lg:text-2xl font-bold transition-transform duration-300 ease-out hover:scale-125 hover:text-glow ">
              هوية المملكة الثقافية
            </Link>
            <Link to="/learn" className="pl-7 text-primary text-sm md:text-lg lg:text-2xl font-bold transition-transform duration-300 ease-out hover:scale-125 hover:text-glow ">
              تعلم
            </Link>
            <Link to="/quiz" className="pl-7 text-primary text-sm md:text-lg lg:text-2xl font-bold transition-transform duration-300 ease-out hover:scale-125 hover:text-glow ">
              اختبر نفسك
            </Link>
            <Link to="/about" className="pl-7 text-primary text-sm md:text-lg lg:text-2xl font-bold transition-transform duration-300 ease-out hover:scale-125 hover:text-glow ">
              فريق التطوير
            </Link>
          </div>

          {/* Auth Section */}
          <div>
            {loading ? (
              <div className="text-light text-xs md:text-sm ">جاري التحميل...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2 md:gap-4 ">
                <span className="text-light text-xs md:text-base">
                  مرحباً، {user?.name || user?.email?.split('@')[0] || 'مستخدم'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 md:px-6 md:py-2 border-2 border-light text-light rounded-lg hover:bg-accent hover:border-accent transition-all duration-300 text-xs md:text-base"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  py-1 md:px-8 md:py-2 text-sm md:text-2xl
                  text-primary border-2 border-primary rounded-lg
                  duration-300 ease-out hover:scale-125 hover:shadow-stone-700 hover:shadow-xl
                  whitespace-nowrap inline-block bg-transparent
                  min-w-[110px] shrink-0">
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
