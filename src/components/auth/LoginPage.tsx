import React, { useState } from 'react';
import { BarChart as ChartBar, Mail, Lock, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login validation
        if (!formData.email || !formData.password) {
          showMessage('Please fill in all fields', 'error');
          return;
        }

        if (!validateEmail(formData.email)) {
          showMessage('Please enter a valid email address', 'error');
          return;
        }

        showMessage('Logging in...', 'success');
        await login(formData.email, formData.password);
      } else {
        // Signup validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          showMessage('Please fill in all fields', 'error');
          return;
        }

        if (!validateEmail(formData.email)) {
          showMessage('Please enter a valid email address', 'error');
          return;
        }

        if (!validatePassword(formData.password)) {
          showMessage('Password must be at least 6 characters', 'error');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          showMessage('Passwords do not match', 'error');
          return;
        }

        showMessage('Creating account...', 'success');
        await signup(formData.name, formData.email, formData.password);
        showMessage('Account created successfully! You can now login.', 'success');
        
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }, 2000);
      }
    } catch (error) {
      showMessage(error as string, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-blue-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-slate-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-green-400 rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/50 relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-blue-800 to-slate-700 px-8 py-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <ChartBar className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold tracking-wide">StockWise</h1>
            </div>
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 mr-2 text-green-300" />
              <p className="text-blue-100 text-sm font-medium">Smart Investment Platform</p>
            </div>
            <p className="text-blue-200 text-xs opacity-90">Real-time analysis • AI predictions • Portfolio management</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-10">
          {/* Message Display */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-xl text-center text-sm font-medium border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 bg-slate-50/50 hover:bg-white"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                  <User className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                </div>
              </div>
            )}

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 bg-slate-50/50 hover:bg-white"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 bg-slate-50/50 hover:bg-white"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  required
                />
                <Lock className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
              </div>
            </div>

            {!isLogin && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 bg-slate-50/50 hover:bg-white"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <Lock className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:via-blue-700 hover:to-slate-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
              </span>
            </button>
          </form>

          {/* Info Section */}
          <div className="text-center mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 font-medium">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {isLogin ? 'Login to access real-time stock data and analysis' : 'Join thousands of smart investors'}
            </p>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="bg-slate-50/80 px-8 py-6 text-center border-t border-slate-100">
          <p className="text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                setMessage({ text: '', type: '' });
              }}
              className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline focus:outline-none transition-colors duration-200"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;