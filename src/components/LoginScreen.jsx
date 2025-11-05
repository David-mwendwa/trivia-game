import { useState } from 'react';
import { User, Mail, Lock, LogIn, UserPlus, Trophy } from 'lucide-react';
import { loginUser, registerUser } from '../utils/supabaseUserManager';

function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isLogin) {
      // Login
      const result = await loginUser(formData.email, formData.password);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onLoginSuccess({ ...result.user, ...result.profile });
        }, 500);
      } else {
        setError(result.message);
      }
    } else {
      // Register
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const result = await registerUser(formData);
      if (result.success) {
        setSuccess(result.message);
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
      } else {
        setError(result.message);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div className='bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 animate-slide-up touch-manipulation select-none'>
      <div className='text-center mb-8'>
        {/* Kenya Flag Representation */}
        <div className='mb-4 sm:mb-6 mx-auto w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200'>
          <div className='h-1/4 bg-kenya-black'></div>
          <div className='h-1/4 bg-kenya-red'></div>
          <div className='h-1/4 bg-kenya-green'></div>
          <div className='h-1/4 bg-kenya-white'></div>
        </div>

        <div className='flex justify-center mb-3 sm:mb-4'>
          <Trophy className='w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 animate-bounce-subtle' />
        </div>

        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-2'>
          Kenya Trivia Challenge
        </h1>

        <p className='text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6'>
          {isLogin ? 'Welcome Back! 🇰🇪' : 'Create Your Account 🇰🇪'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='max-w-md mx-auto touch-manipulation'>
        {!isLogin && (
          <div className='mb-4 sm:mb-6'>
            <label
              htmlFor='name'
              className='block text-sm sm:text-base font-semibold text-kenya-black mb-2'>
              <User className='w-4 h-4 inline mr-2' />
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Enter your full name'
              className='w-full px-4 py-4 text-base sm:text-lg border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all touch-manipulation min-h-[48px]'
              required={!isLogin}
            />
          </div>
        )}

        <div className='mb-4 sm:mb-6'>
          <label
            htmlFor='email'
            className='block text-sm sm:text-base font-semibold text-kenya-black mb-2'>
            <Mail className='w-4 h-4 inline mr-2' />
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Enter your email'
            className='w-full px-4 py-4 text-base sm:text-lg border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all touch-manipulation min-h-[48px]'
            required
          />
        </div>

        <div className='mb-6 sm:mb-8'>
          <label
            htmlFor='password'
            className='block text-sm sm:text-base font-semibold text-kenya-black mb-2'>
            <Lock className='w-4 h-4 inline mr-2' />
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='Enter your password'
            className='w-full px-4 py-4 text-base sm:text-lg border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all touch-manipulation min-h-[48px]'
            required
            minLength={isLogin ? 1 : 6}
          />
          {!isLogin && (
            <p className='text-xs text-gray-500 mt-1'>Minimum 6 characters</p>
          )}
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg text-sm font-semibold'>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className='mb-4 p-3 bg-green-100 border-2 border-green-400 text-green-700 rounded-lg text-sm font-semibold'>
            ✅ {success}
          </div>
        )}

        <button
          type='submit'
          className='w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 touch-manipulation min-h-[56px]'>
          {isLogin ? (
            <>
              <LogIn className='w-5 h-5 sm:w-6 sm:h-6' />
              Login
            </>
          ) : (
            <>
              <UserPlus className='w-5 h-5 sm:w-6 sm:h-6' />
              Register
            </>
          )}
        </button>
      </form>

      <div className='mt-4 sm:mt-6 text-center'>
        <button
          onClick={toggleMode}
          className='text-kenya-green hover:text-kenya-red font-semibold transition-colors touch-manipulation py-2 px-4 rounded-lg min-h-[44px] text-sm sm:text-base active:scale-95'>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span className='underline'>Register here</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className='underline'>Login here</span>
            </>
          )}
        </button>
      </div>

      <div className='mt-4 sm:mt-6 text-center'>
        <div className='bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-lg p-3 sm:p-4'>
          <p className='text-xs sm:text-sm text-kenya-black font-semibold'>
            🔒 Your data is stored securely on your device
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
