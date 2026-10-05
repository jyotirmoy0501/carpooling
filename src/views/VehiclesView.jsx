import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  Plus, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  Info,
  Sliders
} from 'lucide-react';

export default function VehiclesView() {
  const { vehicles, addVehicle, currentUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [model, setModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [fuelType, setFuelType] = useState('Electric');
  const [color, setColor] = useState('Midnight Black');

  const myVehicles = vehicles.filter(v => v.driverId === currentUser.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!model || !regNumber) return;

    addVehicle({
      model,
      regNumber,
      capacity: Number(capacity),
      fuelType,
      color,
      efficiencyKmL: fuelType === 'Electric' ? 5.5 : fuelType === 'Hybrid' ? 24.5 : 16.5
    });

    setModel('');
    setRegNumber('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-purple-400" /> Vehicle Management
          </h1>
          <p className="text-xs text-slate-400">Register driver vehicles, manage seating capacity, and configure fuel efficiency profiles</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Register New Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myVehicles.map(veh => (
          <div key={veh.id} className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-4 relative overflow-hidden">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{veh.model}</h3>
                  <p className="text-[11px] font-mono text-teal-400">{veh.regNumber}</p>
                </div>
              </div>

              {veh.fuelType === 'Electric' && (
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-teal-400" /> EV
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Seating Capacity:</span>
                <span className="font-bold text-white">{veh.capacity} Seats</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Fuel Engine Type:</span>
                <span className="font-semibold text-purple-300">{veh.fuelType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Color:</span>
                <span className="text-slate-200">{veh.color || 'Standard'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ready for Ride Publishing
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Register New Driver Vehicle</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Vehicle Model & Make</label>
                <input
                  type="text"
                  placeholder="e.g. Tesla Model Y / Toyota Camry"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">License Plate / Registration No.</label>
                <input
                  type="text"
                  placeholder="e.g. EV-99-OD"
                  value={regNumber}
                  onChange={e => setRegNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Seating Capacity</label>
                  <select
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value={2}>2 Seats</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats</option>
                    <option value={6}>6 Seats</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Fuel / Engine Type</label>
                  <select
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg"
                >
                  Register Vehicle
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
