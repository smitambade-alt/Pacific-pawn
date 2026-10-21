import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, AlertCircle, Loader2 } from 'lucide-react';
import { MUSIC } from '@/config';

function fmt(t: number): string {
if (!isFinite(t) || t < 0) return '0:00';
const m = Math.floor(t / 60);
const s = Math.floor(t % 60);
return ${m}:${s.toString().padStart(2, '0')};
}

export default function MusicPlayer() {
const tracks = MUSIC.tracks;
const [idx, setIdx] = useState(0);
const [playing, setPlaying] = useState(false);
const [current, setCurrent] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(0.7);
const [muted, setMuted] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const audioRef = useRef<HTMLAudioElement | null>(null);
const track = tracks[idx];

useEffect(() => {
const audio = new Audio();
audioRef.current = audio;
audio.preload = 'metadata';

const onTime = () => setCurrent(audio.currentTime);  
const onDur = () => setDuration(audio.duration);  
const onWaiting = () => setLoading(true);  
const onPlaying = () => {  
  setLoading(false);  
  setError(null);  
};  
const onError = () => {  
  setError('Audio could not be played. The source may be unavailable.');  
  setPlaying(false);  
  setLoading(false);  
};  

audio.addEventListener('timeupdate', onTime);  
audio.addEventListener('durationchange', onDur);  
audio.addEventListener('waiting', onWaiting);  
audio.addEventListener('playing', onPlaying);  
audio.addEventListener('error', onError);  

return () => {  
  audio.pause();  
  audio.removeEventListener('timeupdate', onTime);  
  audio.removeEventListener('durationchange', onDur);  
  audio.removeEventListener('waiting', onWaiting);  
  audio.removeEventListener('playing', onPlaying);  
  audio.removeEventListener('error', onError);  
};

}, []);

// Load source when track changes.
useEffect(() => {
const audio = audioRef.current;
if (!audio) return;
setError(null);
setLoading(true);
setPlaying(false);
setCurrent(0);
setDuration(0);
audio.src = track.audioUrl;
audio.load();
// readyState check
const onCanPlay = () => setLoading(false);
audio.addEventListener('canplay', onCanPlay, { once: true });
return () => audio.removeEventListener('canplay', onCanPlay);
}, [idx, track.audioUrl]);

useEffect(() => {
const audio = audioRef.current;
if (!audio) return;
audio.volume = muted ? 0 : volume;
}, [volume, muted]);

const togglePlay = async () => {
const audio = audioRef.current;
if (!audio || error) return;
try {
if (playing) {
audio.pause();
setPlaying(false);
} else {
await audio.play();
setPlaying(true);
}
} catch {
setError('Playback was blocked or failed. Tap play again.');
}
};

const skip = (dir: -1 | 1) => {
const audio = audioRef.current;
audio?.pause();
setPlaying(false);
setIdx((i) => (i + dir + tracks.length) % tracks.length);
};

const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
const audio = audioRef.current;
if (!audio || !duration) return;
const t = Number(e.target.value);
audio.currentTime = t;
setCurrent(t);
};

const pct = duration ? (current / duration) * 100 : 0;

return (
<section className="glass-card p-5 animate-rise-in" style={{ animationDelay: '0.1s' }}>
<header className="flex items-center gap-2 mb-4">
<Music2 size={14} className="text-cyan-400" />
<h2 className="card-title">Now Playing</h2>
</header>

<div className="flex items-center gap-4">  
    {/* Artwork with equalizer overlay */}  
    <div className="relative shrink-0">  
      <div className="absolute -inset-1 rounded-xl bg-cyan-400/20 blur-md animate-pulse-glow" />  
      <img  
        src={track.artwork}  
        alt={`${track.title} artwork`}  
        className="relative h-16 w-16 rounded-xl object-cover ring-1 ring-cyan-400/30"  
        onError={(e) => {  
          (e.currentTarget as HTMLImageElement).style.display = 'none';  
        }}  
      />  
      <div  
        className={`absolute bottom-1 right-1 flex items-end gap-0.5 h-4 ${playing ? '' : 'eq-paused'}`}  
        aria-hidden  
      >  
        {[0, 1, 2].map((i) => (  
          <span  
            key={i}  
            className="eq-bar w-0.5 bg-cyan-300 rounded-full"  
            style={{ height: '100%', animationDelay: `${i * 0.15}s` }}  
          />  
        ))}  
      </div>  
    </div>  

    <div className="min-w-0 flex-1">  
      <p className="font-display font-semibold text-mist truncate">{track.title}</p>  
      <p className="text-sm text-cyan-300/80 truncate">{track.artist}</p>  
    </div>  
  </div>  

  {/* Progress bar */}  
  <div className="mt-4">  
    <div className="relative h-1.5 rounded-full bg-ocean-600 overflow-hidden">  
      <div  
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full"  
        style={{ width: `${pct}%` }}  
      />  
    </div>  
    <input  
      type="range"  
      className="ocean-range w-full -mt-1"  
      min={0}  
      max={duration || 0}  
      step={0.1}  
      value={current}  
      onChange={seek}  
      aria-label="Seek"  
      disabled={!duration}  
    />  
    <div className="flex justify-between text-[0.65rem] text-muted -mt-1">  
      <span>{fmt(current)}</span>  
      <span>{fmt(duration)}</span>  
    </div>  
  </div>  

  {/* Controls */}  
  <div className="mt-3 flex items-center justify-between">  
    <button  
      onClick={() => skip(-1)}  
      className="p-2 rounded-lg text-mist hover:text-cyan-300 hover:bg-ocean-600/50 transition-colors"  
      aria-label="Previous track"  
    >  
      <SkipBack size={18} />  
    </button>  

    <button  
      onClick={togglePlay}  
      disabled={loading || !!error}  
      className="p-3 rounded-full bg-cyan-400 text-ocean-900 hover:bg-cyan-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/30"  
      aria-label={playing ? 'Pause' : 'Play'}  
    >  
      {loading ? <Loader2 size={20} className="animate-spin" /> : playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}  
    </button>  

    <button  
      onClick={() => skip(1)}  
      className="p-2 rounded-lg text-mist hover:text-cyan-300 hover:bg-ocean-600/50 transition-colors"  
      aria-label="Next track"  
    >  
      <SkipForward size={18} />  
    </button>  

    <div className="flex items-center gap-1.5 w-24">  
      <button  
        onClick={() => setMuted((m) => !m)}  
        className="p-1.5 rounded-lg text-mist hover:text-cyan-300 transition-colors"  
        aria-label={muted ? 'Unmute' : 'Mute'}  
      >  
        {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}  
      </button>  
      <input  
        type="range"  
        className="ocean-range w-full"  
        min={0}  
        max={1}  
        step={0.01}  
        value={muted ? 0 : volume}  
        onChange={(e) => {  
          setVolume(Number(e.target.value));  
          setMuted(false);  
        }}  
        aria-label="Volume"  
      />  
    </div>  
  </div>  

  {error && (  
    <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">  
      <AlertCircle size={14} className="mt-0.5 shrink-0" />  
      <span>{error}</span>  
    </div>  
  )}  
</section>

);
      }
