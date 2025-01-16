import { useState } from 'react';
import { LoginPage } from './auth/auth';
import { RecipeGenerator } from './feature/recipeGenerator';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (uid: string) => {
    setIsAuthenticated(true);
    setUserId(uid);
    setShowLogin(false);
  };

  const handleTestMode = () => {
    setIsAuthenticated(true);
    setUserId('test-user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {!isAuthenticated ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Don't Know What to Cook?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let AI help you discover delicious recipes based on your ingredients, preferences, and dietary needs. 
              Take a photo of your ingredients or simply tell us what you have!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Snap & Cook</h3>
              <p className="text-gray-600">Take a photo of your ingredients and let AI suggest the perfect recipe.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
              <p className="text-gray-600">Get personalized recipe recommendations based on your preferences and dietary needs.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">Get instant recipes that match your time constraints and cooking skill level.</p>
            </div>
          </div>

          {/* CTA Buttons */}
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
        <RecipeGenerator userId={userId} />
      )}
    </div>
  );
}

export default App;

