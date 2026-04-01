import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareText, X, Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { startStyleChat } from '../services/gemini';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o Aura Style Guide. Vamos descobrir qual estilo de decoração combina com você? O que você mais valoriza em um ambiente?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = startStyleChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = startStyleChat();
      }

      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: userMessage });
      const botText = response.text || "Desculpe, tive um problema ao processar sua resposta.";
      
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Ocorreu um erro ao conversar com o Gemini. Por favor, tente novamente mais tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 sm:bottom-28 sm:right-8 w-14 h-14 bg-sage-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[60] hover:bg-sage-700 transition-colors"
      >
        <MessageSquareText size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 sm:bottom-28 sm:right-8 w-[calc(100vw-3rem)] sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl z-[70] flex flex-col overflow-hidden border border-neutral-100"
          >
            {/* Header */}
            <div className="bg-sage-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquareText size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg leading-tight">Aura Style Guide</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">Gemini AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-neutral-100 text-neutral-600' : 'bg-sage-100 text-sage-600'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-sage-600 text-white rounded-tr-none' 
                        : 'bg-neutral-50 text-neutral-800 border border-neutral-100 rounded-tl-none'
                    }`}>
                      <div className="markdown-body">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center text-neutral-500 text-xs bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Aura está pensando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-top border-neutral-100 bg-neutral-50/50">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Fale sobre sua personalidade..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-sage-200 bg-white text-neutral-900 text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    input.trim() && !isLoading ? 'bg-sage-600 text-white' : 'text-neutral-300'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
