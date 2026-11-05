import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getCurrentAdmin, getSession, signInWithPassword, signOut } from '../services/auth';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const current = await getSession();
      setSession(current);
      if (current) {
        const admin = await getCurrentAdmin();
        if (!admin) {
          await signOut();
          setSession(null);
          setUser(null);
          setRole(null);
        } else {
          setUser(admin.user);
          setRole(admin.admin.role);
        }
      }
    } catch {
      setSession(null);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setUser(null);
        setRole(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await signInWithPassword(email, password);
    setSession(result.session);
    setUser(result.user);
    setRole(result.role);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
    setUser(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      loading,
      configured: isSupabaseConfigured,
      login,
      logout,
    }),
    [session, user, role, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
