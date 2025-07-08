import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/check', {
          credentials: 'include'
        });
        
        if (response.ok) {
          // User is already authenticated, redirect to mailbox
          navigate('/mailbox', { replace: true });
          return;
        }
      } catch (error) {
        console.log('Not authenticated, showing login form');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Create basic auth header
      const authHeader = btoa(`${credentials.username}:${credentials.password}`);
      
      const response = await fetch('/auth/login', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Login successful!');
        // Small delay to ensure cookie is set, then redirect
        setTimeout(() => {
          navigate('/mailbox', { replace: true });
        }, 100);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-400 mx-auto mb-4" size={48} />
          <p className="text-slate-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/uploads/w453y.svg" 
            alt="w453y Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Admin</h1>
          <p className="text-slate-400">Sign in to access the mailbox</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-slate-300 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 placeholder:text-slate-400"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 placeholder:text-slate-400"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-sm text-slate-300">
                <p className="font-medium mb-1">Secure Session-Based Authentication</p>
                <p>Your session will be valid for 1 hour and automatically expire for security.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Portfolio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;