'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter text-gray-900">
            <span className="text-amber-400">11</span>WINS
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Admin Portal Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="admin@11wins.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300 mt-4"
            >
              {loading ? 'Signing in...' : 'Access Dashboard'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Restricted access. Authorized personnel only.
        </p>
      </div>
    </main>
  );
}