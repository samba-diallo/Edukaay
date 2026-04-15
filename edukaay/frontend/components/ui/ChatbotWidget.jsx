/**
 * ChatbotWidget — Assistant IA EduKaay
 * Widget flottant accessible sur toutes les pages
 * Module IA : structure prête, sans modèle intégré pour l'instant
 */
import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMic } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const MESSAGES_INITIAUX = [
  {
    role: 'assistant',
    text: 'Bonjour ! Je suis Kaay, votre assistant EduKaay. Comment puis-je vous aider ?',
  },
];

export default function ChatbotWidget() {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState(MESSAGES_INITIAUX);
  const [input, setInput] = useState('');
  const [chargement, setChargement] = useState(false);
  const [sessionId] = useState(`s_${Date.now()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (ouvert) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, ouvert]);

  const envoyerMessage = async () => {
    const text = input.trim();
    if (!text || chargement) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChargement(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, langue: 'fr', sessionId }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reponse || '...' }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Désolé, je suis temporairement indisponible.' },
      ]);
    } finally {
      setChargement(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Fenêtre chat */}
      {ouvert && (
        <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-fadeInUp">
          {/* En-tête */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                K
              </div>
              <div>
                <p className="font-poppins font-semibold text-sm">Kaay — Assistant EduKaay</p>
                <p className="text-xs text-white/70">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setOuvert(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition"
              aria-label="Fermer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 bg-neutral-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white text-neutral-800 shadow-sm border border-neutral-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chargement && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-neutral-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              className="flex-1 px-4 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button
              onClick={envoyerMessage}
              disabled={!input.trim() || chargement}
              className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Envoyer"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-primary-500 hover:to-primary-600 active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Ouvrir l'assistant"
      >
        {ouvert ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </div>
  );
}
