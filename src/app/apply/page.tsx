import { Target, Users, Shield } from 'lucide-react';
import ApplyForm from '@/components/ApplyForm';
import Header from '@/components/Header';
import NewsletterForm from '@/components/NewsletterForm';

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="apply" />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Join the <span className="italic font-serif text-amber-400">11WINS</span> Roster
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Are you an elite talent? Fill out the scouting form below. Our licensed agents review every submission.
        </p>
      </section>

      {/* Info Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
            <Target className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Elite Scouting</h3>
            <p className="text-sm text-gray-600">We look for technical excellence and tactical intelligence.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
            <Users className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">All Ages</h3>
            <p className="text-sm text-gray-600">From U8 youth prospects to Senior professionals.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
            <Shield className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">100% Private</h3>
            <p className="text-sm text-gray-600">Your data is encrypted and GDPR compliant.</p>
          </div>
        </div>
      </section>

      {/* The Form */}
      <section className="max-w-3xl mx-auto px-6 pb-24 w-full">
        <ApplyForm />
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6"><span className="text-amber-400">11</span>WINS</h3>
              <div className="mb-8">
                <h4 className="font-bold text-gray-300 mb-3 uppercase tracking-wider text-sm">Contact Us</h4>
                <p className="text-gray-400 mb-2">123 Football Avenue</p>
                <p className="text-gray-400 mb-2">Munich, Germany</p>
                <p className="text-gray-400 mb-2">+49 89 12345678</p>
                <p className="text-gray-400">contact@11wins-agency.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe for the latest transfers and agency updates</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} 11WINS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}