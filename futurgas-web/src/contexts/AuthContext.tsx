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

  const clearLocalAuth = useCallback(() => {
    setSession(null);
    setUser(null);
    setRole(null);
  }, []);

  const bootstrap = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const current = await getSession();
      if (!current) {
        clearLocalAuth();
        return;
      }
      const admin = await getCurrentAdmin();
      if (!admin) {
        await signOut();
        clearLocalAuth();
        return;
      }
      setSession(current);
      setUser(admin.user);
      setRole(admin.admin.role);
    } catch {
      try {
        await signOut();
      } catch {
        /* ignore */
      }
      clearLocalAuth();
    } finally {
      setLoading(false);
    }
  }, [clearLocalAuth]);

  useEffect(() => {
    void bootstrap();
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_OUT' || !nextSession) {
        clearLocalAuth();
        return;
      }
      // No confiar solo en el JWT: el panel exige fila en admin_users + grants.
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        void getCurrentAdmin()
          .then((admin) => {
            if (!admin) {
              void signOut().finally(clearLocalAuth);
              return;
            }
            setSession(nextSession);
            setUser(admin.user);
            setRole(admin.admin.role);
          })
          .catch(() => {
            void signOut().finally(clearLocalAuth);
          });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [bootstrap, clearLocalAuth]);

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
