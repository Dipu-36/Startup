import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthHeader from './shared/AuthHeader';
import '../styles/shared/SignupPage.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
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
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.userType) {
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
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <AuthHeader 
            title="Join SponsorConnect" 
            subtitle="Create your account to get started"
          />

          <form onSubmit={handleSubmit} className="signup-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="user-type-selection">
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'influencer' ? 'active' : ''}`}
                onClick={() => handleUserTypeSelect('influencer')}
              >
                I'm a creator
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'brand' ? 'active' : ''}`}
                onClick={() => handleUserTypeSelect('brand')}
              >
                I'm a brand
              </button>
            </div>

            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="form-group password-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button 
              type="submit" 
              className="signup-btn"
              disabled={!formData.userType || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Signup'}
            </button>
          </form>

          <div className="signup-footer">
            <p>Already have an account? <button type="button" onClick={handleLoginClick} className="link-btn">Sign in here</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
