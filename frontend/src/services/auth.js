// Auth Service - AWS Amplify Direct Authentication
import { signIn, signUp, confirmSignUp, signOut, fetchAuthSession, getCurrentUser, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

// ========== Auth Service ==========

export const authService = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Sign in with username/email and password
   * @param {string} usernameOrEmail - Username or email (both are supported)
   * @param {string} password - User's password
   */
  login: async (usernameOrEmail, password) => {
    try {
      const result = await signIn({
        username: usernameOrEmail, // Cognito accepts both username and email (alias)
        password: password,
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error type:', error.__type || error.name);

      // Transform Amplify errors to user-friendly Arabic messages
      const errorType = error.__type || error.name;

      if (errorType === 'NotAuthorizedException') {
        throw new Error('اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (errorType === 'UserNotConfirmedException') {
        // Preserve the error type for special handling in UI
        const confirmError = new Error('يجب تأكيد حسابك أولاً. تحقق من بريدك الإلكتروني');
        confirmError.name = 'UserNotConfirmedException';
        confirmError.__type = 'UserNotConfirmedException';
        throw confirmError;
      } else if (errorType === 'UserNotFoundException') {
        throw new Error('المستخدم غير موجود');
      }
      throw error;
    }
  },

  /**
   * Sign up new user
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} username - User's chosen username (must not be in email format)
   */
  signup: async (email, password, username) => {
    try {
      // Validate username is provided
      if (!username || !username.trim()) {
        throw new Error('اسم المستخدم مطلوب');
      }

      // Validate username is not in email format (Cognito requirement for email alias)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(username)) {
        throw new Error('اسم المستخدم لا يمكن أن يكون بريد إلكتروني. استخدم اسم مستخدم مختلف');
      }

      const signUpParams = {
        username: username.trim(), // Use the user's provided username
        password: password,
        options: {
          userAttributes: {
            email: email, // Email is stored as an attribute (creates alias)
            name: username.trim(), // Also store as display name
          },
        },
      };

      console.log('Attempting signup with params:', {
        username: username.trim(),
        email: email,
        hasPassword: !!password,
        userAttributes: signUpParams.options.userAttributes,
      });

      const result = await signUp(signUpParams);

      console.log('Signup result:', {
        isSignUpComplete: result.isSignUpComplete,
        nextStep: result.nextStep,
        userId: result.userId,
        username: username.trim(),
      });

      // Return both the result and the username for confirmation step
      return {
        ...result,
        username: username.trim(),
      };
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error details:', {
        name: error.name,
        type: error.__type,
        message: error.message,
        code: error.code,
      });

      // Transform Amplify errors to user-friendly Arabic messages
      const errorType = error.__type || error.name;

      if (errorType === 'UsernameExistsException') {
        throw new Error('اسم المستخدم مستخدم بالفعل. اختر اسم مستخدم آخر');
      } else if (errorType === 'InvalidPasswordException') {
        throw new Error('كلمة المرور ضعيفة. يجب أن تحتوي على: 8 أحرف، حرف كبير، حرف صغير، رقم، رمز خاص');
      } else if (errorType === 'InvalidParameterException') {
        // More specific error message - show full error for debugging
        const msg = error.message || '';
        console.warn('InvalidParameterException full message:', msg);

        if (msg.includes('password') || msg.includes('Password')) {
          throw new Error('كلمة المرور لا تتوافق مع المتطلبات. يجب: 8+ أحرف، حرف كبير، حرف صغير، رقم، رمز خاص');
        } else if (msg.includes('email') || msg.includes('Email')) {
          throw new Error(`البريد الإلكتروني غير صحيح. التفاصيل: ${msg}`);
        } else if (msg.includes('username')) {
          throw new Error(`اسم المستخدم غير صحيح. التفاصيل: ${msg}`);
        }
        // Show the actual Cognito error message
        throw new Error(`خطأ في البيانات: ${msg}`);
      }
      // Return the actual error message if not caught above
      throw new Error(error.message || 'حدث خطأ غير متوقع');
    }
  },

  /**
   * Confirm signup with verification code
   * @param {string} username - The username used during signup (or email if email alias is enabled)
   * @param {string} code - The verification code
   */
  confirmSignUp: async (username, code) => {
    try {
      const result = await confirmSignUp({
        username: username, // Use the generated username from signup
        confirmationCode: code,
      });
      return result;
    } catch (error) {
      console.error('Confirmation error:', error);
      // Transform Amplify errors to user-friendly Arabic messages
      const errorType = error.__type || error.name;

      if (errorType === 'CodeMismatchException') {
        throw new Error('رمز التحقق غير صحيح');
      } else if (errorType === 'ExpiredCodeException') {
        throw new Error('رمز التحقق منتهي الصلاحية');
      } else if (errorType === 'UserNotFoundException') {
        throw new Error('المستخدم غير موجود');
      }
      throw error;
    }
  },

  /**
   * Resend confirmation code
   */
  resendConfirmationCode: async (username) => {
    try {
      const { resendSignUpCode } = await import('aws-amplify/auth');
      await resendSignUpCode({ username });
    } catch (error) {
      console.error('Resend code error:', error);
      const errorType = error.__type || error.name;

      if (errorType === 'LimitExceededException') {
        throw new Error('تم تجاوز الحد الأقصى للمحاولات. حاول مرة أخرى لاحقاً');
      } else if (errorType === 'InvalidParameterException') {
        throw new Error('المستخدم مؤكد بالفعل');
      }
      throw new Error('حدث خطأ في إعادة إرسال الرمز');
    }
  },

  /**
   * Initiate password reset - sends verification code to user's email
   * @param {string} email - User's email address
   */
  resetPassword: async (email) => {
    try {
      const result = await resetPassword({
        username: email, // Using email as username for password reset
      });
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      const errorType = error.__type || error.name;

      if (errorType === 'UserNotFoundException') {
        throw new Error('البريد الإلكتروني غير مسجل');
      } else if (errorType === 'LimitExceededException') {
        throw new Error('تم تجاوز الحد الأقصى للمحاولات. حاول مرة أخرى لاحقاً');
      } else if (errorType === 'InvalidParameterException') {
        throw new Error('البريد الإلكتروني غير صحيح');
      }
      throw new Error('حدث خطأ في إرسال رمز التحقق');
    }
  },

  /**
   * Confirm password reset with verification code and new password
   * @param {string} email - User's email address
   * @param {string} code - Verification code from email
   * @param {string} newPassword - New password
   */
  confirmResetPassword: async (email, code, newPassword) => {
    try {
      await confirmResetPassword({
        username: email, // Using email as username
        confirmationCode: code,
        newPassword: newPassword,
      });
    } catch (error) {
      console.error('Confirm reset password error:', error);
      const errorType = error.__type || error.name;

      if (errorType === 'CodeMismatchException') {
        throw new Error('رمز التحقق غير صحيح');
      } else if (errorType === 'ExpiredCodeException') {
        throw new Error('رمز التحقق منتهي الصلاحية');
      } else if (errorType === 'InvalidPasswordException') {
        throw new Error('كلمة المرور ضعيفة. يجب أن تحتوي على: 8 أحرف، حرف كبير، حرف صغير، رقم، رمز خاص');
      } else if (errorType === 'LimitExceededException') {
        throw new Error('تم تجاوز الحد الأقصى للمحاولات. حاول مرة أخرى لاحقاً');
      } else if (errorType === 'UserNotFoundException') {
        throw new Error('المستخدم غير موجود');
      }
      throw new Error('حدث خطأ في إعادة تعيين كلمة المرور');
    }
  },

  /**
   * Sign out user
   */
  logout: async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get current auth session (tokens)
   */
  getSession: async () => {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  /**
   * Get ID token
   */
  getIdToken: async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  },

  /**
   * Get access token for API calls
   */
  getAccessToken: async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  /**
   * Get user attributes (email, name, etc.)
   */
  getUserAttributes: async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.payload;
    } catch (error) {
      console.error('Error getting user attributes:', error);
      return null;
    }
  },

  /**
   * Legacy method for compatibility - get stored user data
   */
  getUser: async () => {
    return await authService.getUserAttributes();
  },

  /**
   * Sync authenticated user from Cognito to MongoDB backend
   * Creates or updates user record in MongoDB using JWT data
   * Should be called after successful login/signup to ensure user exists in DB
   * @returns {Promise<Object>} User data from MongoDB
   */
  syncUser: async () => {
    try {
      // Dynamic import to avoid circular dependency
      const { apiService } = await import('./api');
      const userData = await apiService.getCurrentUser();
      console.log('User synced to MongoDB:', userData);
      return userData;
    } catch (error) {
      console.error('Failed to sync user to MongoDB:', error);
      // Don't throw - allow app to continue even if sync fails
      // Backend will show helpful error if user tries quiz without sync
      throw error;
    }
  },
};

export default authService;
