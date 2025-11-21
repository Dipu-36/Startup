import { useAuth } from '@clerk/clerk-react';

// Hook to get authentication headers for API calls
export const useAuthHeaders = () => {
  const { getToken } = useAuth();

  const getAuthHeaders = async (): Promise<{ Authorization?: string }> => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return {};
    }
  };

  return { getAuthHeaders };
};

// Function to get auth headers with token parameter (for services)
export const getAuthHeadersWithToken = (token?: string): { Authorization?: string } => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};
