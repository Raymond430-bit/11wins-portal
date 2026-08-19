'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 1. Verify the Secret Access Code FIRST
    const correctCode = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE;
    if (!correctCode || accessCode !== correctCode) {
      setError('Invalid Secret Access Code. Access denied.');
      return; // Stops the login attempt immediately
    }

    setLoading(true);

    // 2. If code is correct, attempt Supabase login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-amber-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-2">Secure access for 11WINS management only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> {error}
            </div>
          )}

          {/* NEW: Secret Access Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secret Access Code</label>
            <input 
              type="password" 
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter 6-digit PIN"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm tracking-widest text-center font-mono" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@11wins.com"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : <><Lock size={16} /> Secure Login</>}
          </button>
        </form>
        
        <p className="text-xs text-center text-gray-400 mt-6">
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}