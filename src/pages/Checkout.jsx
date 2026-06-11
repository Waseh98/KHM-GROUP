import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import { API_BASE, getImageUrl } from '../utils/api';
import { compressImageFile, uploadPaymentProof } from '../utils/upload';
import { getUserToken } from '../utils/userAuth';

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `KTX-${suffix}`;
}

async function submitOrderToBackend(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const token = getUserToken();
  try {
    const res = await fetch(`${API_BASE}/api/orders/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const isGatewayError = [502, 503, 504].includes(res.status);
    if (isGatewayError) return { source: 'offline', data: null };
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const msg = typeof data === 'object' && data?.message ? data.message : `Server error (${res.status})`;
      throw new Error(msg);
    }
    return { source: 'server', data };
  } catch (err) {
    clearTimeout(timeout);
    const raw = (err.message || '').toLowerCase();
    const isNetworkError =
      err.name === 'AbortError' || raw.includes('ssl') || raw.includes('failed to fetch') ||
      raw.includes('networkerror') || raw.includes('econnrefused') || raw.includes('net::') ||
      raw.includes('load failed') || raw.includes('502') || raw.includes('503') || raw.includes('504');
    if (isNetworkError) return { source: 'offline', data: null };
    throw err;
  }
}

import { PAYMENT_METHODS_CONFIG as paymentMethods } from '../config';


export default function Checkout() {
  const navigate = useNavigate();
  const { items: cartItems, totalPrice: cartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');
  const [step, setStep] = useState(1);
  const [screenshot, setScreenshot] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', street: '' });
  const [prevUserId, setPrevUserId] = useState(user?.id);

  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id);
    if (user) {
      const rawName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      const cleanName = rawName.replace(/^(salam|slam)[,\s]*/i, '');
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || cleanName,
        email: prev.email || user.email || '',
      }));
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Secure Checkout | K-TEX";
  }, []);

  function buildOrderItems() {
    if (!cartItems || cartItems.length === 0) return [];
    return cartItems.map(item => {
      const pId = String(item.id || item._id || '');
      const validObjectId = /^[0-9a-fA-F]{24}$/.test(pId) ? pId : '5f8d04b3a4f8913b8c4c7f0b';
      return {
        product: validObjectId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        size: item.size || 'M',
        color: item.color || 'Default',
      };
    });
  }

  async function handleScreenshot(file) {
    if (!file) return;
    setError('');
    try {
      const dataUrl = await compressImageFile(file);
      setScreenshot(dataUrl);
      setScreenshotPreview(dataUrl);
    } catch (err) {
      setError(err.message || 'Could not process image');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleScreenshot(file);
  }

  function removeScreenshot() {
    setScreenshot('');
    setScreenshotPreview('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const street = formData.street.trim();
    if (!fullName || !phone || !street) {
      setError('Please fill in all required fields.');
      setStep(1);
      return;
    }
    if (!screenshot) {
      setError('Please upload payment screenshot to confirm your order.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let paymentScreenshot = screenshot;
      if (screenshot.startsWith('data:image/')) {
        const uploaded = await uploadPaymentProof(screenshot);
        paymentScreenshot = uploaded.url;
      }

      const result = await submitOrderToBackend({
        email: email || undefined,
        orderItems: buildOrderItems(),
        shippingAddress: { fullName, phone, street, city: '—', province: '—', country: 'Pakistan' },
        paymentInfo: { method: paymentMethod, status: 'pending' },
        paymentScreenshot,
      });
      let orderNumber, orderStatus;
      if (result.source === 'server') {
        orderNumber = result.data?.data?.orderNumber || result.data?.orderNumber || generateOrderNumber();
        orderStatus = result.data?.data?.orderStatus || result.data?.orderStatus || 'pending';
      } else {
        orderNumber = generateOrderNumber();
        orderStatus = 'pending';
        const saved = JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]');
        saved.push({
          orderNumber, fullName, phone, email, street,
          items: buildOrderItems(),
          placedAt: new Date().toISOString(),
          status: 'pending',
          paymentScreenshot: paymentScreenshot,
          paymentMethod: paymentMethod,
        });
        localStorage.setItem('ktex_offline_orders', JSON.stringify(saved));
      }
      navigate('/order-success', { state: { orderNumber, orderStatus } });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #16213e 100%)',
      padding: 'clamp(30px, 6vw, 60px) 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorations */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold), var(--light-gold))',
            marginBottom: '16px', fontSize: '1.8rem',
            boxShadow: '0 8px 32px rgba(184,151,42,0.3)',
          }}>
            🔒
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 2.8rem)',
            color: '#ffffff', margin: '0 0 8px', fontWeight: 700, letterSpacing: '-0.02em',
          }}>
            Secure Checkout
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            Complete your order in a few simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', marginBottom: '28px', animation: 'fadeUp 0.6s 0.1s ease both',
        }}>
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div
                onClick={() => {
                  if (s < step) setStep(s);
                  else if (s === 2 && step === 1) {
                    if (formData.fullName.trim() && formData.phone.trim() && formData.street.trim()) setStep(2);
                    else setError('Please fill in all required fields first.');
                  }
                }}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, cursor: s < step ? 'pointer' : 'default',
                  background: step >= s ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                  color: step >= s ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease',
                  boxShadow: step >= s ? '0 4px 16px rgba(184,151,42,0.4)' : 'none',
                }}
              >
                {s}
              </div>
              {i < 2 && (
                <div style={{
                  width: '40px', height: '2px',
                  background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '28px',
          animation: 'fadeUp 0.6s 0.15s ease both',
        }}>
          {['Details', 'Payment', 'Confirm'].map((label, i) => (
            <span key={label} style={{
              fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: step >= i + 1 ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s ease',
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* Cart Summary Card */}
        {cartItems.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '20px', marginBottom: '20px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeUp 0.6s 0.2s ease both',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>🛒</span>
              <h3 style={{
                margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Your Order
              </h3>
              <span style={{
                marginLeft: 'auto', background: 'var(--gold)', color: '#fff',
                padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
              }}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.image && (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        style={{
                          width: '44px', height: '44px', objectFit: 'cover',
                          borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        Size: {item.size} &middot; Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gold)' }}>
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '16px',
              paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                Total Amount
              </span>
              <span style={{
                fontSize: '1.4rem', fontWeight: 800, color: '#fff',
                fontFamily: 'var(--font-heading)',
              }}>
                PKR {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: 'clamp(24px, 5vw, 36px)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeUp 0.6s 0.3s ease both',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff',
                  margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>📋</span>
                  Personal Details
                </h2>

                {/* Full Name */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', fontWeight: 700,
                    marginBottom: '8px', color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    Full Name <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px', fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem', color: '#fff', outline: 'none',
                      transition: 'all 0.3s ease', boxSizing: 'border-box',
                    }}
                    placeholder="Enter your full name"
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--gold)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184,151,42,0.15)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', fontWeight: 700,
                    marginBottom: '8px', color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    Phone Number <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px', fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem', color: '#fff', outline: 'none',
                      transition: 'all 0.3s ease', boxSizing: 'border-box',
                    }}
                    placeholder="03001234567"
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--gold)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184,151,42,0.15)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', fontWeight: 700,
                    marginBottom: '8px', color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    Email <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px', fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem', color: '#fff', outline: 'none',
                      transition: 'all 0.3s ease', boxSizing: 'border-box',
                    }}
                    placeholder="name@example.com"
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--gold)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184,151,42,0.15)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Address */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', fontWeight: 700,
                    marginBottom: '8px', color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    Delivery Address <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                  <textarea
                    name="street"
                    required
                    rows="3"
                    value={formData.street}
                    onChange={e => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px', fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem', color: '#fff', outline: 'none',
                      transition: 'all 0.3s ease', resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    placeholder="House/Apt, Street, City"
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--gold)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184,151,42,0.15)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (formData.fullName.trim() && formData.phone.trim() && formData.street.trim()) {
                      setStep(2);
                      setError('');
                    } else {
                      setError('Please fill in all required fields.');
                    }
                  }}
                  style={{
                    width: '100%', padding: '16px',
                    background: 'linear-gradient(135deg, var(--gold), var(--light-gold))',
                    color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    border: 'none', borderRadius: '12px', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(184,151,42,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(184,151,42,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(184,151,42,0.3)';
                  }}
                >
                  Continue to Payment &rarr;
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff',
                  margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>💳</span>
                  Payment Method
                </h2>
                <p style={{
                  fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
                  margin: '0 0 24px',
                }}>
                  Select your preferred payment method
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {paymentMethods.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <div key={method.id}>
                        <div
                          onClick={() => setPaymentMethod(method.id)}
                          style={{
                            padding: '18px 20px',
                            background: isSelected
                              ? `linear-gradient(135deg, ${method.color}15, ${method.color}08)`
                              : 'rgba(255,255,255,0.03)',
                            border: `2px solid ${isSelected ? method.color : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '14px', cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex', alignItems: 'center', gap: '16px',
                            boxShadow: isSelected ? `0 8px 24px ${method.color}20` : 'none',
                            transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = `${method.color}60`;
                              e.currentTarget.style.background = `${method.color}08`;
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }
                          }}
                        >
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: method.gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 4px 12px ${method.color}30`,
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}>
                            {method.icon.startsWith('http') || method.icon.startsWith('/') || method.icon.startsWith('data:') ? (
                              <img 
                                src={method.icon} 
                                alt={method.name} 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }} 
                                onError={(e) => { 
                                  e.target.style.display = 'none';
                                  e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                                }} 
                              />
                            ) : null}
                            {!method.icon.startsWith('http') && !method.icon.startsWith('/') && !method.icon.startsWith('data:') && (
                              <span style={{ fontSize: '1.2rem' }}>{method.icon}</span>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 700, fontSize: '1rem', color: '#fff',
                              marginBottom: '2px',
                            }}>
                              {method.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
                            }}>
                              {method.id === 'easypaisa' && 'Mobile wallet transfer'}
                              {method.id === 'jazzcash' && 'Mobile wallet transfer'}
                              {method.id === 'bank_transfer' && 'Direct bank deposit'}
                            </div>
                          </div>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            border: `2px solid ${isSelected ? method.color : 'rgba(255,255,255,0.2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                          }}>
                            {isSelected && (
                              <div style={{
                                width: '14px', height: '14px', borderRadius: '50%',
                                background: method.gradient,
                                animation: 'heartPop 0.3s ease',
                              }} />
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isSelected && (
                          <div style={{
                            marginTop: '8px', padding: '16px 20px',
                            background: `${method.color}10`,
                            border: `1px solid ${method.color}25`,
                            borderRadius: '12px',
                            animation: 'fadeIn 0.3s ease',
                          }}>
                            <div style={{
                              fontWeight: 700, fontSize: '0.85rem', color: method.color,
                              marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                              <span style={{ fontSize: '1rem' }}>📌</span>
                              {method.details.title}
                            </div>
                            <div style={{
                              fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)',
                              lineHeight: 1.8, fontFamily: 'var(--font-body)',
                            }}>
                              {method.details.lines.map((line, i) => (
                                <div key={i} style={{
                                  padding: '4px 0',
                                  borderBottom: i < method.details.lines.length - 1
                                    ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                }}>
                                  {line}
                                </div>
                              ))}
                            </div>
                            <div style={{
                              marginTop: '12px', padding: '10px 14px',
                              background: 'rgba(184,151,42,0.1)',
                              borderRadius: '8px', fontSize: '0.75rem',
                              color: 'var(--gold)', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                              <span>📸</span>
                              You will upload payment screenshot in the next step
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex: '0 0 auto', padding: '14px 24px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }}
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{
                      flex: 1, padding: '16px',
                      background: 'linear-gradient(135deg, var(--gold), var(--light-gold))',
                      color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      border: 'none', borderRadius: '12px', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 24px rgba(184,151,42,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(184,151,42,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(184,151,42,0.3)';
                    }}
                  >
                    Review Order &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff',
                  margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  Confirm & Place Order
                </h2>

                {/* Summary Card */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px', padding: '20px', marginBottom: '20px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '14px', paddingBottom: '14px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>
                      Payment Method
                    </span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '6px 14px', borderRadius: '20px',
                      background: `${selectedMethod?.color}15`,
                      border: `1px solid ${selectedMethod?.color}30`,
                    }}>
                      <span style={{ fontSize: '0.9rem' }}>{selectedMethod?.icon}</span>
                      <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                        {selectedMethod?.name}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>
                      Total to Pay
                    </span>
                    <span style={{
                      fontSize: '1.6rem', fontWeight: 800, color: '#fff',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      PKR {cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Details Reminder */}
                <div style={{
                  padding: '16px 20px', marginBottom: '20px',
                  background: `${selectedMethod?.color}10`,
                  border: `1px solid ${selectedMethod?.color}25`,
                  borderRadius: '14px',
                }}>
                  <div style={{
                    fontWeight: 700, fontSize: '0.85rem', color: selectedMethod?.color,
                    marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span>📌</span>
                    {selectedMethod?.details.title}
                  </div>
                  <div style={{
                    fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.8,
                  }}>
                    {selectedMethod?.details.lines.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>

                {/* Screenshot Upload Section */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', fontWeight: 700,
                    marginBottom: '12px', color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    Payment Screenshot <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>

                  {!screenshotPreview ? (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('screenshotInput').click()}
                      style={{
                        padding: '40px 24px',
                        border: `2px dashed ${dragOver ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: '16px',
                        background: dragOver ? 'rgba(184,151,42,0.08)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        transform: dragOver ? 'scale(1.01)' : 'scale(1)',
                      }}
                    >
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(184,151,42,0.1)', margin: '0 auto 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.8rem',
                      }}>
                        📸
                      </div>
                      <div style={{
                        fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                        marginBottom: '6px',
                      }}>
                        Upload Payment Screenshot
                      </div>
                      <div style={{
                        fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
                        marginBottom: '12px',
                      }}>
                        Drag & drop or click to browse
                      </div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--gold), var(--light-gold))',
                        color: '#fff', fontSize: '0.8rem', fontWeight: 700,
                        boxShadow: '0 4px 16px rgba(184,151,42,0.3)',
                      }}>
                        <span>📁</span> Choose File
                      </div>
                      <div style={{
                        fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)',
                        marginTop: '10px',
                      }}>
                        Supports: JPG, PNG, WEBP (Max 5MB)
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      borderRadius: '16px', overflow: 'hidden',
                      border: '2px solid var(--gold)',
                      background: 'rgba(184,151,42,0.05)',
                      animation: 'fadeIn 0.3s ease',
                    }}>
                      <div style={{
                        position: 'relative',
                        maxHeight: '300px', overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                      }}>
                        <img
                          src={screenshotPreview}
                          alt="Payment Screenshot"
                          style={{
                            maxWidth: '100%', maxHeight: '300px',
                            objectFit: 'contain',
                          }}
                        />
                        <button
                          type="button"
                          onClick={removeScreenshot}
                          style={{
                            position: 'absolute', top: '12px', right: '12px',
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'rgba(200,16,46,0.9)', color: '#fff',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem', fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{
                        padding: '14px 18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'rgba(0,166,81,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                          }}>
                            ✅
                          </div>
                          <div>
                            <div style={{
                              fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                            }}>
                              Screenshot Uploaded
                            </div>
                            <div style={{
                              fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
                            }}>
                              Ready to submit
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('screenshotInput').click()}
                          style={{
                            padding: '6px 14px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--gold)';
                            e.currentTarget.style.color = 'var(--gold)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    id="screenshotInput"
                    type="file"
                    accept="image/*"
                    onChange={e => handleScreenshot(e.target.files?.[0])}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    marginBottom: '16px', padding: '14px 18px',
                    background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)',
                    borderRadius: '12px', color: '#ff6b6b',
                    fontSize: '0.85rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span>⚠️</span> {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      flex: '0 0 auto', padding: '14px 24px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }}
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1, padding: '18px',
                      background: loading
                        ? 'rgba(255,255,255,0.1)'
                        : 'linear-gradient(135deg, var(--gold), var(--light-gold))',
                      color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
                      fontSize: '1rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      border: 'none', borderRadius: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: loading ? 'none' : '0 8px 32px rgba(184,151,42,0.4)',
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(184,151,42,0.5)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,151,42,0.4)';
                      }
                    }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <span style={{
                          width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff', borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Placing Order...
                      </span>
                    ) : (
                      `Place Order via ${selectedMethod?.name}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Error for step 1 */}
        {step === 1 && error && (
          <div style={{
            marginTop: '16px', padding: '14px 18px',
            background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)',
            borderRadius: '12px', color: '#ff6b6b',
            fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '10px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Trust Badges */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap',
          marginTop: '28px', animation: 'fadeUp 0.6s 0.4s ease both',
        }}>
          {[
            { icon: '🔒', text: 'SSL Secured' },
            { icon: '🚚', text: 'Free Delivery' },
            { icon: '↩️', text: 'Easy Returns' },
          ].map((badge, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '0.9rem' }}>{badge.icon}</span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div style={{
          textAlign: 'center', marginTop: '20px',
          animation: 'fadeUp 0.6s 0.5s ease both',
        }}>
          <Link to="/" style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem',
            textDecoration: 'none', transition: 'color 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
