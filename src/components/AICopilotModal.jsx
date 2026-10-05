import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, Leaf, Shield, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { processAICopilotQuery } from '../utils/aiEngine';

export default function AICopilotModal() {
  const { isAICopilotOpen, setIsAICopilotOpen, setActiveView, currentUser, rides, analytics } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${currentUser?.name || 'Commuter'}! I am your **Enterprise EcoDrive AI Copilot**. How can I optimize your commute today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isAICopilotOpen) return null;

  const handleSendQuery = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Process with AI Engine
    setTimeout(() => {
      const response = processAICopilotQuery(textToSend, { currentUser, rides, analytics });
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        action: response.action,
        targetView: response.targetView
      };

      setMessages(prev => [...prev, aiMsg]);

      // Trigger view navigation if requested by AI
      if (response.action === 'NAVIGATE' && response.targetView) {
        setActiveView(response.targetView);
      }
    }, 400);
  };

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    handleSendQuery(inputQuery);
  };

  const samplePrompts = [
    'Find me a ride to Hinjawadi Tech Park',
    'Check my wallet balance',
    'What is my carbon savings?',
    'Open driver panel',
    'Update my profile'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-teal-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950 via-slate-900 to-teal-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-purple-600 flex items-center justify-center text-white shadow-lg glow-teal">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                Enterprise EcoDrive AI Copilot
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/40">
                  v2.4 Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Intelligent Commute & Sustainability Advisor</p>
            </div>
          </div>

          <button
            onClick={() => setIsAICopilotOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'glass-card text-slate-200 rounded-bl-none border border-slate-700/70'
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                
                {m.targetView && (
                  <button
                    onClick={() => {
                      setActiveView(m.targetView);
                      setIsAICopilotOpen(false);
                    }}
                    className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-semibold text-[11px] transition-colors"
                  >
                    Open View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sample Prompt Chips */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] bg-slate-800/80 text-teal-300 hover:bg-slate-700 border border-teal-500/20 transition-all cursor-pointer"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask EcoDrive AI anything..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl glass-input"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
