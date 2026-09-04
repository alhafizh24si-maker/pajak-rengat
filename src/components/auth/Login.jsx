import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoDjp from '../../assets/img/logo-djp-nonfix.jpeg';

export default function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah ada sesi aktif, otomatis arahkan ke dashboard
  const destination = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (session) {
      navigate(destination, { replace: true });
    }
  }, [session, navigate, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(email.trim(), password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Email atau kata sandi tidak valid. Pastikan akun petugas telah terdaftar di Supabase.');
        } else {
          setErrorMsg(error.message || 'Gagal masuk ke sistem.');
        }
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        navigate(destination, { replace: true });
      }
    } catch (err) {
      console.error('[Login] Exception:', err);
      setErrorMsg('Terjadi kendala saat menghubungkan ke server auth: ' + (err.message || ''));
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #002B49 0%, #001224 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(0, 86, 179, 0.15)',
        filter: 'blur(100px)',
        top: '-100px',
        right: '-100px',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255, 209, 0, 0.08)',
        filter: 'blur(120px)',
        bottom: '-80px',
        left: '-80px',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            marginBottom: '16px'
          }}>
            <img 
              src={logoDjp} 
              alt="Logo DJP" 
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          <span style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#FFD100',
            marginBottom: '4px'
          }}>
            KPP Pratama Rengat
          </span>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            Masuk ke Panel Petugas
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94A3B8',
            margin: 0
          }}>
            Sistem Helpdesk Terpadu & WhatsApp Relay
          </p>
        </div>

        {/* Alert Error */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(220, 53, 69, 0.15)',
            border: '1px solid rgba(220, 53, 69, 0.35)',
            color: '#FF8585',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            lineHeight: '1.4',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span style={{ fontSize: '15px' }}>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#E2E8F0',
              marginBottom: '6px'
            }}>
              Email Kedinasan Petugas
            </label>
            <input
              type="email"
              placeholder="nama.petugas@pajak.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0056B3';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#E2E8F0'
              }}>
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0056B3';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFD100 0%, #FFA800 100%)',
              color: '#002B49',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 6px 18px rgba(255, 209, 0, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(0, 43, 73, 0.2)',
                  borderTopColor: '#002B49',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block'
                }} />
                <span>Memproses Verifikasi...</span>
              </>
            ) : (
              'Masuk ke Sistem'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <Link
            to="/"
            style={{
              color: '#94A3B8',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            ← Kembali ke Portal Wajib Pajak
          </Link>
        </div>
      </div>
    </div>
  );
}
