import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInGuest: () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah ada sesi tamu tersimpan
    let savedGuestSession = null;
    try {
      const stored = localStorage.getItem('pajak_rengat_guest_session');
      if (stored) savedGuestSession = JSON.parse(stored);
    } catch (e) {}

    if (!supabase) {
      if (savedGuestSession) {
        setSession(savedGuestSession);
        setUser(savedGuestSession.user ?? null);
      }
      setLoading(false);
      return;
    }

    // 1. Ambil session saat inisialisasi awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (savedGuestSession) {
        setSession(savedGuestSession);
        setUser(savedGuestSession.user ?? null);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('[AuthContext] getSession error:', err);
      if (savedGuestSession) {
        setSession(savedGuestSession);
        setUser(savedGuestSession.user ?? null);
      }
      setLoading(false);
    });

    // 2. Berlangganan perubahan status auth secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase client belum dikonfigurasi.');
    try {
      localStorage.removeItem('pajak_rengat_guest_session');
    } catch (e) {}
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInGuest = () => {
    const guestUser = {
      id: 'guest_demo_user',
      email: 'tamu.petugas@pajak.go.id',
      user_metadata: {
        full_name: 'Tamu / Preview Petugas',
        role: 'tamu',
        nip: '19950819 202601 1 001'
      }
    };
    const guestSession = {
      user: guestUser,
      access_token: 'demo_guest_token_' + Date.now(),
    };
    setSession(guestSession);
    setUser(guestUser);
    try {
      localStorage.setItem('pajak_rengat_guest_session', JSON.stringify(guestSession));
    } catch (e) {}
    return { data: { session: guestSession, user: guestUser }, error: null };
  };

  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) throw new Error('Supabase client belum dikonfigurasi.');
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          password: password,
        },
      },
    });

    // Upaya sinkronisasi ke tabel users_role jika tabel tersedia
    if (response.data?.user?.id && !response.error) {
      try {
        const { error: roleErr } = await supabase.from('users_role').upsert({
          id: response.data.user.id,
          role: metadata.role || 'petugas',
          nama: metadata.full_name || metadata.nama || email.split('@')[0],
          nip: metadata.nip || '-',
          password: password,
        });
        if (roleErr) {
          console.warn('[AuthContext] Info sinkronisasi users_role:', roleErr.message);
        }
      } catch (err) {
        console.warn('[AuthContext] Info sinkronisasi users_role:', err);
      }
    }

    return response;
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('pajak_rengat_guest_session');
    } catch (e) {}
    setSession(null);
    setUser(null);
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signInGuest, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
