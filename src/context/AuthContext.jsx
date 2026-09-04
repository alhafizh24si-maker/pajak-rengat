import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Ambil session saat inisialisasi awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('[AuthContext] getSession error:', err);
      setLoading(false);
    });

    // 2. Berlangganan perubahan status auth secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase client belum dikonfigurasi.');
    return supabase.auth.signInWithPassword({ email, password });
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
        // Abaikan jika tabel users_role belum dibuat atau RLS membatasi
        console.warn('[AuthContext] Info sinkronisasi users_role:', err);
      }
    }

    return response;
  };

  const signOut = async () => {
    if (!supabase) return;
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
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
