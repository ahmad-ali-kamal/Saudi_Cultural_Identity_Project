import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

function Navbar() {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-white text-xl font-bold hover:text-saudi-green transition-colors"
          >
            هوية المملكة الثقافية
          </Link>

          {/* Login/Profile Button */}
          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-white">مرحباً، {user?.username || 'مستخدم'}</span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-saudi-green transition-all duration-300"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-saudi-green transition-all duration-300"
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
