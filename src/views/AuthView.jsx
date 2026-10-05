import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  KeyRound, 
  ArrowRight, 
  Zap,
  Car,
  Navigation,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function AuthView({ onLoginSuccess }) {
  const { setCurrentUser, addNotification } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('passenger'); // 'passenger' | 'driver' | 'admin'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const lowerEmail = email.toLowerCase().trim();

    // Check if user exists in localStorage database
    const savedDb = localStorage.getItem('carpool_users_db');
    const usersDb = savedDb ? JSON.parse(savedDb) : {};

    let userToLog = usersDb[lowerEmail];

    if (!userToLog) {
      // Create new user profile with email & password
      const derivedName = lowerEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const emailDomain = lowerEmail.split('@')[1] || 'enterprise.com';
      const companyTitle = emailDomain.split('.')[0].toUpperCase() + ' Corp';

      userToLog = {
        id: `usr-${Date.now()}`,
        name: derivedName,
        email: lowerEmail,
        password,
        role: selectedRole,
        age: 28,
        phone: '+91 98765 43210',
        gender: 'Prefer not to say',
        orgName: companyTitle,
        avatar: selectedRole === 'driver'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        walletBalance: 500.00,
        city: 'Pune / Bengaluru'
      };

      // Store in users database
      usersDb[lowerEmail] = userToLog;
      localStorage.setItem('carpool_users_db', JSON.stringify(usersDb));
      addNotification(`✨ Created new account for ${lowerEmail}! Update your profile details anytime.`);
    } else {
      addNotification(`Welcome back, ${userToLog.name}! Restored saved profile.`);
    }

    setCurrentUser(userToLog);
    if (onLoginSuccess) onLoginSuccess(userToLog);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 -mt-24 -ml-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -mb-24 -mr-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-teal-400" /> Enterprise Mobility Portal
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-tight">
            Enterprise <span className="text-teal-400 font-semibold">Carpool</span>
          </h1>
          <p className="text-xs text-slate-400">Sign in with Email & Password to access your carpool account</p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
          {[
            { id: 'passenger', label: 'Passenger', icon: Navigation, desc: 'Find Rides' },
            { id: 'driver', label: 'Driver', icon: Car, desc: 'Offer Rides' },
            { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Manage Org' }
          ].map(r => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`py-2.5 px-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold shadow-lg shadow-purple-950/60 scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-xs font-bold leading-tight">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* LOGIN FORM CARD (ONLY EMAIL & PASSWORD REQUIRED) */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 space-y-6 shadow-2xl animate-in fade-in">
          
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-400" /> Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your email and password to log in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. alex@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input font-medium"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p>🔒 <strong>Account Memory Active</strong>: Your profile (Name, Age, Phone, Vehicles & Wallet Balance) is saved permanently under your email!</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Sign In with Email & Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
