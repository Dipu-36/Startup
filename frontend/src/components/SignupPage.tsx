import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../config/appConfig';
import { Eye, EyeOff, Users, Building2 } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '' as 'brand' | 'influencer' | '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleUserTypeSelect = (type: 'brand' | 'influencer') => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }));
    // Clear error when user makes a selection
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      // You could replace this with a toast notification for better UX
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.userType) {
      // You could replace this with a toast notification for better UX
      alert('Please select whether you are a brand or creator');
      return;
    }
    
    try {
      await signup(formData.email, formData.password, formData.name, formData.userType);
      // Redirect based on user type
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the context
      console.error('Signup error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl animate-float opacity-30"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/20 via-transparent to-transparent rounded-full blur-3xl animate-float opacity-30" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-2xl animate-pulse-glow"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent tracking-tight">
              Join {APP_NAME}
            </h1>
            <p className="text-muted-foreground">Create your account to get started</p>
          </div>

          {/* Signup Card */}
          <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm animate-slide-in-left">
                  {error}
                </div>
              )}
              
              {/* Name Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 ${
                    focusedField === 'name'
                      ? 'border-primary shadow-lg shadow-primary/20 bg-background/80 scale-[1.02]'
                      : 'border-border hover:border-border/80'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 ${
                    focusedField === 'email'
                      ? 'border-primary shadow-lg shadow-primary/20 bg-background/80 scale-[1.02]'
                      : 'border-border hover:border-border/80'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 transform hover:scale-105 ${
                      formData.userType === 'influencer'
                        ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleUserTypeSelect('influencer')}
                    disabled={isLoading}
                  >
                    <div className="flex justify-center mb-2">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="font-medium">Creator</div>
                    <div className="text-xs text-muted-foreground">Influencer & Content Creator</div>
                  </button>
                  <button
                    type="button"
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 transform hover:scale-105 ${
                      formData.userType === 'brand'
                        ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleUserTypeSelect('brand')}
                    disabled={isLoading}
                  >
                    <div className="flex justify-center mb-2">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="font-medium">Brand</div>
                    <div className="text-xs text-muted-foreground">Business & Marketing</div>
                  </button>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 ${
                      focusedField === 'password'
                        ? 'border-primary shadow-lg shadow-primary/20 bg-background/80 scale-[1.02]'
                        : 'border-border hover:border-border/80'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 hover:bg-muted/30 rounded"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 ${
                      focusedField === 'confirmPassword'
                        ? 'border-primary shadow-lg shadow-primary/20 bg-background/80 scale-[1.02]'
                        : 'border-border hover:border-border/80'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 hover:bg-muted/30 rounded"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!formData.userType || isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform ${
                    !formData.userType || isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/30'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={handleLoginClick}
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
