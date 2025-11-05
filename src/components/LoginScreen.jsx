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
    <div className='bg-white rounded-lg shadow-2xl p-8 md:p-12 animate-slide-up'>
      <div className='text-center mb-8'>
        {/* Kenya Flag Representation */}
        <div className='mb-6 mx-auto w-32 h-20 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200'>
          <div className='h-1/4 bg-kenya-black'></div>
          <div className='h-1/4 bg-kenya-red'></div>
          <div className='h-1/4 bg-kenya-green'></div>
          <div className='h-1/4 bg-kenya-white'></div>
        </div>

        <div className='flex justify-center mb-4'>
          <Trophy className='w-16 h-16 text-yellow-500 animate-bounce-subtle' />
        </div>

        <h1 className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-2'>
          Kenya Trivia Challenge
        </h1>

        <p className='text-xl text-gray-600 mb-6'>
          {isLogin ? 'Welcome Back! 🇰🇪' : 'Create Your Account 🇰🇪'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
        {!isLogin && (
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block text-sm font-semibold text-kenya-black mb-2'>
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
              className='w-full px-4 py-3 border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all'
              required={!isLogin}
            />
          </div>
        )}

        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-kenya-black mb-2'>
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
            className='w-full px-4 py-3 border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all'
            required
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block text-sm font-semibold text-kenya-black mb-2'>
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
            className='w-full px-4 py-3 border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all'
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
          className='w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-8 rounded-lg font-bold text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3'>
          {isLogin ? (
            <>
              <LogIn className='w-6 h-6' />
              Login
            </>
          ) : (
            <>
              <UserPlus className='w-6 h-6' />
              Register
            </>
          )}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <button
          onClick={toggleMode}
          className='text-kenya-green hover:text-kenya-red font-semibold transition-colors'>
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

      <div className='mt-6 text-center'>
        <div className='bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-lg p-4'>
          <p className='text-xs text-kenya-black font-semibold'>
            🔒 Your data is stored securely on your device
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
