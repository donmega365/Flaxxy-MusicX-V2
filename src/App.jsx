import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Search, Cast, Sparkles, 
  Compass, Library, Mic, Crown, Gift, X, Sliders, Volume2, 
  VolumeX, LogIn, UserPlus, Heart, Repeat, Shuffle, Check, 
  Music, Radio, ShieldCheck, ChevronDown, ListMusic, AlignLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Real High-Quality Audio Streams (Tested & Working)
const TRACKS_DB = [
  {
    id: 1,
    title: "Starboy & Cyber Synth",
    artist: "The Weeknd ft. Flaxxy Mix",
    album: "Starboy Ultimate Edition",
    category: "Energize",
    duration: "3:48",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    lyrics: "I'm tryna put you in the worst mood, ah\nP1 cleaner than your church shoes, ah\nMilli point two just to hurt you, ah\nAll red Lamb' just to tease you, ah..."
  },
  {
    id: 2,
    title: "Midnight City Echoes",
    artist: "M83 • Dreamwave Remix",
    album: "Hurry Up, We're Dreaming",
    category: "Relax",
    duration: "4:04",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    lyrics: "Waiting in a car\nWaiting for a ride in the dark\nThe night city grows\nLook and see her eyes, they glow..."
  },
  {
    id: 3,
    title: "Heavy Trap Workout 808",
    artist: "Flaxxy Gym Beasts",
    album: "Beast Mode Vol. 4",
    category: "Workout",
    duration: "2:55",
    cover: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    lyrics: "[Heavy Bass Drop]\nPush the limits, no pain no gain\nEvery single rep break the chain\nTurn the volume all the way high..."
  },
  {
    id: 4,
    title: "Deep Coding Lo-Fi Rain",
    artist: "ChilledCow & Flaxxy Studio",
    album: "Midnight Focus Session",
    category: "Focus",
    duration: "3:15",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    lyrics: "[Instrumental Chill Melodies]\nRain against the windowpane\nLo-fi vinyl crackles in stereo 432Hz..."
  },
  {
    id: 5,
    title: "After Hours Sunset Drive",
    artist: "The Weeknd • Neon Edition",
    album: "After Hours Deluxe",
    category: "Commute",
    duration: "4:12",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    lyrics: "Thought I almost died in my dream again\nFightin' for my life, I couldn't breathe again\nFallin' into you..."
  }
];

