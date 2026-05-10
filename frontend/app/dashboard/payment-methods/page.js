'use client';
import React, { useEffect, useState } from 'react';
import userApi from '@/utils/userAxios';
import { toast } from 'react-toastify';
import '../css/payment-methods.css';

export default function PaymentMethodsPage() {
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState({
    cards: [],
    upi: [],
    digitalWallets: [],
    bankTransfer: null,
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddUPI, setShowAddUPI] = useState(false);
  const [newCard, setNewCard] = useState({
    holderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [newUPI, setNewUPI] = useState({
    upiId: '',
    name: '',
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const res = await userApi.get('/user/me');
      if (res.data?.paymentMethods) {
        setPaymentMethods(res.data.paymentMethods);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.holderName || !newCard.cardNumber || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      toast.error('Please fill all card details');
      return;
    }

    try {
      const card = {
        id: Date.now().toString(),
        holderName: newCard.holderName,
        cardNumber: `**** ${newCard.cardNumber.slice(-4)}`,
        lastFour: newCard.cardNumber.slice(-4),
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        isDefault: paymentMethods.cards.length === 0,
      };

      await userApi.put('/user/me', {
        paymentMethods: {
          ...paymentMethods,
          cards: [...paymentMethods.cards, card],
        },
      });

      setPaymentMethods(prev => ({
        ...prev,
        cards: [...prev.cards, card],
      }));

      setNewCard({ holderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' });
      setShowAddCard(false);
      toast.success('Card added successfully!');
    } catch (err) {
      console.error('Error adding card:', err);
      toast.error('Failed to add card');
    }
  };

  const handleAddUPI = async () => {
    if (!newUPI.upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    try {
      const upi = {
        id: Date.now().toString(),
        upiId: newUPI.upiId,
        name: newUPI.name || 'UPI',
        isDefault: paymentMethods.upi.length === 0,
      };

      await userApi.put('/user/me', {
        paymentMethods: {
          ...paymentMethods,
          upi: [...paymentMethods.upi, upi],
        },
      });

      setPaymentMethods(prev => ({
        ...prev,
        upi: [...prev.upi, upi],
      }));

      setNewUPI({ upiId: '', name: '' });
      setShowAddUPI(false);
      toast.success('UPI ID added successfully!');
    } catch (err) {
      console.error('Error adding UPI:', err);
      toast.error('Failed to add UPI ID');
    }
  };

  const handleDeletePaymentMethod = async (type, id) => {
    try {
      const updated = {
        ...paymentMethods,
        [type]: paymentMethods[type].filter(item => item.id !== id),
      };

      await userApi.put('/user/me', { paymentMethods: updated });
      setPaymentMethods(updated);
      toast.success('Payment method removed');
    } catch (err) {
      console.error('Error deleting payment method:', err);
      toast.error('Failed to remove payment method');
    }
  };

  const handleSetDefault = async (type, id) => {
    try {
      const updated = {
        ...paymentMethods,
        [type]: paymentMethods[type].map(item =>
          item.id === id
            ? { ...item, isDefault: true }
            : { ...item, isDefault: false }
        ),
      };

      await userApi.put('/user/me', { paymentMethods: updated });
      setPaymentMethods(updated);
      toast.success('Default payment method updated');
    } catch (err) {
      console.error('Error updating default:', err);
      toast.error('Failed to update default payment method');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">Loading payment methods...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-methods-page">
      <div className="payment-header">
        <h1>My Payment Methods</h1>
        <p>Manage your payment options securely</p>
      </div>

      {/* Credit/Debit Cards Section */}
      <div className="payment-card-section">
        <div className="section-header">
          <h2>💳 Credit / Debit Cards</h2>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="btn-add-method"
          >
            {showAddCard ? 'Cancel' : '+ Add Card'}
          </button>
        </div>

        {showAddCard && (
          <div className="add-card-form">
            <div className="form-row">
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\s/g, '') })}
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Month</label>
                <select
                  value={newCard.expiryMonth}
                  onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Expiry Year</label>
                <select
                  value={newCard.expiryYear}
                  onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  placeholder="123"
                  maxLength="4"
                  className="form-input"
                />
              </div>
            </div>

            <button onClick={handleAddCard} className="btn-submit">
              Add Card
            </button>
          </div>
        )}

        <div className="payment-methods-list">
          {paymentMethods.cards.map(card => (
            <div key={card.id} className="payment-method-card card-type">
              <div className="card-visual">
                <div className="card-chip"></div>
                <div className="card-number">{card.cardNumber}</div>
                <div className="card-details">
                  <div className="cardholder">{card.holderName}</div>
                  <div className="expiry">
                    {card.expiryMonth}/{card.expiryYear}
                  </div>
                </div>
              </div>
              <div className="method-actions">
                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault('cards', card.id)}
                    className="btn-action btn-default"
                  >
                    Set Default
                  </button>
                )}
                {card.isDefault && <span className="badge-default">Default</span>}
                <button
                  onClick={() => handleDeletePaymentMethod('cards', card.id)}
                  className="btn-action btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPI Section */}
      <div className="payment-card-section">
        <div className="section-header">
          <h2>📱 UPI</h2>
          <button
            onClick={() => setShowAddUPI(!showAddUPI)}
            className="btn-add-method"
          >
            {showAddUPI ? 'Cancel' : '+ Add UPI'}
          </button>
        </div>

        {showAddUPI && (
          <div className="add-upi-form">
            <div className="form-group">
              <label>UPI Address</label>
              <input
                type="text"
                value={newUPI.upiId}
                onChange={(e) => setNewUPI({ ...newUPI, upiId: e.target.value })}
                placeholder="yourname@bankname"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Nickname (Optional)</label>
              <input
                type="text"
                value={newUPI.name}
                onChange={(e) => setNewUPI({ ...newUPI, name: e.target.value })}
                placeholder="My UPI"
                className="form-input"
              />
            </div>
            <button onClick={handleAddUPI} className="btn-submit">
              Add UPI
            </button>
          </div>
        )}

        <div className="payment-methods-list">
          {paymentMethods.upi.map(upi => (
            <div key={upi.id} className="payment-method-card upi-type">
              <div className="upi-info">
                <div className="upi-icon">📱</div>
                <div className="upi-details">
                  <div className="upi-id">{upi.upiId}</div>
                  <div className="upi-name">{upi.name}</div>
                </div>
              </div>
              <div className="method-actions">
                {!upi.isDefault && (
                  <button
                    onClick={() => handleSetDefault('upi', upi.id)}
                    className="btn-action btn-default"
                  >
                    Set Default
                  </button>
                )}
                {upi.isDefault && <span className="badge-default">Default</span>}
                <button
                  onClick={() => handleDeletePaymentMethod('upi', upi.id)}
                  className="btn-action btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {paymentMethods.cards.length === 0 && paymentMethods.upi.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>No Payment Methods Added</h3>
          <p>Add a payment method to make bookings faster</p>
        </div>
      )}
    </div>
  );
}
