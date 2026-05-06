"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <audio 
        ref={audioRef} 
        src="/ram-song.mpeg" 
        loop 
        preload="auto"
      />
      
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl border border-saffron/20 p-2 rounded-2xl shadow-[0_10px_30px_rgba(255,153,51,0.1)] group hover:border-saffron/50 transition-all duration-500">
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
            isPlaying ? 'bg-saffron text-black shadow-[0_0_20px_rgba(255,153,51,0.4)]' : 'bg-white/5 text-saffron hover:bg-saffron/10'
          }`}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        <div className={`flex flex-col pr-4 overflow-hidden transition-all duration-500 ${isPlaying ? 'max-w-[150px] opacity-100' : 'max-w-0 opacity-0'}`}>
           <span className="text-[10px] font-black text-saffron uppercase tracking-widest leading-none">भजन सक्रिय</span>
           <span className="text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1 whitespace-nowrap">आध्यात्मिक ऊर्जा</span>
        </div>

        <button 
          onClick={toggleMute}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Floating particles when playing */}
      {isPlaying && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
           <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`w-1 h-1 bg-saffron rounded-full animate-bounce`} 
                  style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1s' }}
                />
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
