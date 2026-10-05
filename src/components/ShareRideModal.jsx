import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  CheckCircle2, 
  MapPin, 
  Car, 
  Users, 
  Navigation, 
  Sparkles,
  Send,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ShareRideModal({ ride, onClose }) {
  const { addNotification } = useApp();
  const [copied, setCopied] = useState(false);
  const [broadcastActive, setBroadcastActive] = useState(true);

  if (!ride) return null;

  const shareableUrl = `https://ecodrive-carpool.com/ride/corridor-${(ride.id || '9821').slice(-6)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    addNotification('🔗 Shareable Ride Link copied to clipboard! Passengers can join from any covered pickup zone.');
    setTimeout(() => setCopied(false), 3000);
  };

  const pickupArea = ride.pickupLocation || 'Hinjawadi Infotech Park, Pune';
  const dropArea = ride.dropLocation || 'Koregaon Park, Pune';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glowing Background FX */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Share Ride Corridor</h3>
              <p className="text-xs text-slate-400">Passengers matching ANY pickup zone along your route can join</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* SHARE LINK BOX */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">Public Shareable Corridor Link:</label>
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-teal-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md ${
                copied 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
              }`}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* EN-ROUTE PICKUP ZONES COVERED BY DRIVER */}
        <div className="space-y-3 glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-teal-400" /> En-Route Pickup Zones Covered:
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
              Multi-Stop Pickup Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px]">Zone 1 (Primary Pickup):</span>
                <span className="font-bold text-white">{pickupArea}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px]">Zone 2 (En-Route Waypoint):</span>
                <span className="font-bold text-purple-300">{pickupArea} Highway & Metro Junction</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px]">Zone 3 (Destination Policy):</span>
                <span className="font-bold text-teal-200">{dropArea}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BROADCAST SUMMARY BANNER */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/70 to-purple-950/70 border border-teal-500/30 text-xs text-slate-300 space-y-1">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Instant Passenger Discovery
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Any commuter searching for a ride matching ANY of these covered pickup zones will automatically see your driver corridor and can request a seat!
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              addNotification(`📢 Ride corridor for ${pickupArea} broadcasted to all nearby passengers!`);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Broadcast Corridor to Passengers
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
