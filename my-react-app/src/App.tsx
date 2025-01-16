import { useState } from 'react';
import { LoginPage } from './auth/auth';
import { RecipeGenerator } from './feature/recipeGenerator';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const handleLogin = (uid: string) => {
    setIsAuthenticated(true);
    setUserId(uid);
  };

  const handleTestMode = () => {
    setIsAuthenticated(true);
    setUserId('test-user');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <div className="space-y-4">
          <LoginPage onLogin={handleLogin} />
          <div className="flex justify-center">
            <button
              onClick={handleTestMode}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Enter Test Mode (Skip Login)
            </button>
          </div>
        </div>
      ) : (
        <RecipeGenerator userId={userId} />
      )}
    </div>
  );
}

export default App;

