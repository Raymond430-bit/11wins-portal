'use client';

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // Try to read the user's previous choice
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        setIsVisible(true); // No choice made, show banner
      }
    } catch (error) {
      // If the browser blocks localStorage (strict private mode), show the banner anyway
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try { localStorage.setItem('cookie_consent', 'accepted'); } catch (e) {}
    setIsVisible(false);
  };

  const handleReject = () => {
    try { localStorage.setItem('cookie_consent', 'rejected'); } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="text-amber-500 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-gray-900 text-sm">We value your privacy</h4>
            <p className="text-xs text-gray-600 mt-1 max-w-xl">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our GDPR privacy policy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={handleReject}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Reject All
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}