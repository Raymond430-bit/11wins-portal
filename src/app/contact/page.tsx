import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <Header activePage="contact" />
      
      <section className="max-w-6xl mx-auto px-6 py-16 flex-grow w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Ready to take your career to the next level? Get in touch with our team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <MapPin className="text-amber-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Ludwig-Ganghofer-Straße 1<br />
                    82031 Grünwald, Germany
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Phone className="text-amber-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-600 text-sm">+49 89 3450 8820</p>
                  <p className="text-gray-500 text-xs mt-1">Mon-Fri, 9:00-18:00 CET</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Mail className="text-amber-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                  <a href="mailto:contact@11wins-online.com" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                    contact@11wins-online.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Clock className="text-amber-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400">
                  <option>General Inquiry</option>
                  <option>Player Representation</option>
                  <option>Scouting Application</option>
                  <option>Sponsorship</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Team Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">CS</span>
              </div>
              <h3 className="font-bold text-gray-900">Christian Schmid</h3>
              <p className="text-amber-600 text-sm font-medium">CEO / Managing Director</p>
            </div>
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">GF</span>
              </div>
              <h3 className="font-bold text-gray-900">Gregor Falter</h3>
              <p className="text-amber-600 text-sm font-medium">COO</p>
            </div>
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">SK</span>
              </div>
              <h3 className="font-bold text-gray-900">Stephan Kallass</h3>
              <p className="text-amber-600 text-sm font-medium">Partner (DE)</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}