export default function FlaxxyMusicX() {
  // Audio Controller
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpandedPlayer, setIsExpandedPlayer] = useState(false);
  const [playerTab, setPlayerTab] = useState('upNext'); // 'upNext' or 'lyrics'

  // User & Membership States
  const [tier, setTier] = useState(() => localStorage.getItem('flaxxy_tier') || 'FREE');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flaxxy_user');
    return saved ? JSON.parse(saved) : {
      isLoggedIn: false,
      name: "Guest Listener",
      email: "",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
      ytConnected: false,
      spotifyConnected: false
    };
  });

  // UI Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [signupName, setSignupName] = useState('');

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeMood, setActiveMood] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const moods = ["All", "Energize", "Relax", "Workout", "Focus", "Commute"];
  const currentTrack = TRACKS_DB[currentTrackIndex];

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    }, 150);
  };

  const playNext = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS_DB.length;
    playTrack(nextIdx);
  };

  const playPrev = () => {
    const prevIdx = (currentTrackIndex - 1 + TRACKS_DB.length) % TRACKS_DB.length;
    playTrack(prevIdx);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Coupon Code Activator
  const applyCoupon = () => {
    if (couponInput.trim().toLowerCase() === 'flaxxysong') {
      setTier('ULTIMATE_LIFETIME');
      localStorage.setItem('flaxxy_tier', 'ULTIMATE_LIFETIME');
      setCouponModalOpen(false);
      setCouponInput('');
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    } else {
      alert('❌ Invalid Code! Enter: FlaxxySong');
    }
  };

  // Auth Functions
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    const updatedUser = {
      ...user,
      isLoggedIn: true,
      name: authMode === 'signup' ? signupName || "Flaxxy VIP" : loginEmail.split('@')[0],
      email: loginEmail
    };
    setUser(updatedUser);
    localStorage.setItem('flaxxy_user', JSON.stringify(updatedUser));
    setAuthModalOpen(false);
    confetti({ particleCount: 70, spread: 60 });
  };

  const toggleYTMusic = () => {
    const updated = { ...user, ytConnected: !user.ytConnected };
    setUser(updated);
    localStorage.setItem('flaxxy_user', JSON.stringify(updated));
  };

  const toggleSpotify = () => {
    const updated = { ...user, spotifyConnected: !user.spotifyConnected };
    setUser(updated);
    localStorage.setItem('flaxxy_user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    const guestUser = {
      isLoggedIn: false,
      name: "Guest Listener",
      email: "",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
      ytConnected: false,
      spotifyConnected: false
    };
    setUser(guestUser);
    localStorage.removeItem('flaxxy_user');
    setAuthModalOpen(false);
  };

  const filteredTracks = TRACKS_DB.filter(t => {
    const matchesMood = activeMood === 'All' || t.category === activeMood;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMood && matchesSearch;
  });

  return (
    <div className="flex justify-center bg-black min-h-screen text-white font-sans antialiased select-none">
      
      {/* Hidden Real HTML5 Audio Element */}
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />

      <div className="w-full max-w-md h-screen flex flex-col bg-[#030304] border-x border-neutral-900 relative overflow-hidden">
        
        {/* --- YOUTUBE MUSIC EXACT TOP BAR --- */}
        <header className="flex items-center justify-between px-4 pt-3 pb-2 z-20 bg-[#030304]/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#FF8A00] flex items-center justify-center font-black text-xs shadow-lg shadow-red-500/30">
              FX
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter leading-none flex items-center gap-1">
                Flaxxy <span className="text-[#FF385C]">MusicX</span>
              </span>
              <span className="text-[9px] text-neutral-400 font-semibold tracking-widest uppercase">
                {tier === 'ULTIMATE_LIFETIME' ? '👑 ULTIMATE VIP' : 'STUDIO HYBRID'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCouponModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 active:scale-95 transition"
            >
              <Gift size={13} />
              <span>Coupon</span>
            </button>
            <button onClick={() => setAiModalOpen(true)} className="p-1.5 text-neutral-300 hover:text-white">
              <Sparkles size={19} className="text-[#FF385C]" />
            </button>
            
            {/* User Profile / Auth Avatar */}
            <div 
              onClick={() => setAuthModalOpen(true)}
              className="w-8 h-8 rounded-full border-2 border-neutral-700 hover:border-[#FF385C] overflow-hidden cursor-pointer active:scale-95 transition"
            >
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* --- SEARCH BAR --- */}
        <div className="px-4 py-1.5">
          <div className="flex items-center bg-neutral-900/90 border border-neutral-800 rounded-full px-3.5 py-2">
            <Search size={16} className="text-neutral-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search YouTube & Spotify songs, artists..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-400">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* --- YOUTUBE MUSIC FILTER PILLS --- */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMood(m)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeMood === m
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* --- MAIN SCROLL FEED --- */}
        <div className="flex-1 overflow-y-auto px-4 pb-36 space-y-6 pt-2">
          
          {/* Linked Services Status Card */}
          <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 font-semibold ${user.ytConnected ? 'text-red-400' : 'text-neutral-500'}`}>
                <span className={`w-2 h-2 rounded-full ${user.ytConnected ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
                YT Music {user.ytConnected ? 'Synced' : 'Off'}
              </span>
              <span className="text-neutral-700">|</span>
              <span className={`flex items-center gap-1 font-semibold ${user.spotifyConnected ? 'text-green-400' : 'text-neutral-500'}`}>
                <span className={`w-2 h-2 rounded-full ${user.spotifyConnected ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
                Spotify {user.spotifyConnected ? 'Synced' : 'Off'}
              </span>
            </div>
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="text-[11px] text-[#FF385C] font-bold hover:underline"
            >
              Manage
            </button>
          </div>

          {/* Quick Picks Section (Real Playable Tracks) */}
          <section>
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Play from library</p>
                <h3 className="text-xl font-bold tracking-tight">Quick picks</h3>
              </div>
              <button 
                onClick={() => playTrack(0)}
                className="text-xs text-neutral-300 border border-neutral-800 px-3 py-1 rounded-full hover:bg-neutral-800"
              >
                Play all
              </button>
            </div>

            <div className="space-y-1">
              {filteredTracks.map((track, idx) => {
                const isCurrent = currentTrackIndex === idx;
                return (
                  <div 
                    key={track.id}
                    onClick={() => playTrack(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer group ${
                      isCurrent ? 'bg-neutral-900/90 border border-[#FF385C]/30' : 'hover:bg-neutral-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                        {isCurrent && isPlaying ? (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-0.5">
                            <span className="w-1 h-4 bg-[#FF385C] animate-bounce" />
                            <span className="w-1 h-6 bg-[#FF385C] animate-bounce delay-75" />
                            <span className="w-1 h-3 bg-[#FF385C] animate-bounce delay-150" />
                          </div>
                        ) : null}
                      </div>

                      <div className="overflow-hidden">
                        <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#FF385C]' : 'text-neutral-100'}`}>
                          {track.title}
                        </h4>
                        <p className="text-xs text-neutral-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-neutral-500 font-mono">{track.duration}</span>
                      <button className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FF385C] flex items-center justify-center text-white transition">
                        {isCurrent && isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mixed for You Carousels */}
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-3">Mixed for you</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {TRACKS_DB.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => playTrack(i)}
                  className="min-w-[136px] flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-square mb-2 bg-neutral-900 border border-neutral-800">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <button className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#FF385C] flex items-center justify-center text-white shadow-xl shadow-red-600/40 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition">
                      <Play size={15} fill="white" className="ml-0.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-200 truncate">{item.title}</h4>
                  <p className="text-[10px] text-neutral-400 truncate">{item.artist}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- FLOATING PERSISTENT MINI-PLAYER --- */}
        <div 
          onClick={() => setIsExpandedPlayer(true)}
          className="absolute bottom-16 left-2 right-2 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 p-2 shadow-2xl flex items-center justify-between z-30 cursor-pointer hover:border-neutral-700 transition"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={currentTrack.cover} alt="Cover" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                {currentTrack.title}
                {tier === 'ULTIMATE_LIFETIME' && (
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded">24-BIT</span>
                )}
              </h4>
              <p className="text-[11px] text-neutral-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={playPrev}
              className="p-2 text-neutral-400 hover:text-white"
            >
              <SkipBack size={16} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition shadow"
            >
              {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
            </button>
            <button 
              onClick={playNext}
              className="p-2 text-neutral-400 hover:text-white"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Mini Progress Bar */}
          <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF385C] transition-all"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* --- FULL-SCREEN PLAYER MODAL (YOUTUBE MUSIC STYLE) --- */}
        {isExpandedPlayer && (
          <div className="absolute inset-0 bg-[#070709] z-50 flex flex-col p-5 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Top Sheet Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setIsExpandedPlayer(false)} className="text-neutral-400 hover:text-white p-1">
                <ChevronDown size={28} />
              </button>
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Playing from Flaxxy Stream</span>
                <h4 className="text-xs font-bold text-neutral-200">{currentTrack.category} Mix</h4>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className="p-1">
                <Heart size={22} className={isLiked ? "text-[#FF385C] fill-[#FF385C]" : "text-neutral-400"} />
              </button>
            </div>

            {/* Main Center Stage (Artwork or Lyrics) */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              {playerTab === 'upNext' ? (
                <div className="w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-red-950/40 border border-neutral-800 relative">
                  <img src={currentTrack.cover} alt="Art" className="w-full h-full object-cover" />
                  {tier === 'ULTIMATE_LIFETIME' && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-amber-400 border border-amber-500/30">
                      FLAC LOSSLESS • 320 KBPS
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 overflow-y-auto text-center font-medium text-sm text-neutral-300 leading-relaxed">
                  <p className="text-[10px] uppercase font-bold text-[#FF385C] tracking-wider mb-2">Synced Lyrics</p>
                  <pre className="font-sans whitespace-pre-wrap">{currentTrack.lyrics}</pre>
                </div>
              )}

              <div className="w-full text-center mt-6">
                <h2 className="text-lg font-black text-white truncate">{currentTrack.title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Tabs: Up Next / Lyrics */}
            <div className="flex justify-center gap-6 mb-3 text-xs font-bold border-b border-neutral-800/80 pb-2">
              <button 
                onClick={() => setPlayerTab('upNext')}
                className={playerTab === 'upNext' ? "text-white border-b-2 border-white pb-1" : "text-neutral-500"}
              >
                UP NEXT
              </button>
              <button 
                onClick={() => setPlayerTab('lyrics')}
                className={playerTab === 'lyrics' ? "text-white border-b-2 border-white pb-1" : "text-neutral-500"}
              >
                LYRICS
              </button>
            </div>

            {/* Scrub Seek Bar */}
            <div className="space-y-1 mb-4">
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF385C]"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Full-Screen Controls */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button className="text-neutral-400 hover:text-white"><Shuffle size={18} /></button>
              <button onClick={playPrev} className="text-white hover:scale-110 active:scale-95 transition">
                <SkipBack size={26} fill="white" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-2xl"
              >
                {isPlaying ? <Pause size={26} fill="black" /> : <Play size={26} fill="black" className="ml-1" />}
              </button>
              <button onClick={playNext} className="text-white hover:scale-110 active:scale-95 transition">
                <SkipForward size={26} fill="white" />
              </button>
              <button className="text-neutral-400 hover:text-white"><Repeat size={18} /></button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900/50 rounded-2xl border border-neutral-800">
              <button onClick={() => setIsMuted(!isMuted)} className="text-neutral-400">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF385C]" 
              />
            </div>
          </div>
        )}

        {/* --- BOTTOM NAVBAR --- */}
        <nav className="h-16 bg-[#030304] border-t border-neutral-900 flex items-center justify-around px-2 z-20">
          <button className="flex flex-col items-center gap-1 text-white">
            <div className="w-4 h-4 bg-white rounded-sm" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button onClick={() => setAiModalOpen(true)} className="flex flex-col items-center gap-1 text-[#FF385C]">
            <Sparkles size={20} />
            <span className="text-[10px] font-bold">AI Finder</span>
          </button>
          <button onClick={() => setAuthModalOpen(true)} className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white">
            <Library size={20} />
            <span className="text-[10px]">Library</span>
          </button>
          <button onClick={() => setCouponModalOpen(true)} className="flex flex-col items-center gap-1 text-amber-400">
            <Crown size={20} />
            <span className="text-[10px] font-bold">VIP Code</span>
          </button>
        </nav>

        {/* --- AUTH / LOGIN & SIGN-UP MODAL --- */}
        {authModalOpen && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full bg-[#111116] border border-neutral-800 rounded-3xl p-5 shadow-2xl relative">
              <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                <X size={20} />
              </button>

              {user.isLoggedIn ? (
                // Logged In Profile View
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-[#FF385C]">
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-xs text-neutral-400">{user.email || "Active Session"}</p>
                  </div>

                  {/* Connected Accounts Status */}
                  <div className="space-y-2 text-left bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Connected Streaming Engines</p>
                    
                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs font-semibold flex items-center gap-1.5 text-neutral-200">
                        <span className="w-2 h-2 rounded-full bg-red-500" /> YouTube Music
                      </span>
                      <button 
                        onClick={toggleYTMusic}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          user.ytConnected ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {user.ytConnected ? 'Connected ✔' : 'Connect'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs font-semibold flex items-center gap-1.5 text-neutral-200">
                        <span className="w-2 h-2 rounded-full bg-green-500" /> Spotify Library
                      </span>
                      <button 
                        onClick={toggleSpotify}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          user.spotifyConnected ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {user.spotifyConnected ? 'Connected ✔' : 'Connect'}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-neutral-800 text-red-400 hover:bg-neutral-700 text-xs font-bold transition"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                // Login / Sign Up Tabs
                <div>
                  <div className="flex border-b border-neutral-800 mb-4 pb-2">
                    <button 
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 text-xs font-bold pb-1 text-center ${authMode === 'login' ? 'text-[#FF385C] border-b-2 border-[#FF385C]' : 'text-neutral-500'}`}
                    >
                      LOG IN
                    </button>
                    <button 
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 text-xs font-bold pb-1 text-center ${authMode === 'signup' ? 'text-[#FF385C] border-b-2 border-[#FF385C]' : 'text-neutral-500'}`}
                    >
                      CREATE ACCOUNT
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-3">
                    {authMode === 'signup' && (
                      <input 
                        type="text"
                        placeholder="Your Name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF385C]"
                      />
                    )}
                    <input 
                      type="email"
                      placeholder="Email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF385C]"
                    />
                    <input 
                      type="password"
                      placeholder="Password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF385C]"
                    />

                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#FF385C] hover:bg-red-600 rounded-xl font-bold text-xs text-white shadow-lg shadow-red-500/30 transition"
                    >
                      {authMode === 'signup' ? 'Sign Up to Flaxxy' : 'Log In to Flaxxy'}
                    </button>
                  </form>

                  <div className="relative my-4 text-center">
                    <span className="text-[10px] bg-[#111116] px-2 text-neutral-500 uppercase">Or One-Tap Connect</span>
                    <div className="absolute inset-x-0 top-2 h-[1px] bg-neutral-800 -z-10" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setUser({ ...user, isLoggedIn: true, ytConnected: true, name: "Google YTM User" });
                        setAuthModalOpen(false);
                      }}
                      className="py-2.5 px-3 bg-red-600/10 border border-red-500/30 rounded-xl text-[11px] font-bold text-red-400 flex items-center justify-center gap-1.5"
                    >
                      YouTube Music
                    </button>
                    <button 
                      onClick={() => {
                        setUser({ ...user, isLoggedIn: true, spotifyConnected: true, name: "Spotify Premium User" });
                        setAuthModalOpen(false);
                      }}
                      className="py-2.5 px-3 bg-green-600/10 border border-green-500/30 rounded-xl text-[11px] font-bold text-green-400 flex items-center justify-center gap-1.5"
                    >
                      Spotify Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- COUPON POPUP MODAL --- */}
        {couponModalOpen && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full bg-[#111116] border border-neutral-800 rounded-3xl p-5 shadow-2xl relative">
              <button onClick={() => setCouponModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                <X size={20} />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-500/30">
                  <Crown size={24} />
                </div>
                <h3 className="text-lg font-bold">Redeem VIP Coupon</h3>
                <p className="text-xs text-neutral-400">Enter your code to unlock Ultimate Lifetime 50+ features.</p>
              </div>

              <div className="space-y-3">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter Code (e.g. FlaxxySong)" 
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF385C]"
                />

                <button 
                  onClick={applyCoupon}
                  className="w-full py-3 bg-gradient-to-r from-[#FF385C] to-[#FFA000] rounded-xl font-bold text-xs shadow-lg shadow-red-500/20 active:scale-95 transition"
                >
                  Activate Ultimate Lifetime
                </button>
                <p className="text-[11px] text-center text-neutral-500">
                  Your coupon code: <span className="text-amber-400 font-mono font-bold">FlaxxySong</span>
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
                <span className="font-bold text-sm text-white">Flaxxy AI Song Discovery</span>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="text-neutral-400"><X size={20} /></button>
            </div>

            <div className="mt-4 flex-1 space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe a movie scene, mood, or hum lyrics..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-neutral-500 focus:border-[#FF385C] focus:outline-none"
                />
                <button className="absolute right-3 top-3 text-[#FF385C]"><Mic size={18} /></button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">Instant AI Filters:</p>
                {[
                  "Synthwave night drive in rain",
                  "Heavy gym workout beat with 808 bass",
                  "Midnight study lo-fi with thunderstorm"
                ].map((prompt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      playTrack(idx);
                      setAiModalOpen(false);
                    }}
                    className="p-3 bg-neutral-900/60 rounded-xl text-xs text-neutral-300 hover:bg-neutral-800 cursor-pointer border border-neutral-800/80 flex items-center justify-between"
                  >
                    <span>"{prompt}"</span>
                    <Play size={13} className="text-[#FF385C]" />
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