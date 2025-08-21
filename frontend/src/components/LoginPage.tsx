import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../config/appConfig';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      
      // Redirect to the page they were trying to access, or default dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the context
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse opacity-20"></div>
      </div>

      <div className={`max-w-md w-full space-y-8 relative z-10 transition-all duration-1000 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Login Card */}
        <div className={`bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-xl p-8 transition-all duration-700 ease-out transform ${
          isVisible ? 'scale-100 rotate-0' : 'scale-95 rotate-1'
        } hover:shadow-2xl hover:scale-[1.02] hover:bg-card/90`}>
          {/* Header */}
          <div className={`text-center mb-8 transition-all duration-800 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{transitionDelay: '200ms'}}>
            <h1 className="text-2xl font-display font-bold text-primary mb-2 hover:scale-105 transition-transform duration-300 cursor-default tracking-tight">
              {APP_NAME}
            </h1>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2 hover:text-primary transition-colors duration-300 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-900 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`} style={{transitionDelay: '400ms'}}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-bounce">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className={`space-y-2 transition-all duration-700 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`} style={{transitionDelay: '600ms'}}>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className={`relative group transition-all duration-300 ${
                focusedField === 'email' ? 'scale-105' : 'scale-100'
              }`}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-10 bg-background border rounded-lg transition-all duration-300 text-foreground placeholder-muted-foreground ${
                    focusedField === 'email' 
                      ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                  required
                  disabled={isLoading}
                />
                <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-all duration-300 ${
                  focusedField === 'email' ? 'text-primary scale-110' : 'text-primary/70'
                }`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className={`space-y-2 transition-all duration-700 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`} style={{transitionDelay: '800ms'}}>
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className={`relative group transition-all duration-300 ${
                focusedField === 'password' ? 'scale-105' : 'scale-100'
              }`}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-10 bg-background border rounded-lg transition-all duration-300 text-foreground placeholder-muted-foreground ${
                    focusedField === 'password' 
                      ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-300 hover:scale-110 ${
                    focusedField === 'password' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className={`transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{transitionDelay: '1000ms'}}>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button content */}
                <div className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span className="animate-pulse">Signing In...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className={`mt-6 text-center transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{transitionDelay: '1200ms'}}>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={handleSignupClick}
                className="text-primary hover:text-primary/80 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-block"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
