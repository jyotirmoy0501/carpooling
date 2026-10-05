import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wallet, 
  PlusCircle, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shield, 
  Banknote,
  Smartphone
} from 'lucide-react';

export default function WalletView() {
  const { currentUser, rechargeWallet } = useApp();

  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('500');
  const [selectedPreset, setSelectedPreset] = useState(500);

  const [transactions, setTransactions] = useState([
    { id: 'tx-101', type: 'debit', title: 'Ride Fare (Hinjawadi to Viman Nagar)', amount: 80.00, date: 'Today, 08:30 AM', status: 'Completed' },
    { id: 'tx-100', type: 'credit', title: 'UPI Top-Up (GPay / Razorpay INR)', amount: 500.00, date: 'Yesterday', status: 'Success' },
    { id: 'tx-099', type: 'debit', title: 'Ride Fare (Manyata Tech Park)', amount: 65.00, date: '12 Aug 2026', status: 'Completed' },
    { id: 'tx-098', type: 'credit', title: 'Enterprise Commute Subsidy (₹)', amount: 200.00, date: '10 Aug 2026', status: 'Success' },
  ]);

  const handleRechargeSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (isNaN(val) || val <= 0) return;

    rechargeWallet(val);

    const newTx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      type: 'credit',
      title: 'UPI / GPay Wallet Top-Up',
      amount: val,
      date: 'Just now',
      status: 'Success'
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsRechargeModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-amber-400" /> Payments & Digital Wallet (₹ INR)
        </h1>
        <p className="text-xs text-slate-400">Manage corporate commute wallet, recharge via UPI (GPay/PhonePe), and track INR receipts</p>
      </div>

      {/* Main Balance Card & Quick Payment Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet Balance Hero Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl bg-gradient-to-tr from-purple-950 via-slate-900 to-teal-950 border border-purple-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" /> Enterprise INR Secure Wallet
            </span>
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              UPI & Razorpay Sandbox Active
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400">Available Balance</span>
            <div className="text-4xl font-extrabold text-white tracking-tight mt-1">
              ₹{currentUser.walletBalance?.toFixed(2)}
            </div>
            <p className="text-xs text-purple-300 mt-1">Associated with {currentUser.orgName}</p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => setIsRechargeModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-950/50 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" /> Top-Up Wallet (₹ INR)
            </button>
          </div>
        </div>

        {/* Supported Indian Payment Methods Overview */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" /> Supported Indian Payment Options
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200">
                <Smartphone className="w-4 h-4 text-teal-400" /> UPI (GPay / PhonePe / Paytm)
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">RECOMMENDED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200">
                <Wallet className="w-4 h-4 text-purple-400" /> Enterprise Commute Wallet (₹)
              </span>
              <span className="text-[10px] text-slate-400">ENABLED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200">
                <CreditCard className="w-4 h-4 text-amber-400" /> RuPay / Debit & Credit Cards
              </span>
              <span className="text-[10px] text-slate-400">ENABLED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200">
                <Banknote className="w-4 h-4 text-emerald-400" /> Cash to Driver (₹)
              </span>
              <span className="text-[10px] text-slate-400">ENABLED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Transaction History Log Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4">
        <h3 className="font-bold text-white text-sm">Transaction Logs & INR Receipts</h3>

        <div className="divide-y divide-slate-800/80 overflow-x-auto">
          {transactions.map(tx => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs min-w-[500px]">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-bold text-white">{tx.title}</p>
                  <p className="text-[10px] text-slate-400">{tx.date} • ID: {tx.id}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-black text-sm block ${
                  tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPI / GPay Top-Up Sandbox Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-teal-400" /> UPI / GPay Wallet Recharge (₹ INR)
              </h3>
              <button onClick={() => setIsRechargeModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleRechargeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Preset Amount (₹)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[200, 500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(amt);
                        setCustomAmount(amt.toString());
                      }}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        selectedPreset === amt 
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md' 
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Amount (₹ Rupees)</label>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={customAmount}
                  onChange={e => {
                    setCustomAmount(e.target.value);
                    setSelectedPreset(Number(e.target.value));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input font-bold text-white"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>📲 <strong>UPI Instant Gateway</strong>: Supports GPay, PhonePe, Paytm, BHIM & NetBanking.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRechargeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-lg"
                >
                  Recharge +₹{customAmount}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
