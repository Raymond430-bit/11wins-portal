import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Trophy, Target, Calendar, MapPin, Check, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function SponsorshipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();

  if (!player) notFound();

  const benefits = [
    { title: 'Brand Visibility', description: 'Your brand featured across player social media and match-day content.' },
    { title: 'Matchday Hospitality', description: 'VIP access to home matches and exclusive networking events.' },
    { title: 'Career Partnership', description: 'Direct involvement in supporting player development and career progression.' },
    { title: 'Content Access', description: 'Exclusive behind-the-scenes content and player interviews.' }
  ];

  const steps = [
    { title: 'Review Terms', description: 'Confirm the partnership scope and seasonal commitment below.' },
    { title: 'Complete Contribution', description: 'Settle the partnership fee via your preferred crypto asset.' },
    { title: 'Verification & Onboarding', description: 'Our team verifies the transaction and onboards you within 48 hours.' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href={`/engage/${player.id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Partnerships & Inquiries
        </Link>

        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          {player.image_url ? (
            <img src={player.image_url} alt={player.name} className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-neutral-800" />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-neutral-900 flex items-center justify-center border border-gray-200 dark:border-neutral-800">
              <span className="text-3xl font-bold text-gray-400">{player.name.split(' ').map((n: string) => n[0]).join('')}</span>
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Commercial Partnership</p>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Partner with {player.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{player.club} • {player.position} • {player.nationality}</p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-6 mb-10 border border-gray-200 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3"><Target className="text-emerald-500" size={20} /><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{player.stats_goals || 0}</p><p className="text-xs text-gray-500 uppercase">Goals</p></div></div>
          <div className="flex items-center gap-3"><Trophy className="text-emerald-500" size={20} /><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{player.stats_assists || 0}</p><p className="text-xs text-gray-500 uppercase">Assists</p></div></div>
          <div className="flex items-center gap-3"><Calendar className="text-emerald-500" size={20} /><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{player.stats_appearances || 0}</p><p className="text-xs text-gray-500 uppercase">Appearances</p></div></div>
          <div className="flex items-center gap-3"><MapPin className="text-emerald-500" size={20} /><div><p className="text-lg font-bold text-gray-900 dark:text-white">{player.age} yrs</p><p className="text-xs text-gray-500 uppercase">Age</p></div></div>
        </div>

        {/* Benefits */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Partnership Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {benefits.map((b, i) => (
            <div key={i} className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6 hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{b.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Partnership Commitment</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your partnership directly supports {player.name}'s training, development and career advancement through our comprehensive representation program.
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  €{player.sponsor_owed > 0 ? player.sponsor_owed.toLocaleString() : 'On Request'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/ season</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Partnership term: 1 season (renewable) • All agreements formalized in writing.</p>
            </div>
          </div>
        </div>

        {/* Process */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
              <div className="w-8 h-8 bg-gray-900 dark:bg-neutral-800 text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">{i + 1}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{s.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{s.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href={`/sponsor/${player.id}/payment`} className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-lg shadow-lg">
            Proceed to Partnership Payment <ArrowRight size={20} />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Secure crypto settlement with blockchain verification.</p>
        </div>
      </div>
    </div>
  );
}