"use client"
import React, { useState, useEffect } from 'react'
import '../css/policy.css'
import { useCmsAuth } from "@/app/context/CmsAuthContext"
import { useRouter } from 'next/navigation'
import api from "../../../utils/axios"

const TABS = [
  { key: 'policy', label: 'Policies' },
  { key: 'faq', label: 'FAQ' },
  { key: 'reviews', label: 'Customer Reviews' }
]

// Example: Replace these with actual ObjectIds from your backend
const SERVICES = [
  { label: "Global (Default)", value: null },
  { label: "Fly Bharat", value: "68cfd9098270da3ebbc66e82" },
  { label: "Aerial Service", value: "68cfd9098270da3ebbc66e83" },
  { label: "Pilgrimage", value: "68cfd90a8270da3ebbc66e84" },
  { label: "Private Charter", value: "68cfd90a8270da3ebbc66e85" },
  { label: "Empty Leg", value: "68cfd90a8270da3ebbc66e86" },
  { label: "Air Ambulance", value: "68cfd90a8270da3ebbc66e87" }
]

function Page() {
  const { token, loading } = useCmsAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('policy')

  // Policies tab state
  const [policyService, setPolicyService] = useState(SERVICES[0].value)
  const [policyCancellation, setPolicyCancellation] = useState("")
  const [policyWeather, setPolicyWeather] = useState("")
  const [policyLoading, setPolicyLoading] = useState(false)
  const [policyError, setPolicyError] = useState("")
  const [policySuccess, setPolicySuccess] = useState("")

  // FAQ tab state
  const [faqService, setFaqService] = useState(SERVICES[0].value)
  const [faqList, setFaqList] = useState([
    {
      question: "What documents do I need to carry?",
      answer: "Please carry a government-issued photo ID like Aadhaar or Passport."
    }
  ])

  // Reviews tab state
  const [reviewsService, setReviewsService] = useState(SERVICES[0].value)
  const [reviewsList, setReviewsList] = useState([
    {
      name: "Rohan Sharma",
      service: "Pilgrimage",
      date: "September 10, 2025",
      rating: 5,
      text: "An absolutely seamless experience for my parents' Char Dham Yatra. The ground staff and pilots were extremely professional and caring. Highly recommended!"
    },
    {
      name: "Priya Singh",
      service: "Private Charter",
      date: "September 5, 2025",
      rating: 4,
      text: "We booked a private charter from Delhi to Jaipur. The flight was comfortable and on time. The catering could have been slightly better, but overall a very good service."
    }
  ])

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/cms/login");
    }
  }, [token, loading, router]);

  // Fetch policy when service or tab changes to "policy"
  useEffect(() => {
    if (activeTab === "policy" && token) {
      fetchPolicy(policyService)
    }
    // eslint-disable-next-line
  }, [policyService, activeTab, token])

  const fetchPolicy = async (service) => {
    setPolicyLoading(true)
    setPolicyError("")
    setPolicySuccess("")
    try {
      // Use getPolicyByService endpoint
      const params = { service: service === null ? "" : service }
      const res = await api.get("/cms/getPolicyByService", { params })
      const policy = res.data
      if (policy) {
        setPolicyCancellation(policy.cancellationPolicy || "")
        setPolicyWeather(policy.weatherPolicy || "")
      } else {
        setPolicyCancellation("")
        setPolicyWeather("")
        setPolicyError("No policy found for this service. You can create one.")
      }
    } catch (err) {
      setPolicyCancellation("")
      setPolicyWeather("")
      if (err.response && err.response.status === 404) {
        setPolicyError("No policy found for this service. You can create one.")
      } else {
        setPolicyError("Failed to fetch policy.")
      }
    }
    setPolicyLoading(false)
  }

  const handleSavePolicy = async () => {
    setPolicyLoading(true)
    setPolicyError("")
    setPolicySuccess("")
    try {
      const payload = {
        service: policyService, // ObjectId or null
        cancellationPolicy: policyCancellation,
        weatherPolicy: policyWeather
      }
      const res = await api.post("/cms/createOrUpdatePolicy", payload)
      setPolicySuccess("Policy saved successfully ✅")
    } catch (err) {
      setPolicyError("Failed to save policy ❌")
    }
    setPolicyLoading(false)
  }

  if (loading || !token) return null;

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
            <h2>
              Editing {policyService === null
                ? "Global Policies"
                : `${SERVICES.find(s => s.value === policyService)?.label || policyService} Policies`}
            </h2>
            <div className="policy-row">
              <label>Select Service to Customize</label>
              <select
                value={policyService === null ? "" : policyService}
                onChange={e => setPolicyService(e.target.value === "" ? null : e.target.value)}
              >
                {SERVICES.map(service => (
                  <option key={service.label} value={service.value === null ? "" : service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="policy-row">
              <label>Cancellation Policy</label>
              <textarea
                value={policyCancellation}
                onChange={e => setPolicyCancellation(e.target.value)}
                placeholder="e.g., Full refund for cancellations made..."
                disabled={policyLoading}
              ></textarea>
            </div>
            <div className="policy-row">
              <label>Weather Policy</label>
              <textarea
                value={policyWeather}
                onChange={e => setPolicyWeather(e.target.value)}
                placeholder="e.g., Flights may be rescheduled or fully refunded due to adverse weather conditions..."
                disabled={policyLoading}
              ></textarea>
            </div>
            {policyError && <div style={{ color: "red", marginBottom: 8 }}>{policyError}</div>}
            {policySuccess && <div style={{ color: "green", marginBottom: 8 }}>{policySuccess}</div>}
            <button
              className="policy-save-btn"
              onClick={handleSavePolicy}
              disabled={policyLoading}
            >
              {policyLoading ? "Saving..." : "Save Policies"}
            </button>
          </div>
        )}


        {/* FAQs Tab */}
        {activeTab === 'faq' && (
          <div className="policy-panel">
            <h2>
              Editing {faqService === "Global (Default)" ? "Global FAQ" : `${faqService} FAQ`}
            </h2>
            <div className="policy-row">
              <label>Select Service to Customize</label>
              <select
                value={faqService}
                onChange={e => setFaqService(e.target.value)}
              >
                {SERVICES.map(service => (
                  <option key={service.value} value={service.value}>{service.label}</option>
                ))}
              </select>
            </div>
            <div className="policy-faq-list">
              {faqList.map((faq, idx) => (
                <div className="policy-faq-item" key={idx}>
                  <div>
                    <strong>Question:</strong> {faq.question}
                  </div>
                  <div>
                    <strong>Answer:</strong> {faq.answer}
                  </div>
                  <button
                    className="policy-faq-remove"
                    onClick={() => setFaqList(faqList.filter((_, i) => i !== idx))}
                  >✕</button>
                </div>
              ))}
            </div>
            <button
              className="policy-faq-add"
              onClick={() => setFaqList([...faqList, { question: "", answer: "" }])}
            >Add Question</button>
            <button className="policy-save-btn">Save FAQs</button>
          </div>
        )}


        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="policy-panel">
            <h2>Customer Reviews</h2>
            <div className="policy-row">
              <label>Select Service to Filter</label>
              <select
                value={reviewsService}
                onChange={e => setReviewsService(e.target.value)}
              >
                {SERVICES.map(service => (
                  <option key={service.value} value={service.value}>{service.label}</option>
                ))}
              </select>
            </div>
            <div className="policy-review-list">
              {reviewsList
                .filter(r => reviewsService === "Global (Default)" || r.service === reviewsService)
                .map((review, idx) => (
                  <div className="policy-review-item" key={idx}>
                    <div>
                      <strong>{review.name}</strong> for <span className="policy-review-service">{review.service}</span>
                      <span className="policy-review-date">{review.date}</span>
                    </div>
                    <div className="policy-review-rating">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))} {review.rating}.0
                    </div>
                    <div>
                      "{review.text}"
                    </div>
                    <button className="policy-review-reply">Reply</button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page