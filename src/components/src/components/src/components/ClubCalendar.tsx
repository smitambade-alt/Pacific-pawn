import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Sparkles } from 'lucide-react';
import { CLUB_EVENTS, CALENDAR_RANGE } from '@/config';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n: number) {
return n.toString().padStart(2, '0');
}
function key(y: number, m: number, d: number) {
return ${y}-${pad(m + 1)}-${pad(d)};
}

const today = new Date();
const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());

export default function ClubCalendar() {
const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
const [selected, setSelected] = useState<string>(todayKey);

const { start, end } = CALENDAR_RANGE;

const canGoPrev = useMemo(() => {
const prev = new Date(view.y, view.m - 1, 1);
return prev >= new Date(start.getFullYear(), start.getMonth(), 1);
}, [view, start]);

const canGoNext = useMemo(() => {
const next = new Date(view.y, view.m + 1, 1);
return next <= new Date(end.getFullYear(), end.getMonth(), 1);
}, [view, end]);

const cells = useMemo(() => {
const first = new Date(view.y, view.m, 1);
const startDow = first.getDay();
const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
const arr: (number | null)[] = [];
for (let i = 0; i < startDow; i++) arr.push(null);
for (let d = 1; d <= daysInMonth; d++) arr.push(d);
while (arr.length % 7 !== 0) arr.push(null);
return arr;
}, [view]);

const selectedEvents = CLUB_EVENTS[selected] || [];

const prev = () => canGoPrev && setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: v.m === 0 ? 11 : v.m - 1 }));
const next = () => canGoNext && setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: v.m === 11 ? 0 : v.m + 1 }));

return (
<section className="glass-card p-5 animate-rise-in" style={{ animationDelay: '0.2s' }}>
<header className="flex items-center gap-2 mb-4">
<CalendarDays size={14} className="text-cyan-400" />
<h2 className="card-title">Club Calendar</h2>
</header>

{/* Month nav */}  
  <div className="flex items-center justify-between mb-3">  
    <button  
      onClick={prev}  
      disabled={!canGoPrev}  
      className="p-1.5 rounded-lg text-mist hover:text-cyan-300 hover:bg-ocean-600/50 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"  
      aria-label="Previous month"  
    >  
      <ChevronLeft size={18} />  
    </button>  
    <p className="font-display font-semibold text-mist text-sm">  
      {MONTHS[view.m]} {view.y}  
    </p>  
    <button  
      onClick={next}  
      disabled={!canGoNext}  
      className="p-1.5 rounded-lg text-mist hover:text-cyan-300 hover:bg-ocean-600/50 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"  
      aria-label="Next month"  
    >  
      <ChevronRight size={18} />  
    </button>  
  </div>  

  {/* Weekday header */}  
  <div className="grid grid-cols-7 gap-1 mb-1">  
    {DOW.map((d) => (  
      <div key={d} className="text-center text-[0.6rem] font-medium text-muted py-1">  
        {d}  
      </div>  
    ))}  
  </div>  

  {/* Day grid */}  
  <div className="grid grid-cols-7 gap-1">  
    {cells.map((d, i) => {  
      if (d === null) return <div key={i} />;  
      const k = key(view.y, view.m, d);  
      const isToday = k === todayKey;  
      const isSelected = k === selected;  
      const hasEvent = !!CLUB_EVENTS[k];  
      return (  
        <button  
          key={i}  
          onClick={() => setSelected(k)}  
          className={`relative aspect-square rounded-lg text-xs flex items-center justify-center transition-all  
            ${isSelected ? 'bg-cyan-400 text-ocean-900 font-bold' : 'text-mist hover:bg-ocean-600/60'}  
            ${isToday && !isSelected ? 'ring-1 ring-cyan-400/60 font-semibold' : ''}`}  
          aria-label={`${MONTHS[view.m]} ${d}, ${view.y}${hasEvent ? ', has event' : ''}`}  
        >  
          {d}  
          {hasEvent && (  
            <span  
              className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-ocean-900' : 'bg-cyan-400'}`}  
            />  
          )}  
        </button>  
      );  
    })}  
  </div>  

  {/* Selected events */}  
  <div className="wave-divider my-4" />  
  <div className="min-h-[80px]">  
    <p className="text-xs text-muted mb-2">  
      {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}  
    </p>  
    {selectedEvents.length === 0 ? (  
      <div className="text-center py-4">  
        <Sparkles size={18} className="mx-auto text-cyan-400/40 mb-1.5" />  
        <p className="text-xs text-muted">No events scheduled.</p>  
        <p className="text-[0.65rem] text-muted/60 mt-0.5">Pick another date to explore.</p>  
      </div>  
    ) : (  
      <ul className="space-y-2">  
        {selectedEvents.map((e, i) => (  
          <li key={i} className="p-2.5 rounded-lg bg-ocean-600/40 border border-cyan-400/20">  
            <p className="text-sm font-medium text-mist">{e.title}</p>  
            {e.time && <p className="text-xs text-cyan-300/80 mt-0.5">{e.time}</p>}  
            {e.description && <p className="text-xs text-muted mt-1 leading-relaxed">{e.description}</p>}  
          </li>  
        ))}  
      </ul>  
    )}  
  </div>  
</section>

);
  }
