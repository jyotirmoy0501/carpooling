import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bookmark, 
  Plus, 
  MapPin, 
  Home, 
  Briefcase, 
  Star, 
  Trash2,
  Search,
  PlusCircle
} from 'lucide-react';

export default function SavedPlacesView() {
  const { savedPlaces, addSavedPlace, setActiveView } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('home');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address) return;

    addSavedPlace({
      name,
      address,
      category,
      lat: 37.7749,
      lng: -122.4194
    });

    setName('');
    setAddress('');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'home': return <Home className="w-4 h-4 text-emerald-400" />;
      case 'work': return <Briefcase className="w-4 h-4 text-purple-400" />;
      default: return <Star className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-teal-400" /> Saved Places & Favorites
          </h1>
          <p className="text-xs text-slate-400">Save frequent locations (Home, Office HQ) for 1-click ride searching and publishing</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Saved Place
        </button>
      </div>

      {/* Saved Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savedPlaces.map(place => (
          <div key={place.id} className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getCategoryIcon(place.category)}
                  </div>
                  <h3 className="font-bold text-white text-sm">{place.name}</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {place.category}
                </span>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{place.address}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveView('find')}
                className="flex-1 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" /> Search Ride
              </button>
              <button
                onClick={() => setActiveView('offer')}
                className="flex-1 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Offer Ride
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Add New Saved Location</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Place Name</label>
                <input
                  type="text"
                  placeholder="e.g. Home / Office HQ / Downtown Gym"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-slate-900"
                >
                  <option value="home">Home 🏠</option>
                  <option value="work">Work / Office 💼</option>
                  <option value="frequent">Frequent Point ⭐</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg"
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
