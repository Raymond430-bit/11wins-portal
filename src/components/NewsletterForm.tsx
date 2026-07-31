'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ name, email }]);

    if (error) {
      alert('Error subscribing: ' + error.message);
    } else {
      setSuccess(true);
      setName('');
      setEmail('');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <CheckCircle className="text-emerald-400" size={24} />
        <p className="text-emerald-400 font-medium">Successfully subscribed!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400" 
        />
        <input 
          type="email" 
          placeholder="Your Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400" 
        />
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="mt-3 w-full py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="animate-spin" size={18} /> Subscribing...</> : 'Subscribe'}
      </button>
    </form>
  );
}