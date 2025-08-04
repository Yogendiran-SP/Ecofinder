import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const LoginScreen: React.FC = () => {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const success = await login(credentials);
      if (success) {
        const storedUser = JSON.parse(localStorage.getItem('ecofinder-user') || '{}');
  
        if (storedUser.role === 'shopkeeper') {
          navigate('/shopkeeper');
        } else {
          navigate('/main');
        }
      } else {
        setError('Invalid credentials. Please check your name and password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your eco-journey</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={credentials.name}
                    onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                  Register here
                </Link>
              </p>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 mt-4 inline-block">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginScreen;