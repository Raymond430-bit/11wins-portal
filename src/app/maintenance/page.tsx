'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('msg') || 'We are currently undergoing scheduled maintenance. Please check back soon.';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-amber-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Under Maintenance</h1>
        <p className="text-gray-600 leading-relaxed mb-8">{message}</p>
        <div className="text-xs text-gray-400 uppercase tracking-widest">11WINS Management</div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MaintenanceContent />
    </Suspense>
  );
}