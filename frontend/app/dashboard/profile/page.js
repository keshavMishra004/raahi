'use client';
import React, { useEffect, useState, useRef } from 'react';
import userApi from '../../../utils/userAxios';

// International calling codes
const COUNTRY_CODES = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+27', country: 'South Africa' },
  { code: '+55', country: 'Brazil' },
  { code: '+1-613', country: 'Canada' },
  { code: '+52', country: 'Mexico' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+66', country: 'Thailand' },
  { code: '+62', country: 'Indonesia' },
  { code: '+63', country: 'Philippines' },
  { code: '+82', country: 'South Korea' },
  { code: '+84', country: 'Vietnam' },
  { code: '+31', country: 'Netherlands' },
  { code: '+32', country: 'Belgium' },
  { code: '+41', country: 'Switzerland' },
  { code: '+43', country: 'Austria' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+45', country: 'Denmark' },
  { code: '+48', country: 'Poland' },
  { code: '+30', country: 'Greece' },
  { code: '+90', country: 'Turkey' },
  { code: '+7', country: 'Russia' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+974', country: 'Qatar' },
  { code: '+20', country: 'Egypt' },
  { code: '+233', country: 'Ghana' },
  { code: '+234', country: 'Nigeria' },
  { code: '+212', country: 'Morocco' },
];

export default function ProfilePage(){
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const previewUrlRef = useRef(null);

  useEffect(()=> {
    fetchUserProfile();
    return () => { if(previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current); };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await userApi.get('/user/me');
      setUser(res.data);
      localStorage.setItem('profileName', res.data.fullname || '');
      if(res.data.profilePicture) {
        localStorage.setItem('profileAvatar', res.data.profilePicture);
        setAvatarPreview(res.data.profilePicture);
      }
    } catch(err) {
      console.error('Error fetching profile:', err);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  // Helper: resize image file to dataURL
  const resizeImageFile = (file, maxDim = 800, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      if(!file) return resolve(null);
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if(width > maxDim || height > maxDim) {
            if(width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    if(previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(f);
    previewUrlRef.current = url;
    setAvatarPreview(url);
    setAvatarFile(f);
  };

  const save = async () => {
    // Validation
    if(!user.fullname || user.fullname.trim() === '') {
      setMessage({ type: 'error', text: 'Full name is required' });
      return;
    }

    if(newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        fullname: user.fullname,
        email: user.email,
        phoneCode: user.phoneCode || '+1',
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        nationality: user.nationality,
      };

      // Handle avatar upload
      if(avatarFile) {
        try {
          const resizedDataUrl = await resizeImageFile(avatarFile, 800, 0.75);
          if(resizedDataUrl) payload.profilePicture = resizedDataUrl;
        } catch(err) {
          console.warn('Image resize failed:', err);
          const fallback = await resizeImageFile(avatarFile, 600, 0.6).catch(()=>null);
          if(fallback) payload.profilePicture = fallback;
        }
      }

      // Handle password change
      if(newPassword && newPassword.trim() !== '') {
        payload.password = newPassword;
      }

      const res = await userApi.put('/user/me', payload);
      
      if(res.data) {
        setUser(res.data);
        localStorage.setItem('profileName', res.data.fullname || '');
        if(res.data.profilePicture) {
          localStorage.setItem('profileAvatar', res.data.profilePicture);
        }

        if(previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
        setAvatarFile(null);
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch(err) {
      console.error('Error saving profile:', err);
      if(err?.response?.status === 413) {
        setMessage({ type: 'error', text: 'Image is too large. Please choose a smaller image.' });
      } else if(err?.response?.data?.message) {
        setMessage({ type: 'error', text: err.response.data.message });
      } else {
        setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  if(user === null) return (
    <div className="p-6 bg-white rounded-xl shadow text-center">
      <div className="spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
        <button 
          onClick={save} 
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Picture Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 overflow-hidden shadow-lg">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white text-4xl font-bold">
                  {(user.fullname || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:shadow-lg transition">
              Change Photo
              <input type="file" accept="image/*" onChange={onFile} hidden />
            </label>
            <p className="text-xs text-gray-400 text-center">JPG, PNG up to 5MB</p>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{user.fullname}</h3>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member Since</span>
                <p className="font-semibold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Last Updated</span>
                <p className="font-semibold text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={user.fullname || ''}
              onChange={e => setUser({...user, fullname: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Read-only)</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              value={user.email || ''}
              readOnly
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={user.dob ? new Date(user.dob).toISOString().slice(0, 10) : ''}
              onChange={e => setUser({...user, dob: e.target.value})}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={user.gender || ''}
              onChange={e => setUser({...user, gender: e.target.value})}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nationality</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={user.nationality || ''}
              onChange={e => setUser({...user, nationality: e.target.value})}
              placeholder="Enter your nationality"
            />
          </div>

          {/* Phone Number - UPDATED with country codes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <div className="flex gap-3">
              {/* Country Code Dropdown */}
              <select
                className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={user.phoneCode || '+1'}
                onChange={e => setUser({...user, phoneCode: e.target.value})}
              >
                <option value="">Select Code</option>
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.country}
                  </option>
                ))}
              </select>
              {/* Phone Number Input */}
              <input
                type="tel"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={user.phone || ''}
                onChange={e => setUser({...user, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: 10 digits for US, 11 for India, etc.</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Security</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password (Optional)</label>
            <div className="flex gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">Your existing password cannot be viewed. Use this section to set a new password.</p>
        </div>
      </div>
    </div>
  );
}
