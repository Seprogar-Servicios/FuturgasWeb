import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { SiteDataProvider } from './contexts/SiteDataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const EditorPage = lazy(() => import('./pages/admin/EditorPage'));
const ServicesPage = lazy(() => import('./pages/admin/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'));
const TeamPage = lazy(() => import('./pages/admin/TeamPage'));
const MediaPage = lazy(() => import('./pages/admin/MediaPage'));
const NavigationPage = lazy(() => import('./pages/admin/NavigationPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/admin/ProfilePage'));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
      Cargando panel…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <SiteDataProvider>
                <HomePage />
              </SiteDataProvider>
            }
          />
          <Route
            path="/gestion/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/gestion"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="servicios" element={<ServicesPage />} />
            <Route path="obras" element={<ProjectsPage />} />
            <Route path="equipo" element={<TeamPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="navegacion" element={<NavigationPage />} />
            <Route path="configuracion" element={<SettingsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
