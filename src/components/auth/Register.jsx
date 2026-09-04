import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoDjp from '../../assets/img/logo-djp-nonfix.jpeg';

export default function Register() {
  const { session, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah login, redirect ke halaman admin
  const destination = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (session) {
      navigate(destination, { replace: true });
    }
  }, [session, navigate, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg('Email/Gmail dan kata sandi wajib diisi.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMsg('Kata sandi minimal terdiri dari 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      // Ambil bagian nama dari email untuk default profile name
      const defaultName = trimmedEmail.split('@')[0] || 'Petugas DJP';
      const metadata = {
        full_name: defaultName,
        role: 'petugas',
      };

      const { data, error } = await signUp(trimmedEmail, trimmedPassword, metadata);

      if (error) {
        if (error.message?.toLowerCase().includes('already registered') || error.status === 422) {
          setErrorMsg('Email ini sudah terdaftar. Silakan gunakan menu Masuk.');
        } else {
          setErrorMsg(error.message || 'Gagal mendaftarkan akun.');
        }
        setIsLoading(false);
        return;
      }

      // Supabase behavior: jika email confirmation dinonaktifkan, session otomatis terbentuk
      if (data?.session) {
        setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke Panel Petugas...');
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1200);
      } else {
        // Jika confirmation email aktif
        setSuccessMsg('Akun berhasil didaftarkan! Silakan cek kotak masuk email/Gmail Anda jika diperlukan aktivasi, atau langsung masuk.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[Register] Exception:', err);
      setErrorMsg('Terjadi kendala saat registrasi: ' + (err.message || ''));
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
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Background glow accents */}
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
        padding: '36px 30px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            marginBottom: '14px'
          }}>
            <img 
              src={logoDjp} 
              alt="Logo DJP" 
              style={{ height: '46px', width: 'auto', objectFit: 'contain' }} 
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
            Daftar Akun Petugas
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94A3B8',
            margin: 0
          }}>
            Daftar cepat hanya dengan Gmail dan Kata Sandi
          </p>
        </div>

        {/* Tab Switcher (Masuk vs Daftar) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '22px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px',
              borderRadius: '9px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#94A3B8',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
          >
            <span>🔑</span> Masuk
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px',
              borderRadius: '9px',
              backgroundColor: '#0056B3',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0, 86, 179, 0.4)'
            }}
          >
            <span>📝</span> Daftar Baru
          </div>
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
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span style={{ fontSize: '15px' }}>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Alert Success */}
        {successMsg && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#6EE7B7',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            lineHeight: '1.4',
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <span style={{ fontWeight: 600 }}>{successMsg}</span>
            </div>
            {!session && (
              <Link
                to="/login"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '4px',
                  color: '#FFD100',
                  fontWeight: 600,
                  fontSize: '12px',
                  textDecoration: 'underline'
                }}
              >
                Klik di sini untuk langsung Masuk →
              </Link>
            )}
          </div>
        )}

        {/* Form Register: Hanya Gmail dan Password */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#E2E8F0',
              marginBottom: '6px'
            }}>
              Email / Akun Gmail <span style={{ color: '#FF8585' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="contoh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoFocus
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
                Kata Sandi <span style={{ color: '#FF8585' }}>*</span>
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
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={6}
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
              padding: '13px',
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
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#94A3B8'
        }}>
          Sudah memiliki akun?{' '}
          <Link
            to="/login"
            style={{
              color: '#FFD100',
              fontWeight: 600,
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Masuk di sini
          </Link>
        </div>

        {/* Footer Navigation */}
        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
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
