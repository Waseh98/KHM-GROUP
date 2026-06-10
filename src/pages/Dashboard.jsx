import { useAuth } from '../context/useAuth'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

/**
 * Premium Luxury Dashboard Page.
 * Styled to fit K-TEX premium aesthetic: high contrast gold-on-black,
 * glassmorphism cards, dynamic hovers, and smooth transitions.
 */
export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { totalItems: cartItems, totalPrice } = useCart()
  const { totalItems: wishlistItems } = useWishlist()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const rawDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Premium Member'
  const userDisplayName = rawDisplayName.replace(/^(salam|slam)[,\s]*/i, '')
  const userAvatar = user.user_metadata?.avatar_url || ''

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleCopyId = () => {
    if (!user.id) return
    navigator.clipboard.writeText(user.id)
    setCopied(true)
    toast.success('User ID copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Styles ───────────────────────────────────────────────
  const pageStyle = {
    minHeight: '100vh',
    background: '#FAF8F3', // Cream-white luxurious body bg
    padding: '120px 24px 80px',
    fontFamily: 'var(--font-body)',
  }

  const containerStyle = {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  }

  // Hero Card with modern dark glassmorphism
  const heroCardStyle = {
    background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
    borderRadius: 16,
    padding: '40px',
    color: '#fff',
    border: '1px solid rgba(184, 151, 42, 0.25)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 24,
    position: 'relative',
    overflow: 'hidden',
  }

  const heroGoldGlow = {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(184,151,42,0.12) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
  }

  const profileArea = {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  }

  const avatarContainer = {
    width: 90,
    height: 90,
    borderRadius: '50%',
    border: '2px solid var(--gold)',
    boxShadow: '0 0 15px rgba(184,151,42,0.25)',
    overflow: 'hidden',
    background: '#151515',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const avatarStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }

  const textHeaderStyle = {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: '#fff',
    marginBottom: 6,
  }

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(184,151,42,0.15)',
    border: '1px solid rgba(184,151,42,0.4)',
    color: 'var(--light-gold)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '4px 12px',
    borderRadius: 30,
    marginTop: 4,
  }

  // Grid Stats Style
  const statsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
  }

  const statCard = {
    background: '#fff',
    borderRadius: 12,
    padding: '24px',
    border: '1px solid var(--border)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s',
    cursor: 'pointer',
  }

  const statIconBox = (bgColor, iconColor) => ({
    width: 50,
    height: 50,
    borderRadius: 10,
    background: bgColor,
    color: iconColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  })

  // Split Panel Layout
  const panelLayout = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: 28,
  }

  const cardStyle = {
    background: '#fff',
    borderRadius: 14,
    padding: '36px',
    border: '1px solid var(--border)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }

  const cardTitle = {
    fontFamily: 'var(--font-heading)',
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--black)',
    marginBottom: 24,
    borderBottom: '2.5px solid var(--gold)',
    paddingBottom: 8,
    display: 'inline-block',
    width: 'fit-content',
  }

  const detailRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f1ece2',
  }

  const detailLabel = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--mid-gray)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const detailValue = {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--black)',
    textAlign: 'right',
  }

  const activeBadge = {
    background: '#e6fdf2',
    color: '#0fa968',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  }

  const emptyStateContainer = {
    textAlign: 'center',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexGrow: 1,
  }

  const shopButton = {
    padding: '12px 28px',
    background: 'var(--black)',
    color: '#fff',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'all 0.25s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  }

  const logoutButton = {
    padding: '13px 28px',
    background: 'transparent',
    color: 'var(--red)',
    border: '2px solid var(--red)',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'all 0.25s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 'fit-content',
    cursor: 'pointer',
    marginTop: 12,
  }

  return (
    <div style={pageStyle} className="db-page-container">
      <div style={containerStyle} className="db-inner-container">
        
        {/* ─── LUXURY HERO HEADER ─── */}
        <div style={heroCardStyle} className="db-hero-card">
          <div style={heroGoldGlow} />
          <div style={profileArea} className="db-profile-area">
            <div style={avatarContainer} className="db-avatar-container">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" style={avatarStyle} />
              ) : (
                <svg width="42" height="42" fill="none" stroke="var(--gold)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              )}
            </div>
            <div>
              <h1 style={textHeaderStyle}>{userDisplayName}!</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, letterSpacing: '0.03em' }}>
                Welcome back to your luxury shopping dashboard
              </p>
              <div style={badgeStyle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Elite Gold Member
              </div>
            </div>
          </div>
          
          <button
            style={logoutButton}
            className="db-logout-btn"
            onClick={handleLogout}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--red)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--red)'
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Log Out
          </button>
        </div>

        {/* ─── THREE STATS GRID ─── */}
        <div style={statsGrid} className="db-stats-grid">
          {/* Cart Card */}
          <div
            style={statCard}
            className="db-stat-card"
            onClick={() => navigate('/checkout')}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'
              e.currentTarget.style.borderColor = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={statIconBox('rgba(184, 151, 42, 0.08)', 'var(--gold)')}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--mid-gray)', fontWeight: 500 }}>Shopping Bag</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--black)', margin: '2px 0' }}>
                {cartItems} {cartItems === 1 ? 'Item' : 'Items'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
                {cartItems > 0 ? `Total Value: Rs. ${totalPrice.toLocaleString()}` : 'Bag is empty'}
              </div>
            </div>
          </div>

          {/* Wishlist Card */}
          <div
            style={statCard}
            className="db-stat-card"
            onClick={() => window.dispatchEvent(new CustomEvent('open-wishlist'))}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'
              e.currentTarget.style.borderColor = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={statIconBox('rgba(200, 16, 46, 0.06)', 'var(--red)')}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--mid-gray)', fontWeight: 500 }}>My Wishlist</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--black)', margin: '2px 0' }}>
                {wishlistItems} {wishlistItems === 1 ? 'Style' : 'Styles'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--mid-gray)', fontWeight: 500 }}>
                Your selected fashion favorites
              </div>
            </div>
          </div>

          {/* Exclusive Offer Card */}
          <div
            style={{ ...statCard, cursor: 'default' }}
            className="db-stat-card"
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'
              e.currentTarget.style.borderColor = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={statIconBox('rgba(184, 151, 42, 0.08)', 'var(--gold)')}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 0 0 2.037 0l4.318-4.318a1.44 1.44 0 0 0 0-2.037l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--mid-gray)', fontWeight: 500 }}>Active Promo Benefit</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--black)', margin: '2px 0' }}>
                10% OFF Auto-Applied
              </div>
              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
                Gold tier benefit active at checkout
              </div>
            </div>
          </div>
        </div>

        {/* ─── TWO SPLIT PANEL LAYOUT ─── */}
        <div style={panelLayout} className="db-panel-layout">
          
          {/* Panel Left: Account Details */}
          <div style={cardStyle} className="db-panel-card">
            <div>
              <h2 style={cardTitle}>Profile & Credentials</h2>
              
              <div style={detailRow}>
                <span style={detailLabel}>Full Name</span>
                <span style={detailValue}>{userDisplayName}</span>
              </div>

              <div style={detailRow}>
                <span style={detailLabel}>Primary Email</span>
                <span style={detailValue}>{user.email}</span>
              </div>

              <div style={detailRow}>
                <span style={detailLabel}>Account Verification</span>
                <span style={detailValue}>
                  <span style={activeBadge}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {user?.authProvider === 'firebase' ? 'Google Verified' : 'Email Verified'}
                  </span>
                </span>
              </div>

              <div style={detailRow}>
                <span style={detailLabel}>Member Since</span>
                <span style={detailValue}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </span>
              </div>

              <div style={{ ...detailRow, borderBottom: 'none' }}>
                <span style={detailLabel}>Unique ID</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...detailValue, fontSize: 11, color: 'var(--mid-gray)', fontFamily: 'monospace' }}>
                    {(user.id || '').substring(0, 16) || 'N/A'}...
                  </span>
                  <button
                    onClick={handleCopyId}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copied ? 'var(--gold)' : 'var(--mid-gray)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 4,
                      transition: 'color 0.2s',
                    }}
                    title="Copy Full ID"
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, fontSize: 12, color: 'var(--mid-gray)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 10.95h13.5c1.108 0 2-.892 2-2v-6.75A2 2 0 0 0 18.75 11H5.25A2 2 0 0 0 3.25 13v6.75c0 1.108.892 2 2 2Z" />
              </svg>
              Standard SSL encryption protects your private information
            </div>
          </div>

          {/* Panel Right: Recent Orders Placeholder */}
          <div style={cardStyle} className="db-panel-card">
            <div>
              <h2 style={cardTitle}>Wardrobe & Orders</h2>
              
              <div style={emptyStateContainer}>
                <svg width="60" height="60" fill="none" stroke="var(--border)" strokeWidth="1.2" viewBox="0 0 24 24" style={{ color: 'var(--light-gold)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-heading)' }}>
                  No Active Orders Found
                </div>
                <p style={{ fontSize: 13, color: 'var(--mid-gray)', lineHeight: 1.5, maxWidth: 300, margin: '0 auto' }}>
                  Your wardrobe is awaiting its first K-TEX upgrade. Browse our latest polo shirts and new designer releases.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <Link
                to="/men"
                style={shopButton}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--gold)'
                  e.currentTarget.style.transform = 'scale(1.03)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--black)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Browse Collections
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .db-page-container {
            padding: 100px 16px 60px !important;
          }
          .db-panel-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .db-stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 768px) {
          .db-hero-card {
            padding: 24px 20px !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 20px !important;
          }
          .db-profile-area {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 16px !important;
          }
          .db-logout-btn {
            width: 100% !important;
            margin-top: 8px !important;
          }
          .db-panel-card {
            padding: 24px 20px !important;
          }
        }
        @media (max-width: 480px) {
          .db-page-container {
            padding: 90px 12px 40px !important;
          }
          .db-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .db-panel-card {
            padding: 20px 16px !important;
          }
        }
        @media (max-width: 360px) {
          .db-hero-card {
            padding: 20px 14px !important;
          }
        }
      `}</style>
    </div>
  )
}
