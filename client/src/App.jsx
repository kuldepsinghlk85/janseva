import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import PublicHome from './pages/PublicHome';
import PublicTimelinePage from './pages/PublicTimelinePage';
import PublicLeadersPage from './pages/PublicLeadersPage';
import PublicSchemesPage from './pages/PublicSchemesPage';
import PublicWorksPage from './pages/PublicWorksPage';
import PublicTeamPage from './pages/PublicTeamPage';
import PublicConstituencyPage from './pages/PublicConstituencyPage';
import PublicSocialPage from './pages/PublicSocialPage';
import PublicJanSamvadPage from './pages/PublicJanSamvadPage';
import MobileAppWebView from './pages/MobileAppWebView';
import AdminLayout from './pages/AdminLayout';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

function AppContent() {
  const { viewMode, publicPage, toast } = useApp();

  const renderPublicContent = () => {
    switch (publicPage) {
      case 'mobile':
        return <MobileAppWebView />;
      case 'timeline':
        return <PublicTimelinePage />;
      case 'leaders':
        return <PublicLeadersPage />;
      case 'schemes':
        return <PublicSchemesPage />;
      case 'works':
        return <PublicWorksPage />;
      case 'team':
        return <PublicTeamPage />;
      case 'constituency':
        return <PublicConstituencyPage />;
      case 'social':
        return <PublicSocialPage />;
      case 'jan-samvad':
        return <PublicJanSamvadPage />;
      default:
        return <PublicHome />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] animate-slideIn">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center space-x-2.5 text-xs font-bold ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
            toast.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-300' :
            'bg-slate-900 text-white border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-orange-400 flex-shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {viewMode === 'admin' ? <AdminLayout /> : renderPublicContent()}
    </div>
  );
}

import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
