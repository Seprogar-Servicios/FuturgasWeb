import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { applySeo } from '../lib/seo';
import { fetchPublicSiteData } from '../services/publicContent';
import type { PublicSiteData } from '../types/content';
import { fallbackSiteData } from '../lib/fallbackContent';

type SiteDataContextValue = {
  data: PublicSiteData;
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  refresh: () => Promise<void>;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PublicSiteData>(fallbackSiteData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchPublicSiteData();
      setData(next);
      setUsingFallback(next === fallbackSiteData);
      applySeo(next.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar contenido');
      setData(fallbackSiteData);
      setUsingFallback(true);
      applySeo(fallbackSiteData.settings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ data, loading, error, usingFallback, refresh }),
    [data, loading, error, usingFallback, refresh]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData debe usarse dentro de SiteDataProvider');
  return ctx;
}
