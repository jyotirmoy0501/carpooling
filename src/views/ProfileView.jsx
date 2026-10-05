import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  Car, 
  Heart, 
  Sparkles,
  Save
} from 'lucide-react';

export default function ProfileView() {
  const { currentUser, setCurrentUser, addNotification } = useApp();

  const [fullName, setFullName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [age, setAge] = useState(currentUser.age || 28);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [gender, setGender] = useState(currentUser.gender || 'Prefer not to say');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser.emergencyPhone || '+91 98123 45678');
  const [city, setCity] = useState(currentUser.city || 'Pune / Bengaluru');
  const [bio, setBio] = useState(currentUser.bio || 'Daily tech commute carpooler. Looking for safe, punctual shared rides.');
  const [role, setRole] = useState(currentUser.role || 'passenger');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...currentUser,
      name: fullName,
      email,
      age: Number(age),
      phone,
      gender,
      emergencyPhone,
      city,
      bio,
      role
    };

    setCurrentUser(updatedUser);

    // Save to user database in localStorage
    const savedDb = localStorage.getItem('carpool_users_db');
    const usersDb = savedDb ? JSON.parse(savedDb) : {};
    usersDb[email.toLowerCase()] = updatedUser;
    localStorage.setItem('carpool_users_db', JSON.stringify(usersDb));

    setSuccessMsg('✅ Profile updated successfully! All details saved permanently.');
    addNotification(`👤 Profile saved for ${fullName}`);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-teal-400" /> User Profile & Account Settings
        </h1>
        <p className="text-xs text-slate-400">Manage your personal information, age, mobile phone number, emergency contacts, and commute profile</p>
      </div>

      {/* SUCCESS TOAST */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* PROFILE FORM PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary (1 Col) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-5 text-center flex flex-col items-center justify-between">
          <div className="space-y-3">
            <div className="relative inline-block">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/50 shadow-2xl mx-auto"
              />
              <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{fullName || 'Corporate User'}</h2>
              <p className="text-xs text-slate-400">{email}</p>
              <span className="inline-block mt-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold px-3 py-0.5 rounded-full capitalize">
                {role} Mode
              </span>
            </div>
          </div>

          <div className="w-full space-y-2 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mobile Phone</span>
              <span className="font-bold text-white">{phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Age</span>
              <span className="font-bold text-teal-400">{age} Years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Wallet Balance</span>
              <span className="font-bold text-amber-300">₹{currentUser.walletBalance?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Company</span>
              <span className="font-bold text-purple-300">{currentUser.orgName}</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form (2 Cols) */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-5">
          
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-purple-400" /> Personal Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input bg-slate-950/60"
                  required
                  readOnly
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Age (Years)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input font-bold"
                  required
                />
              </div>
            </div>

            {/* Mobile Phone Number */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mobile Phone Number (+91)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input font-bold"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input bg-slate-900 text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Emergency Contact Number</label>
              <div className="relative">
                <Heart className="w-4 h-4 text-red-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  placeholder="+91 98123 45678"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>

            {/* Residence City / Area */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Residence City / Landmark</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Pune / Bengaluru"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>

            {/* Preferred Primary Role */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Primary Mobility Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input bg-slate-900 text-xs"
              >
                <option value="passenger">Passenger (Find Rides)</option>
                <option value="driver">Driver (Offer Rides)</option>
                <option value="admin">Company Administrator</option>
              </select>
            </div>

          </div>

          {/* Bio / Commute Notes */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">Commute Bio / Preferences</label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-3 rounded-xl glass-input"
              placeholder="Tell co-riders about your commute habits..."
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" /> Save Profile & Update Account Settings
          </button>

        </form>

      </div>

    </div>
  );
}
