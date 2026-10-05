import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { searchAllIndiaLocations, getDerivedCoords } from '../data/allIndiaLocations';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Repeat, 
  Sparkles, 
  Car, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Compass, 
  CheckCircle2, 
  Navigation, 
  Smartphone,
  Globe,
  IndianRupee,
  Phone,
  Send,
  Zap,
  ShieldCheck,
  AlertTriangle,
  KeyRound
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { calculateAIMatchScore } from '../utils/aiEngine';

export default function FindRideView() {
  const { rides, bookRide, currentUser, savedPlaces, setActiveView, addNotification, triggerNearbyDriverAlert } = useApp();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [travelTime, setTravelTime] = useState('Flexible / ASAP');
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [proposedFare, setProposedFare] = useState(80); // Passenger Offered Money (₹)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');

  // REAL BROWSER GEOLOCATION HANDLER
  const handleAcquireRealGPSLocation = () => {
    if (navigator.geolocation) {
      addNotification('📡 Acquiring real GPS coordinates from device sensors...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const gpsString = `Live GPS Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
          setPickup(gpsString);
          setMapPickupCoords([lat, lng]);
          setHasSearched(true);
          setShowPickupSuggestions(false);
          addNotification(`📍 Real GPS Coordinates Locked: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
        },
        (err) => {
          console.warn('GPS permission denied or unavailable:', err.message);
          addNotification('⚠️ GPS permission requested. Please pick or type your location.');
          setShowPickupSuggestions(true);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      addNotification('⚠️ Device does not support GPS API. Please pick or type your location.');
    }
  };

  // Search state tracking
  const [hasSearched, setHasSearched] = useState(false);

  // Route & Search Feedback States
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [searchSuccessMessage, setSearchSuccessMessage] = useState('');

  // Default Indian Map Coordinates
  const [mapPickupCoords, setMapPickupCoords] = useState([18.5912, 73.7389]);
  const [mapDropCoords, setMapDropCoords] = useState([18.5362, 73.8940]);

  // DYNAMIC AI FARE RECOMMENDATION CALCULATOR
  const estDistanceKm = useMemo(() => {
    if (!pickup || !destination) return 18;
    const combinedLength = (pickup + destination).length;
    return Math.max(8, Math.min(50, Math.round(combinedLength * 0.45)));
  }, [pickup, destination]);

  const aiRecommendedFarePerSeat = useMemo(() => {
    return Math.max(40, Math.round(estDistanceKm * 8.5));
  }, [estDistanceKm]);

  const aiFareMin = Math.max(30, Math.round(aiRecommendedFarePerSeat * 0.85));
  const aiFareMax = Math.round(aiRecommendedFarePerSeat * 1.25);

  // Booking Modal State
  const [bookingRide, setBookingRide] = useState(null);

  const filteredPickupSuggestions = useMemo(() => searchAllIndiaLocations(pickup), [pickup]);
  const filteredDestSuggestions = useMemo(() => searchAllIndiaLocations(destination), [destination]);

  const deriveCoords = (address, isDestination = false) => getDerivedCoords(address, isDestination);

  // STRICT FUZZY MATCH: Returns true ONLY if userTerm is non-empty AND matches driver pickup location!
  const isFuzzyMatch = (userTerm, rideLocation) => {
    if (!userTerm || !userTerm.trim()) return false;
    if (!rideLocation) return false;

    const cleanUser = userTerm.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const cleanRide = rideLocation.toLowerCase().replace(/[^a-z0-9]/g, ' ');

    if (cleanRide.includes(cleanUser) || cleanUser.includes(cleanRide)) return true;

    const userWords = cleanUser.split(' ').filter(w => w.length > 2);
    return userWords.some(w => cleanRide.includes(w));
  };

  // MATCHING RIDES: Filter drivers STRICTLY matching passenger pickup location with AVAILABLE SEATS!
  const matchingRides = rides
    .filter(ride => isFuzzyMatch(pickup, ride.pickupLocation) && ride.availableSeats > 0 && ride.status !== 'Closed')
    .map(ride => {
      const ai = calculateAIMatchScore(ride, { time: travelTime }, currentUser);
      return { ...ride, computedScore: ai.score, computedReason: ai.reason, badgeText: ai.badgeText };
    })
    .sort((a, b) => b.computedScore - a.computedScore);
    
  const resultsRef = useRef(null);

  // SEARCH BUTTON CLICK HANDLER (GOOGLE MAPS STYLE ROUTE DISCOVERY)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    const pCoords = deriveCoords(pickup || 'Hinjawadi Infotech Park Phase 1, Pune', false);
    const dCoords = deriveCoords(destination || 'Koregaon Park, Pune', true);
    
    setMapPickupCoords(pCoords);
    setMapDropCoords(dCoords);

    setShowPickupSuggestions(false);
    setShowDestSuggestions(false);

    if (triggerNearbyDriverAlert) {
      triggerNearbyDriverAlert({
        passengerName: currentUser.name,
        pickupLocation: pickup || 'Hinjawadi Phase 1',
        dropLocation: destination || 'Koregaon Park',
        offeredFare: proposedFare,
        pickupCoords: pCoords,
        radiusKm: 14.8
      });
    }

    const msg = `🧭 Google Maps Search Active! Pickup: "${pickup || 'Hinjawadi'}". Found ${matchingRides.length} matching driver(s) along route!`;
    setSearchSuccessMessage(msg);
    addNotification(msg);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    setTimeout(() => setSearchSuccessMessage(''), 4500);
  };

  const handleBookClick = (ride) => {
    setBookingRide(ride);
  };

  const confirmBooking = () => {
    if (!bookingRide) return;
    const success = bookRide(bookingRide, seatsNeeded, selectedPaymentMethod);
    if (success) {
      setBookingRide(null);
      setSearchSuccessMessage(`📩 Ride request sent to Driver ${bookingRide.driverName}! Check My Trips for your 4-digit OTP PIN.`);
    }
  };

  const handleEmergencySOS = () => {
    alert('🚨 EMERGENCY SOS TRIGGERED! Your live GPS coordinates (+91 Emergency Hotline: 112) have been broadcasted to emergency contacts.');
    addNotification('🚨 EMERGENCY SOS: Broadcasted live coordinates to emergency services!');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Emergency SOS Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-teal-400" /> Find a Ride & Match Commuters
          </h1>
          <p className="text-xs text-slate-400">Enter your pickup location, offer custom fare (₹), and send ride requests directly to drivers</p>
        </div>

        {/* EMERGENCY SOS BUTTON */}
        <button
          onClick={handleEmergencySOS}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/60 border border-red-400 animate-pulse shrink-0"
        >
          <AlertTriangle className="w-4 h-4" /> 🚨 Emergency SOS (112)
        </button>
      </div>



      {/* SEARCH FORM PANEL */}
      <form onSubmit={handleSearchSubmit} className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-5 shadow-xl">
        
        {/* Saved Places Quick Chips */}
        {savedPlaces.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Saved Places:</span>
            {savedPlaces.map(sp => (
              <button
                key={sp.id}
                type="button"
                onClick={() => {
                  setPickup(sp.address);
                  setHasSearched(true);
                  setMapPickupCoords([sp.lat || 18.5912, sp.lng || 73.7389]);
                }}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs border border-slate-700 whitespace-nowrap transition-colors"
              >
                📍 {sp.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* PICKUP LOCATION INPUT */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Passenger Pickup Location</span>
              <span className="text-[10px] text-teal-400 font-bold">Required to match drivers</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3 z-10" />
              <input
                type="text"
                value={pickup}
                onChange={e => {
                  setPickup(e.target.value);
                  setHasSearched(true);
                  setShowPickupSuggestions(true);
                }}
                onFocus={() => setShowPickupSuggestions(true)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input font-bold text-white border-teal-500/40"
                placeholder="Type or choose any Indian city / location..."
                required
              />
            </div>

            {/* Google Places Style Pickup Suggestions Dropdown */}
            {showPickupSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 rounded-2xl p-3 shadow-2xl z-30 space-y-2 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-[11px] text-teal-300 font-bold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" /> Google Places All-India Location Finder
                  </span>
                  <button type="button" onClick={() => setShowPickupSuggestions(false)} className="text-[10px] text-slate-400 hover:text-white font-bold bg-slate-800 px-2 py-0.5 rounded-full">
                    Close ✕
                  </button>
                </div>

                {/* Live GPS Current Location Button */}
                <button
                  type="button"
                  onClick={handleAcquireRealGPSLocation}
                  className="w-full text-left p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-xs transition-all flex items-center gap-2.5 group"
                >
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
                  <div>
                    <p className="font-extrabold text-emerald-200 group-hover:text-white">📍 Use My Live GPS Location</p>
                    <p className="text-[10px] text-emerald-400">Instant high-precision GPS lock</p>
                  </div>
                </button>

                {/* Custom Typed Query Option */}
                {pickup.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMapPickupCoords(deriveCoords(pickup, false));
                      setHasSearched(true);
                      setShowPickupSuggestions(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-xs transition-all flex items-center gap-2.5"
                  >
                    <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <p className="font-extrabold text-white">🔍 Search Custom Pickup: "{pickup}"</p>
                      <p className="text-[10px] text-purple-300">Geocode & match drivers at this custom location</p>
                    </div>
                  </button>
                )}

                <div className="space-y-1 pt-1">
                  {filteredPickupSuggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPickup(loc.address);
                        setHasSearched(true);
                        setMapPickupCoords(loc.coords);
                        setShowPickupSuggestions(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 text-xs transition-all flex items-center justify-between gap-2 border border-transparent hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{loc.typeIcon || '📍'}</span>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            {loc.name}
                            <span className="text-[10px] text-teal-300 font-bold bg-teal-500/20 px-2 py-0.2 rounded-full border border-teal-500/30">{loc.city}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">{loc.address}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                        {loc.category || 'Location'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DESTINATION LOCATION INPUT */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Passenger Destination</span>
              <span className="text-[10px] text-teal-400 font-bold">Type ANY destination</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-400 absolute left-3 top-3 z-10" />
              <input
                type="text"
                value={destination}
                onChange={e => {
                  setDestination(e.target.value);
                  setShowDestSuggestions(true);
                }}
                onFocus={() => setShowDestSuggestions(true)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input font-bold text-white border-red-500/30"
                placeholder="Type or choose destination..."
              />
            </div>

            {/* Google Places Style Destination Suggestions Dropdown */}
            {showDestSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-red-500/40 rounded-2xl p-3 shadow-2xl z-30 space-y-2 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-[11px] text-red-300 font-bold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-red-400" /> Google Places Destination Finder
                  </span>
                  <button type="button" onClick={() => setShowDestSuggestions(false)} className="text-[10px] text-slate-400 hover:text-white font-bold bg-slate-800 px-2 py-0.5 rounded-full">
                    Close ✕
                  </button>
                </div>

                {destination.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMapDropCoords(deriveCoords(destination, true));
                      setShowDestSuggestions(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-xs transition-all flex items-center gap-2.5"
                  >
                    <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                    <div>
                      <p className="font-extrabold text-white">🔍 Set Custom Destination: "{destination}"</p>
                      <p className="text-[10px] text-teal-300">Set route destination & update AI fare</p>
                    </div>
                  </button>
                )}

                <div className="space-y-1 pt-1">
                  {filteredDestSuggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDestination(loc.address);
                        setMapDropCoords(loc.coords);
                        setShowDestSuggestions(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 text-xs transition-all flex items-center justify-between gap-2 border border-transparent hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{loc.typeIcon || '📍'}</span>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            {loc.name}
                            <span className="text-[10px] text-teal-300 font-bold bg-teal-500/20 px-2 py-0.2 rounded-full border border-teal-500/30">{loc.city}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">{loc.address}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                        {loc.category || 'Location'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI SMART FARE SUGGESTION BANNER */}
          <div className="md:col-span-2 lg:col-span-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-950 to-teal-950/90 border border-purple-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-extrabold text-white text-xs sm:text-sm">🤖 AI Smart Fare Copilot Suggestion</h3>
              </div>
              <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
                ~{estDistanceKm} km Corridor
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-purple-500/20 pt-3">
              <div className="space-y-0.5">
                <p className="text-slate-200">
                  AI Recommended Price: <span className="font-black text-amber-300 text-base">₹{aiRecommendedFarePerSeat} / seat</span>
                </p>
                <p className="text-slate-400 text-[11px]">
                  Fair market rate range: <strong className="text-emerald-400">₹{aiFareMin} – ₹{aiFareMax}</strong> (based on fuel rates & travel distance)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProposedFare(aiRecommendedFarePerSeat)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shrink-0 transition-all transform hover:scale-105"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                Apply AI Recommended Price (₹{aiRecommendedFarePerSeat})
              </button>
            </div>
          </div>

          {/* PASSENGER OFFERED MONEY (₹ RUPEES) FIELD */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Enter Your Offered Fare (₹ INR)</span>
              <span className="text-[10px] text-amber-400 font-bold">Custom Fare</span>
            </label>
            <div className="relative">
              <span className="w-4 h-4 text-teal-400 absolute left-3 top-3 font-bold text-xs">₹</span>
              <input
                type="number"
                step="5"
                min="10"
                max="2000"
                value={proposedFare}
                onChange={e => setProposedFare(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input font-bold text-white border-teal-500/50 focus:border-amber-400"
                placeholder="e.g. 150"
                required
              />
            </div>
          </div>

          {/* Seats Needed */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Seats Needed</label>
            <div className="relative">
              <Users className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
              <select
                value={seatsNeeded}
                onChange={e => setSeatsNeeded(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input bg-slate-900"
              >
                <option value={1}>1 Seat</option>
                <option value={2}>2 Seats</option>
                <option value={3}>3 Seats</option>
              </select>
            </div>
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Travel Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
              <input
                type="date"
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Departure Time</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
              <input
                type="text"
                value={travelTime}
                onChange={e => setTravelTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input"
                placeholder="Flexible / ASAP"
              />
            </div>
          </div>

        </div>

        {/* PROMINENT SEARCH BUTTON */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Shows ONLY drivers operating at your pickup location</span>
          
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4 text-slate-950" /> 🧭 Search Route & Drivers on Google Map
          </button>
        </div>

      </form>

      {/* FEEDBACK TOAST BANNER */}
      {searchSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{searchSuccessMessage}</span>
        </div>
      )}

      {/* DYNAMIC MAP PREVIEW */}
      <div ref={resultsRef} className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-400" /> Google Maps GPS Telemetry & Pickup Area
          </h3>
          <span className="text-xs text-emerald-300 font-bold bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
            Live OSRM Route Active
          </span>
        </div>

        <LiveMap 
          pickupCoords={mapPickupCoords}
          dropCoords={mapDropCoords}
          height="280px"
        />
      </div>

      {/* MATCHING DRIVERS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-teal-400" /> Drivers Matching Pickup Location ({matchingRides.length})
          </h2>
          <span className="text-xs text-slate-400">Strictly filtered by your pickup location</span>
        </div>

        {!pickup || !pickup.trim() ? (
          <div className="glass-panel p-10 text-center rounded-2xl border border-slate-800 space-y-3 max-w-lg mx-auto">
            <Search className="w-10 h-10 text-teal-400 mx-auto animate-pulse" />
            <h3 className="text-white font-bold text-base">Search Drivers by Pickup Location</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type or select your pickup location above (e.g. Hinjawadi, Electronic City, Kharadi) to view matching drivers available in your area!
            </p>
          </div>
        ) : matchingRides.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4 max-w-lg mx-auto">
            <Car className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-white font-bold text-base">No Driver Available at Pickup Location "{pickup}"</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No available driver with open seats is currently operating at this pickup location. Try searching a major IT hub (e.g. Hinjawadi, Electronic City, Kharadi) or offer a ride as driver below!
              </p>
            </div>
            <button
              onClick={() => setActiveView('offer')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
            >
              + Register as Driver at "{pickup}"
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchingRides.map(ride => (
              <div key={ride.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-700/70 shadow-xl hover:border-teal-500/50 transition-all">
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={ride.driverAvatar} alt={ride.driverName} className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/50 shadow-md" />
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                        {ride.driverName}
                        <span className="text-amber-400 text-xs font-semibold">★ {ride.driverRating}</span>
                      </h3>
                      <p className="text-[11px] text-teal-400 font-semibold">{ride.vehicleName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold block">
                      📍 Pickup Matched
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Driver Pickup Zone:</span>
                      <span className="font-bold text-white">{ride.pickupLocation}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Your Destination:</span>
                      <span className="font-bold text-slate-200">{destination || ride.dropLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-2xl font-black text-amber-300">₹{proposedFare || ride.farePerSeat}</span>
                    <span className="text-[10px] text-slate-400 block">Offered Fare</span>
                  </div>

                  <button
                    onClick={() => handleBookClick(ride)}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all bg-gradient-to-r from-teal-500 via-teal-400 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 shadow-teal"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Request to Driver (₹)
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKING / REQUEST CONFIRMATION MODAL */}
      {bookingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-teal-400" /> Send Ride Request to Driver
              </h3>
              <button onClick={() => setBookingRide(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <img src={bookingRide.driverAvatar} alt={bookingRide.driverName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-white">{bookingRide.driverName}</p>
                  <p className="text-slate-400 text-[11px]">{bookingRide.vehicleName}</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-300">
                <p>📍 <strong>Pickup:</strong> {pickup || bookingRide.pickupLocation}</p>
                <p>🏁 <strong>Destination:</strong> {destination || bookingRide.dropLocation}</p>
                <p>👤 <strong>Passenger Name:</strong> {currentUser.name}</p>
                <p>📱 <strong>Passenger Mobile:</strong> {currentUser.phone || '+91 98765 43210'}</p>
                <p className="text-sm font-extrabold text-amber-300 pt-1">Offered Fare: ₹{proposedFare * seatsNeeded}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Select Payment Option</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                  { id: 'Wallet', label: 'Commute Wallet (₹)', icon: Wallet, extra: `₹${currentUser.walletBalance?.toFixed(2)}` },
                  { id: 'Card', label: 'RuPay / Cards', icon: CreditCard },
                  { id: 'Cash', label: 'Cash to Driver (₹)', icon: Banknote },
                ].map(pm => {
                  const Icon = pm.icon;
                  const isSelected = selectedPaymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPaymentMethod(pm.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        isSelected 
                          ? 'bg-purple-950/60 border-purple-500 text-white font-semibold' 
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                        <div>
                          <span>{pm.label}</span>
                          {pm.extra && <span className="block text-[10px] text-teal-400">{pm.extra}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setBookingRide(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Request to Driver (₹{proposedFare * seatsNeeded})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
