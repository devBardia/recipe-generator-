import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50">
      {!isAuthenticated ? (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
              AI-Powered Recipe Generator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover delicious recipes tailored just for you. Our AI understands your preferences 
              and dietary needs to create perfect meal suggestions.
            </p>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-gray-600">Personalized recipes based on your preferences and dietary restrictions</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
                <p className="text-gray-600">Get instant recipe suggestions with detailed instructions</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
                <p className="text-gray-600">Store and organize your favorite recipes for quick access</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={() => {
                  setShowLogin(true);
                  setShowSignup(false);
                }}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg text-lg hover:scale-105 transform"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowSignup(true);
                  setShowLogin(false);
                }}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200 border-2 border-purple-600 text-lg hover:scale-105 transform"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Auth Modal */}
          {(showLogin || showSignup) && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative animate-fade-in-up">
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowSignup(false);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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

