import React, { useState } from 'react';
import { X, Send, Phone, PhoneOff, Mic, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ChatModal() {
  const { isChatOpen, setIsChatOpen, selectedTripId, trips, currentUser } = useApp();
  
  if (!isChatOpen) return null;

  const trip = trips.find(t => t.id === selectedTripId) || trips[0];

  if (!trip) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
        <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <User className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-sm">No Active Trip Selected</h3>
          <p className="text-xs text-slate-400">Book or offer a ride to start communicating with your driver/passenger.</p>
          <button
            onClick={() => setIsChatOpen(false)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const otherPartyName = currentUser.id === trip.driverId ? (trip.passengerName || 'Passenger') : (trip.driverName || 'Driver');

  const [messages, setMessages] = useState([
    { id: 1, sender: 'driver', text: `Hi! I'm on my way to ${trip.pickupLocation || 'the pickup location'}. ETA 8 minutes.`, time: '08:22 AM' },
    { id: 2, sender: 'passenger', text: 'Great, thanks! I am standing near the front gate.', time: '08:23 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'currentUser',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'other',
          text: 'Got it! See you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const quickPills = [
    'I am at pickup spot',
    'Running 2 mins late',
    'What color is your car?',
    'Thanks!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold border border-purple-500/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{otherPartyName}</h3>
              <p className="text-[11px] text-teal-400 font-medium">Trip #{trip.id ? trip.id.slice(-4) : '501'} • Active Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalling(!isCalling)}
              className={`p-2 rounded-xl transition-all ${
                isCalling 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice Call Overlay View */}
        {isCalling ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center glow-teal">
                <User className="w-12 h-12 text-purple-300" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-25" />
            </div>

            <h4 className="text-lg font-bold text-white mb-1">In Call with {otherPartyName}</h4>
            <p className="text-xs text-teal-400 mb-6">Encrypted Enterprise VoIP Channel • HD Voice</p>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCalling(false)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Chat Area */
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
              {messages.map(m => {
                const isMe = m.sender === 'currentUser' || m.sender === 'passenger';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs ${
                        isMe 
                          ? 'bg-purple-600 text-white rounded-br-none shadow-md' 
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Response Pills */}
            <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(pill);
                  }}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl glass-input"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
