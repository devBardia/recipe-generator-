import React, { useState } from 'react';
import { LoginPage } from './auth/auth';
import { RecipeGenerator } from './feature/recipeGenerator';
import { useAuth } from './auth/AuthContext';

function App() {
  const { isAuthenticated, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = async (token: string) => {
    login(token);
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleTestMode = () => {
    // Implement test mode if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {!isAuthenticated ? (
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Recipe Generator
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Generate personalized recipes based on your preferences
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setShowLogin(true);
                setShowSignup(false);
              }}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg text-lg"
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowSignup(true);
                setShowLogin(false);
              }}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200 border-2 border-purple-600 text-lg"
            >
              Sign Up
            </button>
            <button
              onClick={handleTestMode}
              className="px-8 py-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-200 shadow-lg text-lg"
            >
              Try Demo
            </button>
          </div>

          {/* Auth Modal */}
          {(showLogin || showSignup) && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowSignup(false);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <LoginPage 
                  onLogin={handleLogin} 
                  mode={showLogin ? 'login' : 'signup'} 
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <RecipeGenerator />
      )}
    </div>
  );
}

export default App;

