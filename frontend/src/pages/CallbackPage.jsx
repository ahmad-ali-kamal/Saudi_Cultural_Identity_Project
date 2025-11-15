import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth';
import Navbar from '../components/Navbar';

function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code and state from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for errors from Cognito
        if (error) {
          throw new Error(errorDescription || error);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        // Exchange code for tokens
        await authService.handleCallback(code, state);

        setStatus('success');

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error('Authentication callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'حدث خطأ في عملية تسجيل الدخول');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="bg-light rounded-2xl shadow-2xl p-8 text-center">
            {status === 'processing' && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-secondary mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  جاري تسجيل الدخول...
                </h2>
                <p className="text-primary/70">
                  يرجى الانتظار بينما نقوم بتأكيد هويتك
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="text-6xl mb-6">✅</div>
                <h2 className="text-2xl font-bold text-secondary mb-2">
                  تم تسجيل الدخول بنجاح!
                </h2>
                <p className="text-primary/70">
                  سيتم تحويلك إلى الصفحة الرئيسية...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="text-6xl mb-6">❌</div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  فشل تسجيل الدخول
                </h2>
                <p className="text-primary mb-6">{errorMessage}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  العودة لتسجيل الدخول
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallbackPage;
