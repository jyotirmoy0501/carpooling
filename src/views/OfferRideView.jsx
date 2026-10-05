import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { searchAllIndiaLocations, getDerivedCoords } from '../data/allIndiaLocations';
import { 
  PlusCircle, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Lock,
  XCircle,
  Navigation,
  Phone,
  BellRing,
  Check,
  ShieldCheck,
  Zap,
  KeyRound,
  Radio
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { getAIFareRecommendation } from '../utils/aiEngine';
import ShareRideModal from '../components/ShareRideModal';
import { Share2 } from 'lucide-react';

export default function OfferRideView() {
  const { 
    currentUser, 
    vehicles, 
    rides, 
    setRides, 
    trips,
    publishRide, 
    acceptRideRequest,
    declineRideRequest,
    updateTripStatus,
    isDriverOnline,
    setIsDriverOnline,
    setActiveView, 
    addNotification 
  } = useApp();

  const userVehicles = vehicles.filter(v => v.driverId === currentUser.id);
  const driverActiveRides = rides.filter(r => r.driverId === currentUser.id && r.status !== 'Closed');

  // Pending Passenger Pickup Requests matching Driver
  const incomingPassengerRequests = trips.filter(t => t.driverId === currentUser.id && t.tripStatus === 'Pending Approval');
  
  // Confirmed Booked Trips waiting for OTP Verification to Start Journey
  const confirmedBookedTrips = trips.filter(t => t.driverId === currentUser.id && t.tripStatus === 'Booked');

  const [selectedVehicleId, setSelectedVehicleId] = useState(userVehicles[0]?.id || '');
  const [pickup, setPickup] = useState('Hinjawadi Phase 1, Rajiv Gandhi Tech Park, Pune');
  const [destination, setDestination] = useState('Flexible / Open for Pickups along route');
  const [rideCategory, setRideCategory] = useState('Economy Carpool');
  const [travelDate, setTravelDate] = useState('2026-08-15');
  const [travelTime, setTravelTime] = useState('Flexible / Open Time');
  const [availableSeats, setAvailableSeats] = useState(3);
  const [farePerSeat, setFarePerSeat] = useState(80); // INR ₹ Rupees
  const [distanceKm, setDistanceKm] = useState(16.5);
  const [aiPricingAdvice, setAiPricingAdvice] = useState('');

  // OTP Verification Input state for driver
  const [inputOtp, setInputOtp] = useState('');
  const [verifyingTripId, setVerifyingTripId] = useState(null);
  const [sharingRideModal, setSharingRideModal] = useState(null);

  const selectedVehicle = userVehicles.find(v => v.id === selectedVehicleId) || userVehicles[0];

  const handleAIPricingRecommend = () => {
    const rec = getAIFareRecommendation(distanceKm, selectedVehicle?.fuelType || 'Petrol');
    const inrFare = Math.round(rec.suggestedSeatFare * 10);
    setFarePerSeat(inrFare);
    setAiPricingAdvice(`🤖 AI Fare Suggestion: ₹${inrFare} per seat based on ${distanceKm} km distance & ${selectedVehicle?.fuelType || 'Petrol'} efficiency.`);
  };

  const handleCloseDestinationRoute = (rideId, dropLocation) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'Closed', availableSeats: 0 } : r));
    addNotification(`🔒 Destination '${dropLocation}' closed. Route completed and removed from passenger search!`);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      alert('Please register at least one vehicle before offering a ride!');
      setActiveView('vehicles');
      return;
    }

    publishRide({
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.model} (${selectedVehicle.regNumber})`,
      pickupLocation: pickup,
      pickupCoords: [18.5912, 73.7389],
      dropLocation: destination || 'Flexible / Open Route',
      dropCoords: [18.5362, 73.8940],
      date: travelDate,
      time: travelTime || 'Flexible Time',
      availableSeats: Number(availableSeats),
      totalSeats: selectedVehicle.capacity || 4,
      farePerSeat: Number(farePerSeat),
      distanceKm: Number(distanceKm),
      rideCategory
    });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Driver Online/Offline Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-purple-400" /> Driver Panel: Commute Dispatch & Requests
          </h1>
          <p className="text-xs text-slate-400">Set pickup zone, verify 4-digit OTP, receive passenger requests & enjoy 0% Platform Fee</p>
        </div>

        {/* DRIVER ONLINE / OFFLINE TOGGLE SWITCH */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-xl">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pl-1">
            <Radio className={`w-4 h-4 ${isDriverOnline ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            Driver Status:
          </span>

          <button
            onClick={() => setIsDriverOnline(!isDriverOnline)}
            className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
              isDriverOnline 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isDriverOnline ? '🟢 ONLINE (Accepting Rides)' : '🔴 OFFLINE'}
          </button>
        </div>
      </div>

      {/* ZERO COMMISSION BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 via-emerald-950/60 to-purple-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <span className="font-extrabold text-white text-sm block">0% Platform Commission Guarantee!</span>
            <p className="text-slate-300">You keep 100% of all passenger fares (₹). No hidden cuts or deductions.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] shrink-0">
          100% Fare Payout
        </span>
      </div>

      {/* CONFIRMED BOOKED TRIPS WAITING FOR OTP START */}
      {confirmedBookedTrips.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/30 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" /> Confirmed Bookings: Verify 4-Digit OTP to Start Ride
            </h3>
            <span className="text-xs font-bold text-emerald-300">Passenger OTP PIN Required</span>
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

                {/* OTP INPUT VERIFICATION */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="block text-[11px] font-bold text-amber-300">Enter Passenger's 4-Digit OTP PIN:</label>
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

      {/* INCOMING PASSENGER PICKUP REQUESTS */}
      {incomingPassengerRequests.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-amber-950/30 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-400 animate-bounce" /> Incoming Passenger Ride Requests ({incomingPassengerRequests.length})
            </h3>
            <span className="text-xs font-bold text-amber-300">Action Required</span>
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

                {/* ACCEPT / DECLINE BUTTONS */}
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

      {/* ACTIVE DRIVER ROUTES MANAGER */}
      {driverActiveRides.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-400" /> Active Driver Corridors ({driverActiveRides.length})
            </h3>
            <span className="text-[11px] text-teal-300 font-semibold">Live Passenger Visibility</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverActiveRides.map(ride => (
              <div key={ride.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{ride.vehicleName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ride.availableSeats > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {ride.availableSeats > 0 ? `${ride.availableSeats} Seats Available` : '🔒 Sold Out'}
                  </span>
                </div>

                <div className="space-y-1 text-slate-300">
                  <p>📍 <strong>Driver Pickup Area:</strong> {ride.pickupLocation}</p>
                  <p>🏁 <strong>Destination Policy:</strong> {ride.dropLocation}</p>
                  <p className="text-teal-400 font-extrabold">Base Fare: ₹{ride.farePerSeat} / seat</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setSharingRideModal(ride)}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Ride Corridor
                  </button>

                  <button
                    onClick={() => handleCloseDestinationRoute(ride.id, ride.dropLocation)}
                    className="py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md"
                    title="Close Route"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-400" /> Close Route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Vehicle Registered Warning Banner */}
      {userVehicles.length === 0 ? (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-amber-950/20 text-amber-200 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm">Vehicle Registration Required</h3>
            <p className="text-xs leading-relaxed">
              Before offering a ride, you must register at least one vehicle under your driver profile.
            </p>
            <button
              onClick={() => setActiveView('vehicles')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              + Register Vehicle Now
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Form Fields */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-5">
            
            {/* Vehicle Selection & Ride Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Registered Vehicle</label>
                <div className="relative">
                  <Car className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                  <select
                    value={selectedVehicleId}
                    onChange={e => setSelectedVehicleId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    {userVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.model} ({v.regNumber}) • {v.fuelType} • Capacity: {v.capacity} seats
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIDE CATEGORY */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ride Service Category</label>
                <select
                  value={rideCategory}
                  onChange={e => setRideCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl glass-input bg-slate-900"
                >
                  <option value="Economy Carpool">Economy Carpool (Sedan)</option>
                  <option value="SUV Share">SUV Share (6 Seater Premium)</option>
                  <option value="Eco Electric">Eco Electric (Zero Emissions)</option>
                  <option value="Auto Share">Auto Share / Green Commute</option>
                </select>
              </div>
            </div>

            {/* Pickup & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Driver Pickup Location</span>
                  <span className="text-[10px] text-teal-400 font-bold">Driver Pickup Zone</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    placeholder="e.g. Hinjawadi Phase 1, Pune / Electronic City Bengaluru"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Destination Policy</span>
                  <span className="text-[10px] text-teal-400">Flexible / Open for Passengers</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-red-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="Flexible / Open for Pickups along route"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>
            </div>

            {/* Travel Date & Flexible Time & Seats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Travel Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Departure Time</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={travelTime}
                    onChange={e => setTravelTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
                    placeholder="Flexible / Open Time"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Available Passenger Seats</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={1}
                    max={selectedVehicle?.capacity || 4}
                    value={availableSeats}
                    onChange={e => setAvailableSeats(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Base Fare per seat (₹ INR) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base Fare Per Seat (₹ Rupees)</label>
                  <div className="relative">
                    <span className="w-4 h-4 text-teal-400 absolute left-3 top-3 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      step="5"
                      value={farePerSeat}
                      onChange={e => setFarePerSeat(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input font-bold text-white"
                      placeholder="80"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAIPricingRecommend}
                  className="sm:mt-5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-purple-500/20 hover:from-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" /> AI Price Suggestion (₹)
                </button>
              </div>

              {aiPricingAdvice && (
                <p className="text-[11px] text-teal-300 bg-teal-950/40 p-2.5 rounded-lg border border-teal-500/30">
                  {aiPricingAdvice}
                </p>
              )}
            </div>

          </div>

          {/* Route Confirmation Map Preview */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" /> Pickup Zone GPS Map
            </h3>

            <LiveMap 
              pickupCoords={[18.5912, 73.7389]}
              dropCoords={[18.5362, 73.8940]}
              height="200px"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Set Pickup Zone as Free & Receive Passenger Requests (₹{farePerSeat}/seat)
          </button>

        </form>
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
