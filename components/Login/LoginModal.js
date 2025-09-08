import React, { useState } from 'react';

export default function LoginModal({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Signup attempt:', { email, password, confirmPassword, agreeTerms });
      // 실제로는 여기서 회원가입 로직 처리
    } else {
      console.log('Login attempt:', { email, password });
      // 실제로는 여기서 로그인 로직 처리
    }
    // 로그인/회원가입 성공 후 모달 닫기
    if (onClose) {
      onClose();
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${isSignUp ? 'Sign up' : 'Login'} with ${provider}`);
    // 실제로는 소셜 로그인/가입 로직 처리
    // 성공 후 모달 닫기
    if (onClose) {
      onClose();
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreeTerms(false);
  };

  const handleBackdropClick = (e) => {
    // 배경 클릭시 모달 닫기
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          url('/image/background.png') center/cover no-repeat
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
        overflow: 'hidden'
      }}
      onClick={handleBackdropClick}
    >

      {/* X 버튼 추가 */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 1001,
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      )}

      {/* Login/Signup Modal */}
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭시 닫히지 않도록
      >

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {isSignUp ? 'Welcome, My Calendar!' : 'Hello, My Calendar!'}
          </h1>
          <div style={{
            fontSize: '16px',
            color: '#111',
            position: 'relative',
            display: 'inline-block',
            padding: '0 20px'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '15px',
              height: '1px',
              background: '#111'
            }} />
            {isSignUp ? 'Sign up' : 'Login'}
            <span style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '15px',
              height: '1px',
              background: '#111'
            }} />
          </div>
        </div>

        {/* Form */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                color: '#333',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 1)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ marginBottom: isSignUp ? '20px' : '30px' }}>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                color: '#333',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 1)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Confirm Password for Sign Up */}
          {isSignUp && (
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {/* Terms Agreement for Sign Up */}
          {isSignUp && (
            <div style={{ 
              marginBottom: '30px', 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px'
            }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                color: '#111',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Agree to{' '}
                <span
                  onClick={() => setShowTerms(true)}
                  style={{
                    textDecoration: 'underline',
                    color: '#0066cc'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#004499'}
                  onMouseLeave={(e) => e.target.style.color = '#0066cc'}
                >
                  Terms and Conditions
                </span>
              </span>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#111',
                fontSize: '14px',
                textDecoration: 'underline',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#333'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
            >
              {isSignUp ? 'or Sign in' : 'or Sign up'}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '18px',
              background: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '30px',
              transition: 'all 0.2s',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#333';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#000';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Get Start
          </button>
        </div>

        {/* Social Login/Signup */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#111',
            fontSize: '14px',
            marginBottom: '20px',
            cursor: 'pointer'
          }}>
            {isSignUp ? 'or Sign up with' : 'or Sign in with'}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}>
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>

            {/* Instagram */}
            <button
              type="button"
              onClick={() => handleSocialLogin('instagram')}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="ig-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#405DE6"/>
                    <stop offset="25%" stopColor="#5851DB"/>
                    <stop offset="50%" stopColor="#833AB4"/>
                    <stop offset="75%" stopColor="#C13584"/>
                    <stop offset="100%" stopColor="#E1306C"/>
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947C23.728 2.695 21.31.273 16.948.073 15.668.014 15.259 0 12 0Z" fill="url(#ig-gradient)"/>
                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8ZM18.406 4.594a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" fill="url(#ig-gradient)"/>
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1001
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Terms and Conditions
              </h2>
              <button
                onClick={() => setShowTerms(false)}
                style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '0 10px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#333'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>1. Service Agreement</h3>
                <p>By using My Calendar service, you agree to be bound by these terms and conditions. Our calendar application provides personal scheduling and time management features.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>2. User Account</h3>
                <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>3. Privacy Policy</h3>
                <p>We respect your privacy and are committed to protecting your personal data. Your calendar data is stored securely and will not be shared with third parties without your consent.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>4. Data Usage</h3>
                <p>You retain ownership of your calendar data. We may use anonymized usage statistics to improve our service, but your personal information remains private.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>5. Service Availability</h3>
                <p>While we strive to provide uninterrupted service, we cannot guarantee 100% uptime. We reserve the right to perform maintenance and updates as necessary.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>6. Prohibited Uses</h3>
                <p>You may not use our service for any unlawful purposes or to violate any applicable laws. Spam, harassment, or malicious activities are strictly prohibited.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>7. Termination</h3>
                <p>Either party may terminate this agreement at any time. Upon termination, your access to the service will be discontinued, and your data may be deleted.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>8. Changes to Terms</h3>
                <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the application.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>9. Contact Information</h3>
                <p>If you have any questions about these terms, please contact us at support@mycalendar.com</p>
              </div>

              <div style={{ 
                padding: '15px',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                marginTop: '20px'
              }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  Last updated: August 26, 2025<br/>
                  By clicking "I Agree" below, you acknowledge that you have read and understood these terms and conditions.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '30px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowTerms(false)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(0, 0, 0, 0.1)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTerms(false);
                }}
                style={{
                  padding: '12px 24px',
                  background: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#333';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#000';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }
          
          input::placeholder {
            color: #999;
          }
          
          input[type="checkbox"] {
            accent-color: #000;
          }
        `}
      </style>
    </div>
  );
}