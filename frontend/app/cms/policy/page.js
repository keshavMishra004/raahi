"use client"
import React, { useState } from 'react'
import '../css/policy.css'

const TABS = [
  { key: 'policy', label: 'Policies' },
  { key: 'faq', label: 'FAQ' },
  { key: 'reviews', label: 'Customer Reviews' }
]

const SERVICES = [
  "Global (Default)",
  "Fly Bharat",
  "Aerial Service",
  "Pilgrimage",
  "Private Charter",
  "Empty Leg",
  "Air Ambulance"
]

function Page() {
  const [activeTab, setActiveTab] = useState('policy')
  const [selectedService, setSelectedService] = useState(SERVICES[0])

  return (
    <div className="policy-container">
      <h1 className="policy-title">Policies, FAQ & Reviews</h1>
      <p className="policy-desc">
        Manage global and service-specific rules and customer interactions.
      </p>
      <div className="policy-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`policy-tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="policy-tab-content">
        {activeTab === 'policy' && (
          <div className="policy-panel">
            <h2>Editing Global Policies</h2>
            <div className="policy-row">
              <label>Select Service to Customize</label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
              >
                {SERVICES.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div className="policy-row">
              <label>Cancellation Policy</label>
              <textarea placeholder="e.g., Full refund for cancellations made..."></textarea>
            </div>
            <div className="policy-row">
              <label>Weather Policy</label>
              <textarea placeholder="e.g., Flights may be rescheduled or fully refunded due to adverse weather conditions..."></textarea>
            </div>
            <button className="policy-save-btn">Save Policies</button>
          </div>
        )}
        {activeTab === 'faq' && (
          <div className="policy-panel">
            <h2>
              Editing {selectedService === "Global (Default)" ? "Global FAQ" : `${selectedService} FAQ`}
            </h2>
            <div className="policy-row">
              <label>Select Service to Customize</label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
              >
                {SERVICES.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div className="policy-faq-list">
              <div className="policy-faq-item">
                <div>
                  <strong>Question:</strong> What documents do I need to carry?
                </div>
                <div>
                  <strong>Answer:</strong> Please carry a government-issued photo ID like Aadhaar or Passport.
                </div>
                <button className="policy-faq-remove">✕</button>
              </div>
              {/* Add more FAQ items as needed */}
            </div>
            <button className="policy-faq-add">Add Question</button>
            <button className="policy-save-btn">Save FAQs</button>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="policy-panel">
            <h2>Customer Reviews</h2>
            <div className="policy-review-list">
              <div className="policy-review-item">
                <div>
                  <strong>Rohan Sharma</strong> for <span className="policy-review-service">Pilgrimage</span>
                  <span className="policy-review-date">September 10, 2025</span>
                </div>
                <div className="policy-review-rating">[Image of 5 stars] 5.0</div>
                <div>
                  "An absolutely seamless experience for my parents' Char Dham Yatra. The ground staff and pilots were extremely professional and caring. Highly recommended!"
                </div>
                <button className="policy-review-reply">Reply</button>
              </div>
              <div className="policy-review-item">
                <div>
                  <strong>Priya Singh</strong> for <span className="policy-review-service">Private Charter</span>
                  <span className="policy-review-date">September 5, 2025</span>
                </div>
                <div className="policy-review-rating">4.0</div>
                <div>
                  "We booked a private charter from Delhi to Jaipur. The flight was comfortable and on time. The catering could have been slightly better, but overall a very good service."
                </div>
                <button className="policy-review-reply">Reply</button>
              </div>
              {/* Add more reviews as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page