import { useEffect, useMemo, useState } from 'react';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { CLUB, MILESTONES } from '@/config';
import { fetchClub } from '@/lib/chessApi';

export default function MilestoneTracker() {
const [count, setCount] = useState<number>(MILESTONES.initialCount);
const [live, setLive] = useState(false);

useEffect(() => {
let active = true;
fetchClub(CLUB.slug).then((c) => {
if (active && c && typeof c.members_count === 'number') {
setCount(c.members_count);
setLive(true);
}
});
return () => {
active = false;
};
}, []);

const target = useMemo(() => {
return MILESTONES.targets.find((t) => count < t) ?? MILESTONES.targets[MILESTONES.targets.length - 1];
}, [count]);

const reached = count >= target;
const pct = Math.min(100, Math.round((count / target) * 100));
const remaining = Math.max(0, target - count);

return (
<section className="glass-card p-5 animate-rise-in" style={{ animationDelay: '0.15s' }}>
<header className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2">
<Users size={14} className="text-cyan-400" />
<h2 className="card-title">Milestone Tracker</h2>
</div>
<span
className={text-[0.6rem] px-2 py-0.5 rounded-full border ${   live ? 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10' : 'border-muted/30 text-muted bg-muted/5'   }}
>
{live ? 'LIVE' : 'Manual'}
</span>
</header>

<div className="flex items-end justify-between mb-2">  
    <div>  
      <p className="font-display text-3xl font-bold text-mist leading-none">{count}</p>  
      <p className="text-xs text-muted mt-1">members</p>  
    </div>  
    <div className="text-right">  
      <p className="font-display text-lg font-semibold text-cyan-300 leading-none">{target}</p>  
      <p className="text-xs text-muted mt-1">next goal</p>  
    </div>  
  </div>  

  {/* Progress bar */}  
  <div className="relative h-2.5 rounded-full bg-ocean-600 overflow-hidden">  
    <div  
      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-200 transition-all duration-700 ease-out"  
      style={{ width: `${pct}%` }}  
    />  
    {reached && (  
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />  
    )}  
  </div>  

  <div className="flex justify-between mt-2 text-xs">  
    <span className="text-cyan-300 font-medium">{pct}%</span>  
    <span className="text-muted">{remaining} to go</span>  
  </div>  

  <p className="mt-3 text-xs text-muted/90 leading-relaxed">  
    {reached ? (  
      <span className="inline-flex items-center gap-1.5 text-cyan-300">  
        <Sparkles size={12} /> Milestone reached! Next stop: {MILESTONES.targets[MILESTONES.targets.indexOf(target) + 1] ?? '∞'}  
      </span>  
    ) : (  
      <>  
        <TrendingUp size={12} className="inline mr-1 text-cyan-400" />  
        {remaining} more members to hit our first {target}. Every invite brings Pacific Pawns closer!  
      </>  
    )}  
  </p>  

  {/* Confetti burst when reached */}  
  {reached && (  
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>  
      {Array.from({ length: 40 }).map((_, i) => (  
        <span  
          key={i}  
          className="absolute top-0 block w-1.5 h-1.5 rounded-sm animate-confetti"  
          style={{  
            left: `${Math.random() * 100}%`,  
            backgroundColor: ['#36C6C0', '#7FE5E0', '#DDEAF2'][i % 3],  
            animationDuration: `${1.8 + Math.random() * 1.5}s`,  
            animationDelay: `${Math.random() * 0.4}s`,  
          }}  
        />  
      ))}  
    </div>  
  )}  
</section>

);
    }
