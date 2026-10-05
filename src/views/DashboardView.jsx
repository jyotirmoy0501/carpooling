import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  Search, 
  PlusCircle, 
  MapPin, 
  Wallet, 
  Leaf, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock,
  Zap,
  Users,
  BellRing,
  IndianRupee,
  Compass,
  KeyRound,
  ShieldCheck,
  Radio,
  CheckCircle2,
  XCircle,
  Phone,
  Check,
  UserCheck,
  Navigation
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import AdminView from './AdminView';
import ShareRideModal from '../components/ShareRideModal';
import { Share2 } from 'lucide-react';

export default function DashboardView() {
  const { 
    currentUser, 
    vehicles,
    rides, 
    trips, 
    setActiveView, 
    bookRide, 
    acceptRideRequest,
    declineRideRequest,
    updateTripStatus,
    setIsAICopilotOpen,
    nearbyDriverAlert,
    setNearbyDriverAlert,
    isDriverOnline,
    setIsDriverOnline,
    addNotification
  } = useApp();

  // OTP Verification state for Driver Dashboard
  const [inputOtp, setInputOtp] = useState('');
  const [verifyingTripId, setVerifyingTripId] = useState(null);
  const [sharingRideModal, setSharingRideModal] = useState(null);

  // Unconditional Admin Routing: Admins see the clean Admin Panel directly
  if (currentUser?.role === 'admin') {
    return <AdminView />;
  }

  // Determine if logged in user is a Driver or Passenger
  const isDriverRole = currentUser?.role === 'driver';

  // Driver metrics
  const driverVehicles = vehicles.filter(v => v.driverId === currentUser.id);
  const driverTrips = trips.filter(t => t.driverId === currentUser.id);
  const completedDriverTrips = driverTrips.filter(t => t.tripStatus === 'Completed');
  const totalDriverEarnings = completedDriverTrips.reduce((sum, t) => sum + (t.fareTotal || 0), 0);

  // Passenger metrics (100% REAL based on passenger's actual trips)
  const passengerTrips = trips.filter(t => t.passengerId === currentUser.id);
  const completedPassengerTrips = passengerTrips.filter(t => t.tripStatus === 'Completed');
  const totalDistanceKm = completedPassengerTrips.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
  const co2SavedKg = Math.round(totalDistanceKm * 0.22);
  const carsOffRoad = completedPassengerTrips.length > 0 ? Math.max(1, Math.round(completedPassengerTrips.length * 1.5)) : 0;

  // Driver specific trips
  const incomingPassengerRequests = trips.filter(t => t.driverId === currentUser.id && t.tripStatus === 'Pending Approval');
  const confirmedBookedTrips = trips.filter(t => t.driverId === currentUser.id && t.tripStatus === 'Booked');

  const activeRides = rides.slice(0, 3);

  const handleVerifyOtpAndStart = (tripObj) => {
    if (inputOtp.trim() === tripObj.otpCode) {
      updateTripStatus(tripObj.id, 'In Transit');
      setVerifyingTripId(null);
      setInputOtp('');
      addNotification(`✅ 4-Digit OTP Verified! Starting ride for ${tripObj.passengerName}.`);
      setActiveView('live-tracking');
    } else {
      alert(`Invalid OTP Code! Passenger's correct OTP is: ${tripObj.otpCode}`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 20 KM NEARBY PASSENGER POPUP ALERT FOR DRIVERS */}
      {nearbyDriverAlert && isDriverRole && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/50 bg-amber-950/40 text-amber-100 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2">
              <BellRing className="w-6 h-6 text-amber-400 animate-bounce" />
              <h3 className="font-extrabold text-white text-base">Nearby Passenger Commute Request (Within 20 km Radius)!</h3>
            </div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black px-3 py-1 rounded-full">
              📍 14.8 km Proximity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-300 font-bold">Passenger Name: <span className="text-white">{nearbyDriverAlert.passengerName}</span></p>
              <p className="text-slate-300">📍 <strong>Pickup:</strong> {nearbyDriverAlert.pickupLocation}</p>
              <p className="text-slate-300">🏁 <strong>Destination:</strong> {nearbyDriverAlert.dropLocation}</p>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Passenger Offered Money</span>
                <span className="text-2xl font-black text-teal-400">₹{nearbyDriverAlert.offeredFare}</span>
                <span className="text-[10px] text-slate-400"> / seat</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addNotification(`✅ Offer accepted! Navigating to Offer Ride view for ${nearbyDriverAlert.passengerName}.`);
                    setNearbyDriverAlert(null);
                    setActiveView('offer');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-lg"
                >
                  Offer Ride to Passenger (₹{nearbyDriverAlert.offeredFare})
                </button>

                <button
                  onClick={() => setNearbyDriverAlert(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔴 DRIVER DASHBOARD (For Registered Drivers) */}
      {/* ========================================================================= */}
      {isDriverRole ? (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Driver Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-10 border border-purple-500/30 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                  <Car className="w-3.5 h-3.5 text-teal-400" /> Driver Console
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <Radio className={`w-3.5 h-3.5 ${isDriverOnline ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                  {isDriverOnline ? '🟢 ONLINE (Accepting Requests)' : '🔴 OFFLINE'}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Driver Console, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-teal-300 to-emerald-300">{currentUser.name}</span>
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed">
                Set your pickup location zone, verify passenger 4-digit OTP PINs, receive ride dispatch requests & enjoy <span className="font-bold text-emerald-300">0% platform commission</span>.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveView('offer')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-950/60 transition-all transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4" /> + Set Pickup Zone & Offer Seats
                </button>

                <button
                  onClick={() => setIsDriverOnline(!isDriverOnline)}
                  className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm border transition-all ${
                    isDriverOnline 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isDriverOnline ? '🟢 Online (Click to go Offline)' : '🔴 Offline (Click to go Online)'}
                </button>

                <button
                  onClick={() => setActiveView('vehicles')}
                  className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-semibold transition-all"
                >
                  🚘 Manage My Vehicles ({driverVehicles.length})
                </button>
              </div>
            </div>
          </div>

          {/* DRIVER STATS & EARNINGS METRICS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-300 text-xs mb-2">
                <span className="font-bold">Driver Earnings (₹)</span>
                <IndianRupee className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">₹{totalDriverEarnings.toFixed(2)}</div>
              <p className="text-[11px] text-emerald-300 mt-1">100% Payout (0% Commission)</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Trips Completed</span>
                <Car className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white">{completedDriverTrips.length}</div>
              <p className="text-[11px] text-purple-300 mt-1">Successful Commutes</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Driver Rating</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-300">★ {currentUser.rating || 5.0}</div>
              <p className="text-[11px] text-amber-400/90 mt-1">Top Rated Driver</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Driver Wallet</span>
                <Wallet className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-3xl font-bold text-teal-300">₹{currentUser.walletBalance?.toFixed(2)}</div>
              <button 
                onClick={() => setActiveView('wallet')}
                className="text-[11px] text-teal-300 hover:underline mt-1 block font-semibold"
              >
                Withdraw & Top-Up &rarr;
              </button>
            </div>
          </div>

          {/* CONFIRMED BOOKED TRIPS: OTP VERIFICATION */}
          {confirmedBookedTrips.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" /> Confirmed Passengers: Enter 4-Digit OTP to Start Ride
                </h3>
                <span className="text-xs font-bold text-emerald-300">Action Required</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {confirmedBookedTrips.map(t => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <p className="font-bold text-white text-sm">{t.passengerName}</p>
                        <p className="text-teal-400 text-[11px] font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Mob: {t.passengerPhone || '+91 98765 43210'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-400">₹{t.fareTotal}</span>
                        <span className="text-[10px] text-slate-400 block">{t.seatsBooked} seat(s)</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <p>📍 <strong>Pickup:</strong> {t.pickupLocation}</p>
                      <p>🏁 <strong>Drop:</strong> {t.dropLocation}</p>
                    </div>

                    {/* OTP INPUT VERIFICATION & SHARE RIDE BUTTON */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-amber-300">Enter Passenger's 4-Digit OTP PIN:</label>
                        <button
                          onClick={() => setSharingRideModal(t)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Share2 className="w-3 h-3 text-teal-400" /> Share Ride
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="e.g. 4892"
                          value={verifyingTripId === t.id ? inputOtp : ''}
                          onChange={e => {
                            setVerifyingTripId(t.id);
                            setInputOtp(e.target.value);
                          }}
                          className="w-28 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold text-center text-sm"
                        />
                        <button
                          onClick={() => handleVerifyOtpAndStart(t)}
                          className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verify & Start Trip
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INCOMING PASSENGER RIDE REQUESTS */}
          {incomingPassengerRequests.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-amber-950/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-amber-400 animate-bounce" /> Incoming Passenger Ride Requests ({incomingPassengerRequests.length})
                </h3>
                <span className="text-xs font-bold text-amber-300">Dispatch Queue</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingPassengerRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <p className="font-bold text-white text-sm">{req.passengerName}</p>
                        <p className="text-teal-400 text-[11px] font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Mob: {req.passengerPhone || '+91 98765 43210'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-amber-300">₹{req.fareTotal}</span>
                        <span className="text-[10px] text-slate-400 block">{req.seatsBooked} seat(s)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <p>📍 <strong>Passenger Pickup:</strong> {req.pickupLocation}</p>
                      <p>🏁 <strong>Passenger Destination:</strong> {req.dropLocation}</p>
                      <p>💳 <strong>Payment Method:</strong> {req.paymentMethod}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => acceptRideRequest(req.id)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept Passenger Request (₹{req.fareTotal})
                      </button>

                      <button
                        onClick={() => declineRideRequest(req.id)}
                        className="py-2.5 px-3 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DRIVER ACTIVE ROUTE MAP & CORRIDORS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-700/70 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-teal-400" /> Driver Active Route & Pickup Area Map
                </h3>
                <button onClick={() => setActiveView('live-tracking')} className="text-xs text-teal-400 hover:underline">
                  Full Screen GPS &rarr;
                </button>
              </div>

              <LiveMap 
                pickupCoords={[18.5912, 73.7389]}
                dropCoords={[18.5362, 73.8940]}
                height="280px"
              />
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-700/70 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-purple-400" /> Registered Vehicles & Status
              </h3>

              <div className="space-y-3">
                {driverVehicles.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-slate-400">No vehicles registered under your driver account.</p>
                    <button onClick={() => setActiveView('vehicles')} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
                      + Add Vehicle Now
                    </button>
                  </div>
                ) : (
                  driverVehicles.map(v => (
                    <div key={v.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{v.model}</span>
                        <span className="text-[10px] text-teal-300 font-bold bg-teal-500/20 px-2 py-0.5 rounded-full">
                          {v.fuelType}
                        </span>
                      </div>
                      <p className="text-slate-400">Reg: {v.regNumber} • {v.capacity} Seats</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setActiveView('offer')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                + Publish New Route as Driver
              </button>
            </div>
          </div>

        </div>
      ) : (
        
        /* ========================================================================= */
        /* 🚶 PASSENGER DASHBOARD (For Commuters / Passengers) */
        /* ========================================================================= */
        <div className="space-y-8 animate-in fade-in">
          
          {/* Passenger Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/90 via-slate-900 to-teal-950 p-6 sm:p-10 border border-purple-500/20 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Passenger Commute Hub
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-400">{currentUser.name}</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Search pickup location drivers, set fare offers (₹), verify 4-digit OTP PINs, and control urban carbon pollution.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveView('find')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-950/50 transition-all transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" /> 🚕 Search Drivers by Pickup Location
                </button>

                <button
                  onClick={() => setIsAICopilotOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-semibold transition-all"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" /> AI Pricing Copilot
                </button>
              </div>
            </div>
          </div>

          {/* PASSENGER METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Completed Carpools</span>
                <Car className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{completedPassengerTrips.length}</div>
              <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Shared Commutes
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Traffic Reduction</span>
                <Users className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-teal-300">{carsOffRoad} <span className="text-xs font-normal text-slate-400">vehicles off road</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Single-occupancy cars reduced</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>CO₂ Emissions Prevented</span>
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{co2SavedKg} <span className="text-xs font-normal text-slate-400">kg</span></div>
              <p className="text-[11px] text-emerald-300 mt-1">~{co2SavedKg > 0 ? Math.round(co2SavedKg / 20) : 0} Trees planted equivalent</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-700/70">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Wallet Balance</span>
                <Wallet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-300">₹{currentUser.walletBalance?.toFixed(2)}</div>
              <button 
                onClick={() => setActiveView('wallet')}
                className="text-[11px] text-purple-300 hover:text-purple-200 underline mt-1 block font-semibold"
              >
                UPI Top-Up & Transactions &rarr;
              </button>
            </div>
          </div>

          {/* ACTIVE RIDES & GPS MAP */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-700/70 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" /> CartoDB Live Route Map
                </h3>
                <button onClick={() => setActiveView('live-tracking')} className="text-xs text-teal-400 hover:underline">
                  Expand Live GPS &rarr;
                </button>
              </div>

              <LiveMap 
                pickupCoords={[18.5912, 73.7389]}
                dropCoords={[18.5362, 73.8940]}
                height="280px"
              />
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-700/70 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> Active & Recent Trips
              </h3>

              <div className="space-y-3">
                {passengerTrips.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No active trips found. Search for a ride to get started!</p>
                ) : (
                  passengerTrips.map(trip => (
                    <div key={trip.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Trip #{trip.id.slice(-4)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          trip.tripStatus === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {trip.tripStatus}
                        </span>
                      </div>

                      <p className="text-slate-300 truncate font-medium">To: {trip.dropLocation}</p>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Driver: {trip.driverName}</span>
                        <span className="font-bold text-white">₹{trip.fareTotal?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setActiveView('my-trips')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Manage All Trips & Receipts
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SHARE RIDE CORRIDOR MODAL */}
      {sharingRideModal && (
        <ShareRideModal 
          ride={sharingRideModal} 
          onClose={() => setSharingRideModal(null)} 
        />
      )}

    </div>
  );
}
