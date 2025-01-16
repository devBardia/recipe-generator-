import { useState, FormEvent } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
  verificationCode?: string;
}

interface AuthError {
  message: string;
}

interface LoginPageProps {
  onLogin: (userId: string) => void;
  mode: 'login' | 'signup';
}

export function LoginPage({ onLogin, mode }: LoginPageProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (mode === 'signup') {
      if (credentials.password !== credentials.confirmPassword) {
        setError({ message: 'Passwords do not match' });
        return;
      }
      if (credentials.password.length < 8) {
        setError({ message: 'Password must be at least 8 characters long' });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup' && !showVerification) {
        // Simulate sending verification code
        setTimeout(() => {
          setShowVerification(true);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Simulate API call
      setTimeout(() => {
        onLogin('temp-user-id');
      }, 1000);
      
    } catch (err) {
      setError({ message: `Failed to ${mode}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
          {mode === 'login' ? 'Welcome back!' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {mode === 'login' 
            ? 'Enter your details to access your account' 
            : 'Start your culinary journey with us'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl" role="alert">
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => setCredentials({
                ...credentials,
                email: e.target.value
              })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
              placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
            />
          </div>

          {mode === 'signup' && !showVerification && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                placeholder="Confirm your password"
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials({
                  ...credentials,
                  confirmPassword: e.target.value
                })}
              />
            </div>
          )}

          {showVerification && (
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                placeholder="Enter the code sent to your email"
                value={credentials.verificationCode}
                onChange={(e) => setCredentials({
                  ...credentials,
                  verificationCode: e.target.value
                })}
              />
              <p className="mt-2 text-sm text-gray-500">
                We've sent a verification code to your email address.
              </p>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-medium transition-all duration-200 ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Signing in...' : showVerification ? 'Verifying...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign in' : showVerification ? 'Verify Email' : 'Create Account'
            )}
          </button>
        </div>

        {mode === 'login' && (
          <div className="text-sm text-center">
            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
              Forgot your password?
            </a>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
