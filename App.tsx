
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, FestiveMessage } from './types';
import { fetchFestiveMessage } from './services/geminiService';
import CelebrationEffects from './components/CelebrationEffects';
import { Sparkles, Calendar, Clock, RotateCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [count, setCount] = useState<number>(10);
  const [message, setMessage] = useState<FestiveMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Pre-fetch message so it's ready when the celebration starts
  const loadMessage = useCallback(async () => {
    setIsLoading(true);
    const msg = await fetchFestiveMessage();
    setMessage(msg);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMessage();
  }, [loadMessage]);

  const startCountdown = () => {
    setCount(10);
    setAppState(AppState.COUNTDOWN);
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setCount(10);
    loadMessage();
  };

  useEffect(() => {
    let timer: number;
    if (appState === AppState.COUNTDOWN && count > 0) {
      timer = window.setTimeout(() => setCount(prev => prev - 1), 1000);
    } else if (appState === AppState.COUNTDOWN && count === 0) {
      setAppState(AppState.CELEBRATION);
    }
    return () => clearTimeout(timer);
  }, [appState, count]);

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-8 text-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full"></div>
              <Sparkles className="w-24 h-24 text-yellow-500 relative animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-festive font-bold text-white tracking-widest drop-shadow-lg">
              MIDNIGHT <span className="text-yellow-500">SPARKLE</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-md font-light">
              Experience the magic of the New Year anytime you want.
            </p>
            <button
              onClick={startCountdown}
              className="group relative px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full font-bold text-black text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95 flex items-center gap-3"
            >
              <Play className="fill-current w-6 h-6" />
              START COUNTDOWN
              <div className="absolute inset-0 rounded-full group-hover:bg-white/10 transition-colors"></div>
            </button>
          </motion.div>
        );

      case AppState.COUNTDOWN:
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-9xl md:text-[15rem] font-festive font-black text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.4)]"
              >
                {count}
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-4 text-gray-500 font-festive uppercase tracking-widest">
              <Clock className="w-5 h-5" />
              <span>Seconds until 2025</span>
            </div>
          </div>
        );

      case AppState.CELEBRATION:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center px-4 relative z-10"
          >
            <CelebrationEffects />
            <motion.h2 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl md:text-9xl font-festive font-black text-yellow-400 drop-shadow-[0_0_40px_rgba(234,179,8,0.8)] animate-pulse-gold mb-8"
            >
              HAPPY NEW YEAR!
            </motion.h2>
            
            <div className="max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <p className="text-2xl md:text-3xl italic text-gray-200 font-light leading-relaxed">
                    &quot;{message?.quote}&quot;
                  </p>
                  <p className="text-yellow-500 font-festive tracking-widest text-lg">
                    — {message?.author}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={reset}
              className="mt-12 flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-semibold border-b border-transparent hover:border-white py-1"
            >
              <RotateCcw className="w-5 h-5" />
              Relive the Magic
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-yellow-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow"></div>
      </div>

      <main className="container mx-auto px-4 z-10">
        {renderContent()}
      </main>

      {/* Footer Info */}
      <footer className="absolute bottom-6 w-full text-center text-gray-600 font-light text-sm tracking-widest uppercase">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>New Year's Eve Simulation Engine v1.0</span>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
