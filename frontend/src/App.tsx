import React, { useState } from 'react';
import { DemoBanner } from './components/DemoBanner';
import { Sidebar } from './components/Sidebar';
import { RequestDrawer } from './components/RequestDrawer';
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

export function App() {
  const [currentRole, setCurrentRole] = useState<'user' | 'admin'>('user');
  const [currentPage, setCurrentPage] = useState<string>('landing');
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

  const handleSwitchRole = (role: 'user' | 'admin') => {
    setCurrentRole(role);
    if (currentPage === 'landing') return;
    if (role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('user-dashboard');
    }
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
  };

  const handleResetData = () => {
    setResetNonce(prev => prev + 1);
    setTrackedRequestId('WW1042');
    if (currentRole === 'user') {
      handleNavigate('user-dashboard');
    } else {
      handleNavigate('admin-dashboard');
    }
  };

  // If on landing page, display full-width landing view
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <DemoBanner
          currentRole={currentRole}
          onSwitchRole={handleSwitchRole}
          onReset={handleResetData}
        />
        <LandingPage
          onNavigate={handleNavigate}
          onSelectRole={(role) => {
            setCurrentRole(role);
          }}
        />
      </div>
    );
  }

  return (
    <div key={resetNonce} className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* Top Demo Banner for Hackathon Jury */}
      <DemoBanner
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onReset={handleResetData}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Responsive Sidebar */}
        <Sidebar
          currentRole={currentRole}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSwitchRole={handleSwitchRole}
        />

        {/* Main Application Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-7">
          {/* USER / CITIZEN ROUTES */}
          {currentRole === 'user' && (
            <>
              {currentPage === 'user-dashboard' && (
                <UserDashboard
                  onNavigate={handleNavigate}
                  onTrackRequest={(id) => {
                    setTrackedRequestId(id);
                    handleNavigate('track-pickup');
                  }}
                />
              )}

              {currentPage === 'triage' && (
                <WasteTriagePage
                  onSchedulePickup={(prefill) => {
                    setTriagePrefill(prefill);
                    handleNavigate('schedule-pickup');
                  }}
                />
              )}

              {currentPage === 'schedule-pickup' && (
                <SchedulePickupPage
                  initialData={triagePrefill}
                  onSuccess={(created) => {
                    setTrackedRequestId(created.id);
                    handleNavigate('track-pickup');
                  }}
                  onCancel={() => handleNavigate('user-dashboard')}
                />
              )}

              {currentPage === 'track-pickup' && (
                <TrackPickupPage
                  initialRequestId={trackedRequestId}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'user-requests' && (
                <UserRequestsPage
                  onNavigate={handleNavigate}
                  onTrackRequest={(id) => {
                    setTrackedRequestId(id);
                    handleNavigate('track-pickup');
                  }}
                />
              )}

              {currentPage === 'user-history' && (
                <UserHistoryPage
                  onTrackRequest={(id) => {
                    setTrackedRequestId(id);
                    handleNavigate('track-pickup');
                  }}
                />
              )}
            </>
          )}

          {/* ADMIN / OPERATIONS ROUTES */}
          {currentRole === 'admin' && (
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
                <AdminRequestsPage
                  onOpenDrawer={handleOpenDrawer}
                />
              )}

              {currentPage === 'admin-batches' && (
                <BatchesPage
                  onOpenRequestById={(id) => {
                    api.getRequestById(id).then(req => {
                      if (req) handleOpenDrawer(req);
                    });
                  }}
                />
              )}

              {currentPage === 'admin-analytics' && (
                <AnalyticsPage />
              )}
            </>
          )}
        </main>
      </div>

      {/* Slide-Out Request Inspection Drawer */}
      <RequestDrawer
        request={drawerRequest}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default App;
