import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ChatModal from './components/ChatModal';
import AICopilotModal from './components/AICopilotModal';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import FindRideView from './views/FindRideView';
import OfferRideView from './views/OfferRideView';
import TripManagementView from './views/TripManagementView';
import LiveTrackingView from './views/LiveTrackingView';
import WalletView from './views/WalletView';
import VehiclesView from './views/VehiclesView';
import AnalyticsView from './views/AnalyticsView';
import SavedPlacesView from './views/SavedPlacesView';
import AdminView from './views/AdminView';
import ProfileView from './views/ProfileView';

function AppContent() {
  const { activeView, isAuthenticated, loginUser } = useApp();

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={(user) => loginUser(user)} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'find': return <FindRideView />;
      case 'offer': return <OfferRideView />;
      case 'my-trips': return <TripManagementView />;
      case 'live-tracking': return <LiveTrackingView />;
      case 'wallet': return <WalletView />;
      case 'vehicles': return <VehiclesView />;
      case 'analytics': return <AnalyticsView />;
      case 'saved-places': return <SavedPlacesView />;
      case 'admin': return <AdminView />;
      case 'profile': return <ProfileView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderView()}
      </main>

      {/* Global Modals */}
      <ChatModal />
      <AICopilotModal />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Enterprise Carpool Platform</span>
            <span>• Shared Mobility & Traffic Reduction</span>
          </div>
          <p>© 2026 Enterprise Carpooling Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
