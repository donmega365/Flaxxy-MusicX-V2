import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Search, Cast, Sparkles, 
  Compass, Library, Mic, CheckCircle, Crown, Gift, X, Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Tier State: 'FREE', 'PRO', or 'ULTIMATE_LIFETIME'
  const [tier, setTier] = useState(() => localStorage.getItem('flaxxy_tier') || 'FREE');
  const [couponInput, setCouponInput] = useState('');
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSearchText, setAiSearchText] = useState('');
  const [activeMood, setActiveMood] = useState('Energize');
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTrack, setCurrentTrack] = useState({
    title: "Starboy (Lossless Audio)",
    artist: "The Weeknd • Daft Punk",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80"
  });

  const moods = ["Energize", "Relax", "Workout", "Focus", "Commute", "Party"];

  const quickPicks = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80" },
    { id: 2, title: "Midnight City", artist: "M83", duration: "4:03", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&q=80" },
    { id: 3, title: "After Hours", artist: "The Weeknd", duration: "6:01", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80" },
    { id: 4, title: "Get Lucky", artist: "Daft Punk", duration: "4:08", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&q=80" }
  ];

  // Coupon Code Verification
  const applyCoupon = () => {
    if (couponInput.trim().toLowerCase() === 'flaxxysong') {
      setTier('ULTIMATE_LIFETIME');
      localStorage.setItem('flaxxy_tier', 'ULTIMATE_LIFETIME');
      setCouponModalOpen(false);
      setCouponInput('');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      alert('🎉 CONGRATULATIONS! Coupon "FlaxxySong" Applied!\nFlaxxy MusicX ULTIMATE LIFETIME (50+ Features) is now ACTIVATED!');
    } else {
      alert('❌ Invalid Coupon Code! Please try: FlaxxySong');
    }
  };

  return (
    <div className="flex justify-center bg-black min-h-screen text-white font-sans antialiased select-none">
      <div className="w-full max-w-md h-screen flex flex-col bg-[#070709] border-x border-neutral-900 relative overflow-hidden">
        
        {/* --- TOP BAR (YouTube Music Style) --- */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF385C] to-[#FFA000] flex items-center justify-center font-black text-sm tracking-tighter shadow-lg shadow-red-500/20">
              FX
            </div>
            <span className="text-xl font-bold tracking-tight">
              Flaxxy <span className="text-[#FF385C]">MusicX</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-300">
            <button onClick={() => setCouponModalOpen(true)} className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 px-2 py-1 rounded-full text-xs text-amber-300 font-semibold active:scale-95 transition">
              <Gift size={14} />
              <span>Coupon</span>
            </button>
            <button className="hover:text-white"><Cast size={20} /></button>
            <button className="hover:text-white" onClick={() => setAiModalOpen(true)}><Search size={20} /></button>
            <div 
              onClick={() => setCouponModalOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-xs font-black cursor-pointer border border-white/20"
            >
              {tier === 'ULTIMATE_LIFETIME' ? '👑' : 'U'}
            </div>
          </div>
        </header>

        {/* --- MEMBERSHIP BADGE STATUS --- */}
        {tier === 'ULTIMATE_LIFETIME' && (
          <div className="mx-4 mt-1 px-3 py-1 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
              <Crown size={14} className="text-amber-400" /> ULTIMATE LIFETIME ACTIVATED (50+ PRO UNLOCKED)
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded">VIP</span>
          </div>
        )}

        {/* --- MOOD CHIPS --- */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar scroll-smooth">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMood(m)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeMood === m
                  ? "bg-white text-black shadow-md"
                  : "bg-white/10 text-neutral-300 hover:bg-white/15"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* --- MAIN FEED (SCROLLABLE) --- */}
        <div className="flex-1 overflow-y-auto px-4 pb-36 space-y-6 pt-2">
          
          {/* AI Multimodal Finder Banner */}
          <div 
            onClick={() => setAiModalOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-800 border border-neutral-800 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#FF385C]/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF385C]/20 border border-[#FF385C]/40 flex items-center justify-center text-[#FF385C]">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-100 flex items-center gap-1">
                  AI Song & Melody Finder
                  <span className="text-[9px] bg-[#FF385C] text-white px-1.5 py-0.2 rounded font-black">AI 2.0</span>
                </h4>
                <p className="text-[10px] text-neutral-400">Hum, sing, or describe a movie scene</p>
              </div>
            </div>
            <div className="p-2 bg-white/5 rounded-full text-neutral-300">
              <Mic size={16} />
            </div>
          </div>

          {/* Quick Picks */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Start Radio From</p>
                <h3 className="text-xl font-bold tracking-tight">Quick picks</h3>
              </div>
              <button className="text-xs text-neutral-300 border border-neutral-800 px-3 py-1 rounded-full hover:bg-white/5">
                Play all
              </button>
            </div>

            <div className="space-y-1">
              {quickPicks.map((track) => (
                <div 
                  key={track.id} 
                  onClick={() => {
                    setCurrentTrack({ title: track.title, artist: track.artist, cover: track.cover });
                    setIsPlaying(true);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200">{track.title}</h4>
                      <p className="text-xs text-neutral-400">{track.artist}</p>
                    </div>
                  </div>
                  <button className="p-2 text-neutral-400 group-hover:text-white">
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Mixed for You Carousel */}
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-3">Mixed for you</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {[
                { title: "My Supermix", sub: "Flaxxy Mix • Weekend vibes", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80" },
                { title: "Bass Booster", sub: "320kbps High Fidelity", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" },
                { title: "Lo-Fi Midnight", sub: "Study & Deep Code", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" }
              ].map((mix, i) => (
                <div key={i} className="min-w-[130px] flex-shrink-0 cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden aspect-square mb-2">
                    <img src={mix.img} alt={mix.title} className="w-full h-full object-cover" />
                    <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center text-white shadow-lg">
                      <Play size={14} fill="white" className="ml-0.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-200 truncate">{mix.title}</h4>
                  <p className="text-[10px] text-neutral-400 truncate">{mix.sub}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* --- FLOATING MINI-PLAYER --- */}
        <div className="absolute bottom-16 left-2 right-2 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 p-2 shadow-2xl flex items-center justify-between z-30">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={currentTrack.cover} alt="Cover" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{currentTrack.title}</h4>
              <p className="text-[11px] text-neutral-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition"
            >
              {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" className="ml-0.5" />}
            </button>
            <button className="p-1 text-neutral-400 hover:text-white">
              <SkipForward size={18} />
            </button>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-[#FF385C]" />
          </div>
        </div>

        {/* --- BOTTOM NAVBAR --- */}
        <nav className="h-16 bg-[#070709] border-t border-neutral-900 flex items-center justify-around px-2 z-20">
          <button className="flex flex-col items-center gap-1 text-white">
            <div className="w-4 h-4 bg-white rounded-sm" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white">
            <Compass size={20} />
            <span className="text-[10px]">Explore</span>
          </button>
          <button onClick={() => setAiModalOpen(true)} className="flex flex-col items-center gap-1 text-[#FF385C]">
            <Sparkles size={20} />
            <span className="text-[10px] font-bold">AI Finder</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white">
            <Library size={20} />
            <span className="text-[10px]">Library</span>
          </button>
          <button onClick={() => setCouponModalOpen(true)} className="flex flex-col items-center gap-1 text-amber-400">
            <Crown size={20} />
            <span className="text-[10px] font-bold">VIP</span>
          </button>
        </nav>

        {/* --- COUPON POPUP MODAL --- */}
        {couponModalOpen && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full bg-[#121217] border border-neutral-800 rounded-3xl p-5 shadow-2xl relative">
              <button 
                onClick={() => setCouponModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-500/30">
                  <Crown size={24} />
                </div>
                <h3 className="text-lg font-bold">Redeem VIP Access</h3>
                <p className="text-xs text-neutral-400">Enter your official promo coupon below to unlock 50+ Ultimate features for lifetime.</p>
              </div>

              <div className="space-y-3">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter Code (e.g. FlaxxySong)" 
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF385C]"
                />

                <button 
                  onClick={applyCoupon}
                  className="w-full py-3 bg-gradient-to-r from-[#FF385C] to-[#FFA000] rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 active:scale-95 transition"
                >
                  Activate Ultimate Lifetime
                </button>

                <p className="text-[11px] text-center text-neutral-500">
                  Try official key: <span className="text-amber-400 font-mono font-bold">FlaxxySong</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- AI SEARCH MODAL --- */}
        {aiModalOpen && (
          <div className="absolute inset-0 bg-[#070709] z-50 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-[#FF385C]">
                <Sparkles size={18} />
                <span className="font-bold text-sm text-white">Flaxxy AI Song Search</span>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="text-neutral-400"><X size={20} /></button>
            </div>

            <div className="mt-4 flex-1 space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={aiSearchText}
                  onChange={(e) => setAiSearchText(e.target.value)}
                  placeholder="Describe a vibe, movie scene, or hum lyrics..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-neutral-500 focus:border-[#FF385C] focus:outline-none"
                />
                <button className="absolute right-3 top-3 text-[#FF385C]"><Mic size={18} /></button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">Try Prompts:</p>
                {[
                  "That slow synth song playing during night rain in Tokyo",
                  "Fast Punjabi gym workout beat with heavy 808 bass",
                  "Hum: Ta-na-na-na-re-na-re (Find song)"
                ].map((prompt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setAiSearchText(prompt)}
                    className="p-2.5 bg-neutral-900/60 rounded-xl text-xs text-neutral-300 hover:bg-neutral-800 cursor-pointer border border-neutral-800/80"
                  >
                    "{prompt}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
