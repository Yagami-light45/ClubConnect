// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@college.edu', password: 'admin123' },
    { role: 'Tech Club Head', email: 'tech.head@college.edu', password: 'tech123' },
    { role: 'Drama Club Head', email: 'drama.head@college.edu', password: 'drama123' },
    { role: 'Student', email: 'john.student@college.edu', password: 'student123' }
  ];

  const fillCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Club Recruitment System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h3>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => fillCredentials(cred.email, cred.password)}
                className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="font-medium text-gray-800">{cred.role}</div>
                <div className="text-gray-600">{cred.email} / {cred.password}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;