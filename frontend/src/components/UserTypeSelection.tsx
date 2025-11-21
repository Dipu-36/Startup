import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelection: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'brand' | 'influencer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeSubmit = async () => {
    console.log('handleUserTypeSubmit called', { userType, user: !!user });
    if (!userType || !user) {
      console.log('Early return: missing userType or user');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating Clerk metadata...');
      // Update Clerk metadata using the correct method
      await user.update({
        unsafeMetadata: {
          userType: userType
        }
      });
      console.log('Clerk metadata updated successfully');

      // Wait for user to reload with new metadata
      console.log('Reloading user...');
      await user.reload();
      console.log('User reloaded, new metadata:', user.unsafeMetadata);

      // Create user profile in our database
      console.log('Getting token...');
      const token = await getToken();
      console.log('Token received:', !!token);
      
      const requestBody = {
        name: user.fullName || user.firstName || 'User',
        email: user.primaryEmailAddress?.emailAddress,
        userType: userType
      };
      console.log('Sending API request with body:', requestBody);
      
      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API response status:', response.status);
      const responseText = await response.text();
      console.log('API response body:', responseText);

      if (response.ok) {
        // Wait a bit to ensure Clerk has fully processed the metadata update
        setTimeout(() => {
          // Redirect to appropriate dashboard
          const redirectPath = userType === 'brand' ? '/brand/dashboard' : '/creator/dashboard';
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 1000);
      } else {
        console.error('Failed to create user profile:', response.status, responseText);
        alert(`Failed to create user profile: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error('Error setting user type:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600">Let's set up your account. What best describes you?</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setUserType('brand')}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              userType === 'brand'
                ? 'border-purple-500 bg-purple-50 text-purple-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-lg">I'm a Brand</div>
            <div className="text-sm text-gray-600 mt-1">
              I want to create campaigns and work with influencers
            </div>
          </button>

          <button
            onClick={() => setUserType('influencer')}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              userType === 'influencer'
                ? 'border-purple-500 bg-purple-50 text-purple-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-lg">I'm an Influencer</div>
            <div className="text-sm text-gray-600 mt-1">
              I want to apply to campaigns and collaborate with brands
            </div>
          </button>
        </div>

        <button
          onClick={handleUserTypeSubmit}
          disabled={!userType || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            userType && !isLoading
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection;
