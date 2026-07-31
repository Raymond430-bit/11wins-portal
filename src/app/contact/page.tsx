import Header from "@/components/Header";
import { MessageCircle, Send, Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased">
           {/* Header with Football Pitch Design */}
    <Header activePage="contact" />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Get in <span className="italic font-serif text-amber-400">Touch</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Whether you are a club, a sponsor, or a player looking for representation, our team is ready to connect with you.
        </p>
      </section>

      {/* Contact Options */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WhatsApp Button */}
          <a 
            href="https://wa.me/1234567890" // Replace with actual number later
            target="_blank"
            className="group bg-white border border-gray-100 rounded-xl p-8 hover:border-amber-400 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400 transition-colors duration-300">
              <MessageCircle className="text-gray-900 group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-500 text-sm mb-6">Chat instantly with our support team for quick inquiries.</p>
            <span className="text-amber-400 font-semibold text-sm">Open WhatsApp &rarr;</span>
          </a>

          {/* Telegram Button */}
          <a 
            href="https://t.me/yourusername" // Replace with actual username later
            target="_blank"
            className="group bg-white border border-gray-100 rounded-xl p-8 hover:border-amber-400 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400 transition-colors duration-300">
              <Send className="text-gray-900 group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Telegram</h3>
            <p className="text-gray-500 text-sm mb-6">Join our secure channel for official agency updates.</p>
            <span className="text-amber-400 font-semibold text-sm">Open Telegram &rarr;</span>
          </a>

        </div>

        {/* Fallback Email/Phone */}
        <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-12 text-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail size={20} className="text-amber-400" />
            <span>contact@11wins-agency.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone size={20} className="text-amber-400" />
            <span>+49 123 456 7890</span>
          </div>
        </div>
      </section>
    </main>
  );
}