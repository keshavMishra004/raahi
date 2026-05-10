'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import userApi from '@/utils/userAxios';
import './css/dashboard-home.css';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    bookings: 0,
    companions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get user profile
      const userRes = await userApi.get('/user/me');
      setUser(userRes.data);

      // Try to fetch bookings count
      try {
        const bookingsRes = await userApi.get('/bookings/user');
        const companions = userRes.data?.companions || [];
        setStats({
          bookings: bookingsRes.data?.length || 0,
          companions: companions.length,
        });
      } catch (e) {
        console.log('Could not fetch stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      title: 'Book a Flight',
      description: 'Explore and book charter flights',
      icon: '✈️',
      href: '/',
      color: '#667eea',
    },
    {
      title: 'My Bookings',
      description: 'View and manage your bookings',
      icon: '📅',
      href: '/dashboard/bookings',
      color: '#764ba2',
    },
    {
      title: 'Companions',
      description: 'Manage travel companions',
      icon: '👥',
      href: '/dashboard/companions',
      color: '#f093fb',
    },
    {
      title: 'Chat',
      description: 'Message our support team',
      icon: '💬',
      href: '/dashboard/chat',
      color: '#4facfe',
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payments',
      icon: '💳',
      href: '/dashboard/payment-methods',
      color: '#43e97b',
    },
    {
      title: 'Preferences',
      description: 'Set your travel preferences',
      icon: '⚙️',
      href: '/dashboard/preferences',
      color: '#fa709a',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {user?.fullname?.split(' ')[0] || 'Traveler'}! ✈️</h1>
          <p>Manage your flights, bookings, and preferences all in one place</p>
        </div>
        <div className="welcome-illustration">
          <div className="plane-icon">✈️</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.bookings}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
          <Link href="/dashboard/bookings" className="stat-link">View →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.companions}</div>
            <div className="stat-label">Companions</div>
          </div>
          <Link href="/dashboard/companions" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">∞</div>
            <div className="stat-label">Support Chat</div>
          </div>
          <Link href="/dashboard/chat" className="stat-link">Chat →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickLinks.map((link, idx) => (
            <Link key={idx} href={link.href} className="quick-action-card">
              <div className="qa-icon" style={{ background: `${link.color}20`, color: link.color }}>
                {link.icon}
              </div>
              <div className="qa-content">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </div>
              <div className="qa-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started for New Users */}
      {stats.bookings === 0 && (
        <div className="getting-started-section">
          <h2>Getting Started</h2>
          <div className="getting-started-grid">
            <div className="getting-started-card">
              <div className="gs-step">1</div>
              <h3>Complete Your Profile</h3>
              <p>Add your personal details and travel preferences to get personalized recommendations</p>
              <Link href="/dashboard/profile" className="gs-button">
                Complete Profile →
              </Link>
            </div>

            <div className="getting-started-card">
              <div className="gs-step">2</div>
              <h3>Add Companions</h3>
              <p>Include your family members and friends who will travel with you</p>
              <Link href="/dashboard/companions" className="gs-button">
                Add Companions →
              </Link>
            </div>

            <div className="getting-started-card">
              <div className="gs-step">3</div>
              <h3>Set Payment Methods</h3>
              <p>Add safe and secure payment methods for hassle-free bookings</p>
              <Link href="/dashboard/payment-methods" className="gs-button">
                Add Payment Method →
              </Link>
            </div>

            <div className="getting-started-card">
              <div className="gs-step">4</div>
              <h3>Book Your Flight</h3>
              <p>Ready to book? Explore and reserve your first charter flight today</p>
              <Link href="/" className="gs-button">
                Book a Flight →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Highlight */}
      <div className="features-section">
        <h2>Why Choose RAAHi?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛫</div>
            <h3>Charter Flights</h3>
            <p>Book private charter flights across India with complete flexibility</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Instant Booking</h3>
            <p>Get instant confirmation for your bookings with real-time updates</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>24/7 Support</h3>
            <p>Chat with our support team anytime for any queries or assistance</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Multiple secure payment options to make transactions safe and easy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
