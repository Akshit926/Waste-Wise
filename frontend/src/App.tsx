import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DemoBanner } from './components/DemoBanner';
import { AppHeader } from './components/AppHeader';
import { Sidebar } from './components/Sidebar';
import { RequestDrawer } from './components/RequestDrawer';
import { ToastContainer } from './components/Toast';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccessRestrictedPage } from './pages/AccessRestrictedPage';
import { ProfilePage } from './pages/ProfilePage';
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { WasteTriagePage } from './pages/WasteTriagePage';
import { SchedulePickupPage } from './pages/SchedulePickupPage';
import { TrackPickupPage } from './pages/TrackPickupPage';
import { UserRequestsPage } from './pages/UserRequestsPage';
import { UserHistoryPage } from './pages/UserHistoryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SmartQueuePage } from './pages/SmartQueuePage';
import { AdminRequestsPage } from './pages/AdminRequestsPage';
import { BatchesPage } from './pages/BatchesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PickupRequest, RequestStatus, WasteCategory } from './types';
import { api } from './services/api';

// Route access rules
const CITIZEN_ROUTES = new Set([
  'user-dashboard', 'triage', 'schedule-pickup', 'track-pickup',
  'user-requests', 'user-history', 'profile'
]);
const ADMIN_ROUTES = new Set([
  'admin-dashboard', 'admin-queue', 'admin-requests',
  'admin-batches', 'admin-analytics', 'profile'
]);

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'info';
  action?: { label: string; onClick: () => void };
}

