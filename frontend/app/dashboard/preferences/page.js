'use client';
import React, { useEffect, useState } from 'react';
import userApi from '@/utils/userAxios';
import { toast } from 'react-toastify';
import '../css/preferences.css';

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    preferredAirlines: [],
    seatPreference: 'No Preference',
    mealPreference: 'No Preference',
    notifications: {
      onsite: true,
      browser: false,
      email: true,
    },
  });

  const [airlineInput, setAirlineInput] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await userApi.get('/user/me');
      if (res.data?.preferences) {
        setPreferences(res.data.preferences);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAirline = () => {
    if (airlineInput.trim() && !preferences.preferredAirlines.includes(airlineInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        preferredAirlines: [...prev.preferredAirlines, airlineInput.trim()],
      }));
      setAirlineInput('');
    }
  };

  const handleRemoveAirline = (airline) => {
    setPreferences(prev => ({
      ...prev,
      preferredAirlines: prev.preferredAirlines.filter(a => a !== airline),
    }));
  };

  const handleNotificationChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userApi.put('/user/me', { preferences });
      toast.success('Preferences saved successfully!');
    } catch (err) {
      console.error('Error saving preferences:', err);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-page">
      <div className="preferences-header">
        <h1>My Preferences</h1>
        <p>Customize your travel and notification preferences</p>
      </div>

      {/* Travel Preferences Section */}
      <div className="preference-card">
        <div className="card-header">
          <h2>✈️ Travel Preferences</h2>
        </div>
        <div className="card-content">
          {/* Preferred Airlines */}
          <div className="preference-group">
            <label className="preference-label">Preferred Airlines/Carriers (Max. up to 3)</label>
            <div className="airline-input-group">
              <input
                type="text"
                value={airlineInput}
                onChange={(e) => setAirlineInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAirline()}
                placeholder="Enter airline name"
                className="airline-input"
                maxLength={3}
              />
              <button onClick={handleAddAirline} className="btn-add-airline">
                Add
              </button>
            </div>
            <div className="airline-tags">
              {preferences.preferredAirlines.length === 0 ? (
                <span className="text-gray-400">None</span>
              ) : (
                preferences.preferredAirlines.map(airline => (
                  <span key={airline} className="airline-tag">
                    {airline}
                    <button
                      onClick={() => handleRemoveAirline(airline)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Seat Preference */}
          <div className="preference-group">
            <label className="preference-label">Preferred Seat Type</label>
            <div className="seat-options">
              {['Window', 'Aisle', 'Middle', 'No Preference'].map(option => (
                <label key={option} className="seat-option">
                  <input
                    type="radio"
                    name="seat"
                    value={option}
                    checked={preferences.seatPreference === option}
                    onChange={(e) => handlePreferenceChange('seatPreference', e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meal Preference */}
          <div className="preference-group">
            <label className="preference-label">Preferred Meal Type</label>
            <div className="meal-options">
              {['Veg', 'Non-Veg', 'Vegan', 'Jain', 'No Preference'].map(option => (
                <label key={option} className="meal-option">
                  <input
                    type="radio"
                    name="meal"
                    value={option}
                    checked={preferences.mealPreference === option}
                    onChange={(e) => handlePreferenceChange('mealPreference', e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences Section */}
      <div className="preference-card">
        <div className="card-header">
          <h2>🔔 Notification & Updates</h2>
        </div>
        <div className="card-content">
          {[
            { key: 'onsite', label: 'On-site Notifications', desc: 'Get notified within the app' },
            {
              key: 'browser',
              label: 'Browser Push Notifications',
              desc: 'Desktop notifications from your browser',
            },
            { key: 'email', label: 'Email Updates', desc: 'Receive important updates via email' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="notification-item">
              <div className="notification-content">
                <p className="notification-label">{label}</p>
                <p className="notification-desc">{desc}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.notifications[key]}
                  onChange={() => handleNotificationChange(key)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="preference-actions">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-save"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
