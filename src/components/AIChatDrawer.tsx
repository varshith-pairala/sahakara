import React, { useState } from 'react';
import { X, Send, Headphones, ShieldCheck, User, Volume2, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface AIChatDrawerProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  currentLang,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const strings = t[currentLang];

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: currentLang === 'te'
        ? `నమస్కారం! నేను "సహకార మిత్ర" డిజిటల్ సహాయకుడిని. సహకార సేవల బుకింగ్, ప్రభుత్వ నిబంధనల ధరలు, శ్రామిక సంక్షేమ పథకాలు లేదా సొసైటీ వివరాల గురించి మీరు ఏదైనా అడగవచ్చు.`
        : `Namaste! I am "Sahakar Mitra", your official cooperative services guide. You can ask about certified tariffs, worker welfare schemes, Ayushman Bharat insurance coverage, or booking assistance.`,
    },
  ]);

  const quickPrompts = currentLang === 'te' ? [
    "ప్లంబర్ లేదా ఎలక్ట్రీషియన్ చార్జీలు ఎంత?",
    "వర్కర్లకు 90% వేతనం & ఆయుష్మాన్ బీమా ఎలా లభిస్తుంది?",
    "అత్యవసర SOS సర్వీస్ ఎలా బుక్ చేయాలి?",
    "మా సొసైటీని ఎలా నమోదు చేసుకోవాలి?"
  ] : [
    "What are the transparent cooperative hourly tariffs?",
    "How does the 90% fair wage and 5% welfare corpus work?",
    "How does 15-minute emergency SOS service dispatch work?",
    "How do Primary Labour Societies join the federation?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang === 'te' ? 'Telugu' : currentLang === 'hi' ? 'Hindi' : currentLang === 'ta' ? 'Tamil' : 'English',
        }),
      });
      const data = await res.json();
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply || "I am here to assist you with SahakarSeva cooperative gig services and transparent tariffs.",
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-err-${Date.now()}`,
          sender: 'agent',
          text: "SahakarSeva connects verified cooperative workers with households with fair 90% direct payouts and 5% social security cess.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-emerald-800 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 border border-emerald-400/30 flex items-center justify-center text-emerald-100 shadow-xs">
              <Headphones className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <span>{strings.aiAssistantTitle}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              </h3>
              <p className="text-[11px] text-emerald-200">24x7 Official Citizen & Worker Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold p-2">
              <span className="w-4 h-4 rounded-full border-2 border-emerald-700 border-t-transparent animate-spin inline-block"></span>
              <span>Retrieving cooperative rate card & guidelines...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>Frequently Asked Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={currentLang === 'te' ? "మీ సందేహాన్ని టైప్ చేయండి..." : "Type your query here..."}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
