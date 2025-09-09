import React from 'react'
import '../css/whyChooseUs.css'

function WhyChooseUs() {
  return (
    <section className="why-choose-us">
        <h2>WHY CHOOSE US?</h2>
        <p className="subtitle">Delivering trust, comfort, and reliability — because your journey deserves nothing less.</p>
        <div className="features">
            <div className="feature-card">
                <div className="feature-icon">
                    {/* Transparent Pricing Icon */}
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="8" width="40" height="40" rx="8" stroke="#00CFFF" strokeWidth="2"/>
                        <path d="M28 18V38" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M22 24C22 21.7909 23.7909 20 26 20H30C32.2091 20 34 21.7909 34 24C34 26.2091 32.2091 28 30 28H26C23.7909 28 22 29.7909 22 32C22 34.2091 23.7909 36 26 36H30C32.2091 36 34 34.2091 34 32" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="feature-title">Transparent Pricing</div>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    {/* No Hidden Fees Icon */}
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="8" width="40" height="40" rx="8" stroke="#00CFFF" strokeWidth="2"/>
                        <path d="M28 18V38" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="28" cy="28" r="6" stroke="#00CFFF" strokeWidth="2"/>
                        <path d="M24 24L32 32" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="feature-title">No Hidden Fees</div>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    {/* Secure Enquiry Icon */}
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="8" width="40" height="40" rx="8" stroke="#00CFFF" strokeWidth="2"/>
                        <path d="M28 22C25.2386 22 23 24.2386 23 27V32H33V27C33 24.2386 30.7614 22 28 22Z" stroke="#00CFFF" strokeWidth="2"/>
                        <circle cx="28" cy="29" r="2" fill="#00CFFF"/>
                    </svg>
                </div>
                <div className="feature-title">Secure Enquiry</div>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    {/* Flexible Charter Options Icon */}
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="8" width="40" height="40" rx="8" stroke="#00CFFF" strokeWidth="2"/>
                        <path d="M20 28H36" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M28 20L36 28L28 36" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="feature-title">Flexible Charter Options</div>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    {/* 24/7 Booking & Support Icon */}
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="8" width="40" height="40" rx="8" stroke="#00CFFF" strokeWidth="2"/>
                        <circle cx="28" cy="28" r="8" stroke="#00CFFF" strokeWidth="2"/>
                        <path d="M28 24V28L30 30" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="feature-title">24/7 Booking & Support</div>
            </div>
        </div>
    </section>
  )
}

export default WhyChooseUs