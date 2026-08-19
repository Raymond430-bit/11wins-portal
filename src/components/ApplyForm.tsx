'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Loader2, Shield, Upload, User, Activity, Camera } from 'lucide-react';

export default function ApplyForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    age_group: 'Senior',
    nationality: '',
    place_of_birth: '',
    height: '',
    preferred_foot: 'Right',
    position: '',
    current_club: '',
    parent_contact: '',
    highlight_video_url: '',
    privacy_consent: false,
    honeypot: '' // <-- HONEYPOT FIELD ADDED
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // HONEYPOT CHECK: If the hidden field is filled, it's a bot. Silently reject.
    if (formData.honeypot) {
      return; 
    }

    setLoading(true);
    let imageUrl = '';

    // 1. Upload Image if selected
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `application-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage.from('player-images').upload(fileName, file);
      
      if (error) {
        alert('Error uploading image: ' + error.message);
        setLoading(false);
        return;
      }
      
      const { data: publicData } = supabase.storage.from('player-images').getPublicUrl(data.path);
      imageUrl = publicData.publicUrl;
    }

    // 2. Submit Data to Database
    const { error } = await supabase
      .from('applications')
      .insert([{
        full_name: formData.full_name,
        age: Number(formData.age),
        age_group: formData.age_group,
        nationality: formData.nationality,
        place_of_birth: formData.place_of_birth,
        height: formData.height,
        preferred_foot: formData.preferred_foot,
        position: formData.position,
        current_club: formData.current_club,
        parent_contact: formData.parent_contact || null,
        highlight_video_url: formData.highlight_video_url || null,
        image_url: imageUrl || null,
        status: 'pending'
      }]);

    if (error) {
      alert('Error submitting application: ' + error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-12 text-center shadow-sm">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for your interest in 11WINS. Our scouting team will review your profile and contact you within 14 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-8">
      
      {/* SECTION 1: Personal Information */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <User className="text-amber-400" size={20} /> Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
            <input required name="nationality" placeholder="e.g. German, Nigerian" value={formData.nationality} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
            <input name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Category *</label>
            <select required name="age_group" value={formData.age_group} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400">
              <option value="Senior">Senior</option>
              <option value="U20">U20</option>
              <option value="U18">U18</option>
              <option value="U16">U16</option>
              <option value="U14">U14</option>
              <option value="U12">U12</option>
              <option value="U10">U10</option>
              <option value="U8">U8</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Physical & Technical Attributes */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Activity className="text-amber-400" size={20} /> Physical & Technical Attributes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input name="height" placeholder="e.g. 185" value={formData.height} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Foot</label>
            <select name="preferred_foot" value={formData.preferred_foot} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400">
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Position *</label>
            <input required name="position" placeholder="e.g. Striker, Center Back" value={formData.position} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Club</label>
            <input name="current_club" value={formData.current_club} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
        </div>
      </div>

      {/* SECTION 3: Media & Contact */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Camera className="text-amber-400" size={20} /> Media & Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Player Photo (Headshot or Action Shot)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-amber-400 transition-colors">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {file ? file.name : 'Click to upload image'}
                </span>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Video URL (YouTube/Vimeo)</label>
            <input name="highlight_video_url" placeholder="https://..." value={formData.highlight_video_url} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent/Guardian Contact {Number(formData.age) < 16 && <span className="text-red-500">*</span>}
            </label>
            <input 
              required={Number(formData.age) < 16} 
              name="parent_contact" 
              placeholder="Email or Phone Number" 
              value={formData.parent_contact} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400" 
            />
          </div>
        </div>
      </div>

      {/* HONEYPOT FIELD (Hidden from humans, visible to bots) */}
      <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website_url">Website</label>
        <input 
          id="website_url"
          name="website_url" 
          tabIndex={-1} 
          autoComplete="off"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        />
      </div>

      {/* Privacy Consent */}
      <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
        <input required type="checkbox" name="privacy_consent" checked={formData.privacy_consent} onChange={handleChange} className="mt-1 w-4 h-4 text-amber-400 border-gray-300 rounded focus:ring-amber-400" />
        <label className="text-sm text-gray-600 flex items-start gap-2">
          <Shield size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          I consent to 11WINS storing my data securely for the purpose of scouting and player representation, in accordance with GDPR privacy policies. *
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading || !formData.privacy_consent} className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Submit Scouting Request'}
      </button>
    </form>
  );
}