import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Navigation, 
  MapPin, 
  MessageSquare, 
  Play, 
  Receipt, 
  Calendar, 
  Car,
  Lock,
  CheckCircle2,
  XCircle,
  BellRing,
  IndianRupee
} from 'lucide-react';

export default function TripManagementView() {
  const { 
    trips, 
    currentUser, 
    acceptRideRequest,
    declineRideRequest,
    updateTripStatus, 
    setSelectedTripId, 
    setIsChatOpen, 
    setActiveView,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [invoiceTrip, setInvoiceTrip] = useState(null);

  // Driver pending requests needing approval
  const driverPendingRequests = trips.filter(t => t.driverId === currentUser.id && t.tripStatus === 'Pending Approval');

  const filteredTrips = trips.filter(t => {
    if (activeTab === 'active') return t.tripStatus !== 'Completed' && t.tripStatus !== 'Declined';
    if (activeTab === 'completed') return t.tripStatus === 'Completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Approval':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">📩 Pending Driver Approval</span>;
      case 'Booked':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">Ride Booked & Confirmed</span>;
      case 'Started':
      case 'In Progress':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold animate-pulse">Trip In Progress 🚗</span>;
      case 'Completed':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">Completed & Closed 🔒</span>;
      case 'Declined':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">Declined by Driver</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const handleCloseDestinationTrip = (trip) => {
    updateTripStatus(trip.id, 'Completed');
    addNotification(`🔒 Destination '${trip.dropLocation}' closed. Trip completed & fare of ₹${trip.fareTotal} disbursed!`);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-purple-400" /> Trip Management (My Trips)
          </h1>
          <p className="text-xs text-slate-400">Review passenger pickup requests along your route, approve bookings (₹), and manage active journeys</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {['all', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab} Trips
            </button>
          ))}
        </div>
      </div>

      {/* DRIVER PENDING REQUESTS APPROVAL BANNER */}
      {driverPendingRequests.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-amber-950/30 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-400 animate-bounce" /> New Passenger Booking Request(s) Needing Approval ({driverPendingRequests.length})
            </h3>
            <span className="text-xs font-bold text-amber-300">Action Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverPendingRequests.map(req => (
              <div key={req.id} className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs">Passenger: {req.passengerName}</span>
                  <span className="text-teal-400 font-extrabold text-sm">₹{req.fareTotal} ({req.seatsBooked} seat)</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p>📍 <strong>Pickup:</strong> {req.pickupLocation}</p>
                  <p>🏁 <strong>Drop:</strong> {req.dropLocation}</p>
                  <p>💳 <strong>Payment Method:</strong> {req.paymentMethod}</p>
                </div>

                {/* ACCEPT / DECLINE BUTTONS */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => acceptRideRequest(req.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1 shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Request (₹{req.fareTotal})
                  </button>

                  <button
                    onClick={() => declineRideRequest(req.id)}
                    className="py-2 px-3 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trips Grid / List */}
      {filteredTrips.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <Car className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold">No trips found</h3>
          <p className="text-xs text-slate-400">Search for rides or offer a trip to get started!</p>
          <button
            onClick={() => setActiveView('find')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            Find a Ride Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map(trip => {
            const isDriver = currentUser.id === trip.driverId;
            return (
              <div key={trip.id} className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white text-sm">Trip #{trip.id.slice(-5)}</span>
                    {getStatusBadge(trip.tripStatus)}
                    <span className="text-[11px] text-purple-300 font-semibold bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                      {isDriver ? 'You are Driver 🚘' : 'Passenger View 👤'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {trip.date} • {trip.time}
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Route & Vehicle */}
                  <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">PICKUP</span>
                        <span className="text-slate-200">{trip.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">DESTINATION</span>
                        <span className="text-slate-200">{trip.dropLocation}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">Vehicle: {trip.vehicleName}</p>
                  </div>

                  {/* Counterparty Info */}
                  <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1">
                        {isDriver ? 'PASSENGER DETAILS' : 'DRIVER DETAILS'}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-200">
                          {isDriver ? trip.passengerName?.[0] : trip.driverName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{isDriver ? trip.passengerName : trip.driverName}</p>
                          <p className="text-[10px] text-slate-400">{trip.driverPhone || '+91 98765 43210'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat & Call Controls */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          setIsChatOpen(true);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat / Call
                      </button>
                    </div>
                  </div>

                  {/* Payment & Lifecycle Actions */}
                  <div className="space-y-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Seats: {trip.seatsBooked}</span>
                        <span className="text-emerald-400 font-semibold">{trip.paymentStatus}</span>
                      </div>
                      <div className="text-xl font-black text-white mt-1">₹{trip.fareTotal?.toFixed(2)}</div>
                      <span className="text-[10px] text-slate-500">Method: {trip.paymentMethod}</span>
                    </div>

                    {/* Lifecycle Action Buttons */}
                    <div className="space-y-1.5">
                      {trip.tripStatus === 'Pending Approval' && isDriver && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptRideRequest(trip.id)}
                            className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                          >
                            Accept (₹{trip.fareTotal})
                          </button>
                          <button
                            onClick={() => declineRideRequest(trip.id)}
                            className="py-2 px-3 rounded-lg bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {trip.tripStatus === 'Booked' && isDriver && (
                        <button
                          onClick={() => updateTripStatus(trip.id, 'In Progress')}
                          className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Play className="w-3.5 h-3.5" /> Start Journey
                        </button>
                      )}

                      {(trip.tripStatus === 'Booked' || trip.tripStatus === 'In Progress') && isDriver && (
                        <button
                          onClick={() => handleCloseDestinationTrip(trip)}
                          className="w-full py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Lock className="w-3.5 h-3.5 text-red-400" /> Close Travel Destination & Complete Trip
                        </button>
                      )}

                      {trip.tripStatus === 'Completed' && (
                        <button
                          onClick={() => setInvoiceTrip(trip)}
                          className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Receipt className="w-3.5 h-3.5" /> View E-Receipt (₹)
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* E-Receipt Modal */}
      {invoiceTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-400" /> Enterprise Trip Receipt (₹)
              </h3>
              <button onClick={() => setInvoiceTrip(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between font-bold text-white">
                <span>Receipt #{invoiceTrip.id}</span>
                <span className="text-emerald-400">PAID VIA {invoiceTrip.paymentMethod.toUpperCase()}</span>
              </div>
              
              <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-300">
                <p><strong>Passenger:</strong> {invoiceTrip.passengerName}</p>
                <p><strong>Driver:</strong> {invoiceTrip.driverName}</p>
                <p><strong>Vehicle:</strong> {invoiceTrip.vehicleName}</p>
                <p><strong>Date & Time:</strong> {invoiceTrip.date} • {invoiceTrip.time}</p>
                <p><strong>CO₂ Offset:</strong> 2.1 kg saved</p>
                <div className="flex items-center justify-between font-extrabold text-white text-sm pt-2 border-t border-slate-800">
                  <span>Total Amount Paid</span>
                  <span className="text-teal-400">₹{invoiceTrip.fareTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Receipt downloaded to your enterprise account records!');
                setInvoiceTrip(null);
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Download PDF Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