// Inner app — rendered only when authenticated
function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const [activeRole, setActiveRole] = useState<'citizen' | 'admin'>(user!.role);

  const [currentPage, setCurrentPage] = useState<string>(
    user!.role === 'admin' ? 'admin-dashboard' : 'user-dashboard'
  );
  const [trackedRequestId, setTrackedRequestId] = useState<string | null>('WW1042');
  const [triagePrefill, setTriagePrefill] = useState<{
    category?: WasteCategory;
    items_description?: string;
    special_handling?: boolean;
    guidance?: string;
  } | undefined>(undefined);
  const [drawerRequest, setDrawerRequest] = useState<PickupRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync role if auth user changes
  React.useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
      setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
    }
  }, [user?.role]);

  const addToast = useCallback((msg: string, type?: 'success' | 'warning' | 'info', action?: { label: string; onClick: () => void }) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message: msg, type: type || 'success', action }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSwitchRole = (newRole: 'user' | 'admin') => {
    const targetRole = newRole === 'admin' ? 'admin' : 'citizen';
    setActiveRole(targetRole);
    if (targetRole === 'admin') setCurrentPage('admin-dashboard');
    else setCurrentPage('user-dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDrawer = (req: PickupRequest) => {
    setDrawerRequest(req);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerRequest(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: RequestStatus, notes?: string) => {
    const updated = await api.updateStatus(id, newStatus, notes);
    if (updated && drawerRequest && drawerRequest.id === id) {
      setDrawerRequest(updated);
    }
    addToast(`Request ${id} status updated to ${newStatus}. Citizen tracking has been updated.`, 'success');
  };

  const handleResetData = () => {
    setResetNonce(prev => prev + 1);
    setTrackedRequestId('WW1042');
    setCurrentPage(activeRole === 'admin' ? 'admin-dashboard' : 'user-dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  // Role-based route protection
  const isRouteAllowed = (page: string): boolean => {
    if (activeRole === 'citizen') return CITIZEN_ROUTES.has(page);
    if (activeRole === 'admin') return ADMIN_ROUTES.has(page);
    return false;
  };

  // Check if current page is restricted
  const isRestricted = currentPage !== 'landing' && !isRouteAllowed(currentPage);

  return (
    <NotificationProvider role={activeRole}>
      <div key={resetNonce} className="min-h-screen bg-[#F4F6F4] flex flex-col font-sans">
        {/* Hackathon Jury Demo Banner — keeps the role switcher for judges */}
        <DemoBanner
          currentRole={activeRole === 'citizen' ? 'user' : 'admin'}
          onSwitchRole={handleSwitchRole}
          onReset={handleResetData}
        />

        {/* Authenticated App Header */}
        <AppHeader onNavigate={handleNavigate} onLogout={handleLogout} />

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentRole={activeRole === 'citizen' ? 'user' : 'admin'}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onSwitchRole={handleSwitchRole}
            userName={user!.name}
            userArea={user!.area}
          />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-7">
            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Access restricted guard */}
            {isRestricted ? (
              <AccessRestrictedPage onReturn={() => handleNavigate(activeRole === 'admin' ? 'admin-dashboard' : 'user-dashboard')} />
            ) : (
              <>
                {/* CITIZEN ROUTES */}
                {activeRole === 'citizen' && (
                  <>
                    {currentPage === 'user-dashboard' && (
                      <UserDashboard
                        onNavigate={handleNavigate}
                        onTrackRequest={(id) => { setTrackedRequestId(id); handleNavigate('track-pickup'); }}
                      />
                    )}
                    {currentPage === 'triage' && (
                      <WasteTriagePage
                        onSchedulePickup={(prefill) => { setTriagePrefill(prefill); handleNavigate('schedule-pickup'); }}
                      />
                    )}
                    {currentPage === 'schedule-pickup' && (
                      <SchedulePickupPage
                        initialData={triagePrefill}
                        onSuccess={(created) => {
                          setTrackedRequestId(created.id);
                          addToast(
                            `Pickup request created · #${created.id} · Your collection has been scheduled.`,
                            'success',
                            { label: 'Track →', onClick: () => { setTrackedRequestId(created.id); handleNavigate('track-pickup'); } }
                          );
                          handleNavigate('track-pickup');
                        }}
                        onCancel={() => handleNavigate('user-dashboard')}
                      />
                    )}
                    {currentPage === 'track-pickup' && (
                      <TrackPickupPage
                        initialRequestId={trackedRequestId}
                        onNavigate={handleNavigate}
                        onToast={addToast}
                      />
                    )}
                    {currentPage === 'user-requests' && (
                      <UserRequestsPage
                        onNavigate={handleNavigate}
                        onTrackRequest={(id) => { setTrackedRequestId(id); handleNavigate('track-pickup'); }}
                      />
                    )}
                    {currentPage === 'user-history' && (
                      <UserHistoryPage
                        onTrackRequest={(id) => { setTrackedRequestId(id); handleNavigate('track-pickup'); }}
                      />
                    )}
                    {currentPage === 'profile' && <ProfilePage />}
                  </>
                )}

                {/* ADMIN ROUTES */}
                {activeRole === 'admin' && (
                  <>
                    {currentPage === 'admin-dashboard' && (
                      <AdminDashboard
                        onNavigate={handleNavigate}
                        onOpenDrawer={handleOpenDrawer}
                      />
                    )}
                    {currentPage === 'admin-queue' && (
                      <SmartQueuePage
                        onOpenDrawer={handleOpenDrawer}
                        onNavigate={handleNavigate}
                      />
                    )}
                    {currentPage === 'admin-requests' && (
                      <AdminRequestsPage onOpenDrawer={handleOpenDrawer} />
                    )}
                    {currentPage === 'admin-batches' && (
                      <BatchesPage
                        onOpenRequestById={(id) => {
                          api.getRequestById(id).then(req => { if (req) handleOpenDrawer(req); });
                        }}
                      />
                    )}
                    {currentPage === 'admin-analytics' && <AnalyticsPage />}
                    {currentPage === 'profile' && <ProfilePage />}
                  </>
                )}
              </>
            )}
          </main>
        </div>

        {/* Request inspection drawer */}
        <RequestDrawer
          request={drawerRequest}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </NotificationProvider>
  );
}

// Root app — handles auth flow routing
function AppRouter() {
  const { isAuthenticated } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [showLanding, setShowLanding] = useState(true);

  // If not authenticated, show landing/login/register
  if (!isAuthenticated) {
    if (showLanding) {
      return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
          <LandingPage
            onNavigate={() => {
              setShowLanding(false);
              setAuthPage('login');
            }}
            onSelectRole={() => {
              setShowLanding(false);
              setAuthPage('login');
            }}
          />
        </div>
      );
    }

    if (authPage === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={() => { /* AuthContext handles redirect via isAuthenticated */ }}
          onNavigateLogin={() => setAuthPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={() => { /* AuthContext handles redirect via isAuthenticated */ }}
        onNavigateRegister={() => setAuthPage('register')}
      />
    );
  }

  return <AuthenticatedApp />;
}

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
