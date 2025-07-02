import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Mail, 
  Lock, 
  User,
  CreditCard,
  Shield,
  CheckCircle,
  Chrome
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { login, loginWithBiometric, signup } = useAuth();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signup(formData.email, formData.password, formData.name);
        addNotification({
          type: 'success',
          title: 'Account Created',
          message: 'Welcome to CreditAI! Your account has been created successfully.',
          duration: 5000
        });
      } else {
        await login(formData.email, formData.password, rememberMe);
        addNotification({
          type: 'success',
          title: 'Welcome Back',
          message: 'You have successfully signed in to your account.',
          duration: 3000
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Authentication Failed',
        message: error instanceof Error ? error.message : 'Please try again.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      await loginWithBiometric();
      addNotification({
        type: 'success',
        title: 'Biometric Login Successful',
        message: 'Welcome back! You have been authenticated successfully.',
        duration: 3000
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Biometric Authentication Failed',
        message: 'Please try again or use email/password.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const features = [
    'AI-powered credit scoring with 95% accuracy',
    'Real-time financial insights and recommendations',
    'Bank-level security with 256-bit encryption',
    'Alternative data integration for better scoring'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <CreditCard className="w-7 h-7" />
            </div>
            <span className="ml-4 text-2xl font-bold">CreditAI</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Your AI-Powered
            <br />
            Credit Companion
          </h1>
          
          <p className="text-lg mb-8 opacity-90">
            Get accurate credit scores, personalized insights, and financial guidance 
            powered by advanced AI and alternative data sources.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 bg-opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CreditAI
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Join thousands who trust CreditAI with their financial future'
                  : 'Sign in to access your financial insights'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {!isSignUp && (
              <>
                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-500">or</span>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    onClick={handleBiometricLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Fingerprint className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Sign in with Biometric</span>
                  </button>

                  <button
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Chrome className="w-5 h-5 mr-2 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                  </button>
                </div>
              </>
            )}

            <div className="mt-8 text-center">
              <span className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {isSignUp && (
              <div className="mt-6 flex items-center text-xs text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                <span>
                  By creating an account, you agree to our Terms of Service and Privacy Policy. 
                  Your data is protected with bank-level security.
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}