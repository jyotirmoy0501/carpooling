import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  Search, 
  PlusCircle, 
  MapPin, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  ChevronDown,
  Navigation,
  Bookmark,
  LogOut,
  Building2,
  User
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    notifications,
    setIsAICopilotOpen,
    logoutUser
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  // Adapt Navigation Items strictly by logged in role
  const getRoleNavItems = () => {
    if (currentUser?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Car },
        { id: 'admin', label: 'Company Admin', icon: ShieldCheck },
        { id: 'analytics', label: 'Analytics & CO₂', icon: BarChart3 },
        { id: 'profile', label: 'My Profile', icon: User }
      ];
    }

    if (currentUser?.role === 'driver') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Car },
        { id: 'vehicles', label: 'Register Vehicle', icon: Car },
        { id: 'offer', label: 'Offer a Ride', icon: PlusCircle },
        { id: 'my-trips', label: 'Driver Trips', icon: Navigation },
        { id: 'live-tracking', label: 'Live Tracking', icon: MapPin },
        { id: 'profile', label: 'My Profile', icon: User }
      ];
    }

    // Default: Employee / Passenger
    return [
      { id: 'dashboard', label: 'Dashboard', icon: Car },
      { id: 'find', label: 'Find a Ride', icon: Search },
      { id: 'my-trips', label: 'My Trips', icon: Navigation },
      { id: 'live-tracking', label: 'Live Tracking', icon: MapPin },
      { id: 'wallet', label: 'Wallet & Pay', icon: Wallet },
      { id: 'profile', label: 'My Profile', icon: User }
    ];
  };

  const navItems = getRoleNavItems();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Role Pill */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-teal-500 flex items-center justify-center shadow-lg shadow-purple-950/50">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-sans">
                  EcoDrive <span className="text-teal-400 font-semibold">Carpool</span>
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-500/30 capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-400" /> {currentUser?.role || 'Commuter'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                🌐 Public Ride Sharing & Carpool Platform
              </p>
            </div>
          </div>

          {/* Center Role Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & State Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Copilot Trigger Button */}
            <button
              onClick={() => setIsAICopilotOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-purple-500/20 hover:from-teal-500/30 hover:to-purple-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold shadow-md glow-teal transition-all"
            >
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Copilot</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-slate-900 animate-ping" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl glass-panel p-3 shadow-2xl border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-teal-400" /> Notifications
                    </span>
                    <span className="text-[10px] text-slate-400">{notifications.length} total</span>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto mt-2">
                    {notifications.map(n => (
                      <div key={n.id} className="py-2 px-1 text-xs">
                        <p className="text-slate-200">{n.text}</p>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all text-left"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/50" 
                />
                <div className="hidden sm:block text-xs">
                  <div className="font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-teal-400 flex items-center gap-1 capitalize font-bold">
                    {currentUser.role} • ₹{currentUser.walletBalance?.toFixed(2)}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl glass-panel p-3 shadow-2xl border border-slate-700/80 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Logged In User Account
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs my-2 space-y-1">
                    <p className="font-bold text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                    <p className="text-[10px] text-teal-300">Phone: {currentUser.phone || '+91 98765 43210'}</p>
                    <p className="text-[10px] text-amber-300">Age: {currentUser.age || 28} Years</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/80 space-y-1">
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg text-teal-300 hover:bg-slate-800 text-xs font-semibold text-left flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" /> View & Edit Profile Settings
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg text-amber-300 hover:bg-amber-950/30 text-xs font-semibold text-left flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out to Login Screen
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="xl:hidden flex items-center gap-2 py-2 overflow-x-auto border-t border-slate-800 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
