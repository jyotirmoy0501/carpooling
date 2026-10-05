import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Clock, 
  Navigation, 
  MessageSquare, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2,
  Star,
  Sparkles,
  AlertTriangle,
  Radio,
  Car
} from 'lucide-react';
import LiveMap from '../components/LiveMap';

export default function LiveTrackingView() {
  const { selectedTripId, setSelectedTripId, trips, updateTripStatus, setIsChatOpen, setActiveView, addNotification } = useApp();

  const trip = trips.find(t => t.id === selectedTripId) || trips.find(t => t.tripStatus === 'Booked' || t.tripStatus === 'In Transit') || null;

  // Journey active state: ONLY active when journey has started!
  const [isJourneyStarted, setIsJourneyStarted] = useState(() => {
    return trip?.tripStatus === 'In Transit' || trip?.tripStatus === 'Booked';
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(trip?.currentWaypointIndex || 1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [etaMins, setEtaMins] = useState(12);
  
  // Feedback & Rating Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('Great co-commute! Very punctual and clean car.');

  const routePoints = [
    [18.5912, 73.7389], // Hinjawadi Pickup
    [18.5750, 73.7800],
    [18.5600, 73.8200], // Live GPS Position
    [18.5450, 73.8600],
    [18.5362, 73.8940]  // Koregaon Park Drop
  ];

  // Animated Live GPS Movement interval when journey is active
  useEffect(() => {
    let interval = null;
    if (isJourneyStarted && isSimulating && currentStepIndex < routePoints.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          const next = prev + 1;
          setEtaMins(Math.max(1, (routePoints.length - next) * 3));
          if (next === routePoints.length - 1) {
            setIsSimulating(false);
            setShowFeedbackModal(true); // Automatically open rating feedback modal when arriving!
          }
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isJourneyStarted, isSimulating, currentStepIndex]);

  const currentCoords = routePoints[currentStepIndex];

  const handleStartJourney = () => {
    setIsJourneyStarted(true);
    setIsSimulating(true);
    if (trip) {
      updateTripStatus(trip.id, 'In Transit');
    }
    addNotification(`🚀 Journey started! Live GPS map and real-time telemetry activated.`);
  };

  // SUBMIT FEEDBACK & AUTOMATICALLY REMOVE LIVE TRACKING
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    if (trip) {
      updateTripStatus(trip.id, 'Completed');
    }

    addNotification(`⭐ Feedback submitted! Rated ${rating}/5 stars. Live tracking closed.`);
    
    setShowFeedbackModal(false);
    setSelectedTripId(null);
    setIsJourneyStarted(false);
    setActiveView('my-trips'); // Automatically remove live tracking and redirect to My Trips!
  };

  // IF NO TRIP OR JOURNEY NOT STARTED YET: SHOW INACTIVE STATE
  if (!trip || !isJourneyStarted) {
    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-400" /> Live GPS Tracking Center
          </h1>
          <p className="text-xs text-slate-400">Live GPS map & real-time telemetry activate strictly when a journey is started by driver</p>
        </div>

        {/* INACTIVE STATE PANEL */}
        <div className="glass-panel p-10 text-center rounded-3xl border border-slate-700/80 space-y-6 max-w-xl mx-auto shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Radio className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ⏸️ Live GPS Telemetry Standby
            </span>
            <h2 className="text-xl font-black text-white pt-1">
              Live Map Tracking Inactive
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Live GPS map tracking and real-time telemetry will automatically activate once the driver accepts your request and starts the journey!
            </p>
          </div>

          {/* TRIP DETAILS PREVIEW IF AVAILABLE */}
          {trip ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2 text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Trip Request #{trip.id.slice(-4)}</span>
                <span className="text-amber-400 font-bold">{trip.tripStatus}</span>
              </div>
              <p>📍 <strong>Pickup:</strong> {trip.pickupLocation}</p>
              <p>🏁 <strong>Destination:</strong> {trip.dropLocation}</p>
              <p>🚗 <strong>Driver:</strong> {trip.driverName}</p>
              <p className="text-teal-400 font-bold">Fare: ₹{trip.fareTotal}</p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              No active ride booking selected yet. Find a ride or accept a request to begin live tracking.
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {trip ? (
              <button
                onClick={handleStartJourney}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-600 hover:from-emerald-400 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" /> 🚀 Start Journey & Activate Live Map
              </button>
            ) : (
              <button
                onClick={() => setActiveView('find')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
              >
                Find a Ride & Book Seat
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ACTIVE JOURNEY TELEMETRY SCREEN
  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-teal-400" /> Live GPS Trip Tracking
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" /> GPS Telemetry Active
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-time CartoDB map showing vehicle location, route polyline, and ETA countdown</p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSimulating 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
            }`}
          >
            {isSimulating ? <><Pause className="w-3.5 h-3.5" /> Pause GPS</> : <><Play className="w-3.5 h-3.5" /> Resume GPS</>}
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setEtaMins(12);
              setIsSimulating(true);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive CartoDB Map (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-white">Trip #{trip.id ? trip.id.slice(-4) : '501'}</span>
              <span className="text-slate-400">Driver: <strong className="text-purple-300">{trip.driverName || 'Driver'}</strong></span>
            </div>
            <div className="text-xs font-bold text-teal-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ETA: {etaMins} mins remaining
            </div>
          </div>

          {/* CartoDB Map Component */}
          <LiveMap
            pickupCoords={routePoints[0]}
            dropCoords={routePoints[routePoints.length - 1]}
            liveCoords={currentCoords}
            routePath={routePoints}
            height="440px"
            mapTheme="voyager"
          />
        </div>

        {/* Telemetry Info & Controls (1 Col) */}
        <div className="space-y-5">
          
          {/* Status Telemetry Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-400" /> Trip Telemetry Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Trip State</span>
                <span className="font-bold text-emerald-400">In Transit 🚀</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Estimated Arrival (ETA)</span>
                <span className="font-bold text-teal-400">{etaMins} Minutes</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Vehicle Info</span>
                <span className="font-semibold text-slate-200">{trip.vehicleName || 'Vehicle'}</span>
              </div>
            </div>

            {/* Quick Action Button for Communication */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Open Passenger/Driver Chat & Voice Call
            </button>

            {/* COMPLETE TRIP & GIVE FEEDBACK BUTTON */}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete Trip & Give Feedback
            </button>
          </div>

          {/* Route Milestones */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Route Waypoint Progress
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pickup: {trip.pickupLocation || 'Pickup Location'}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
                <span>In Transit: Tech Corridor Expressway</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0" />
                <span>Destination: {trip.dropLocation || 'Destination'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FEEDBACK & RATING MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Trip Completed! Rate Co-rider
              </h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              
              {/* Star Rating selector */}
              <div className="text-center space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Rate your experience</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-400">{rating} out of 5 Stars</span>
              </div>

              {/* Feedback text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback Comments</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl glass-input"
                  placeholder="Share details about punctuality, driving safety, and conversation..."
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <p>ℹ️ Submitting feedback will complete the trip lifecycle and remove live tracking from screen.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-xl transition-all"
              >
                Submit Feedback & Remove Live Tracking
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
