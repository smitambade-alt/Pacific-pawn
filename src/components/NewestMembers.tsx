import { useEffect, useState } from 'react';
import { UserPlus, ExternalLink } from 'lucide-react';
import { CLUB } from '@/config';
import { fetchNewestMembers, type ClubMemberEntry } from '@/lib/chessApi';

type Member = ClubMemberEntry & { avatar?: string; profileUrl?: string };

function formatDate(unix: number): string {
try {
return new Date(unix * 1000).toLocaleDateString('en-US', {
month: 'short',
day: 'numeric',
year: 'numeric',
});
} catch {
return '—';
}
}

function Avatar({ src, name }: { src?: string; name: string }) {
const [failed, setFailed] = useState(false);
if (!src || failed) {
return (
<div className="h-9 w-9 rounded-full bg-ocean-600 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0">
{name.slice(0, 2).toUpperCase()}
</div>
);
}
return (
<img
src={src}
alt={name}
loading="lazy"
onError={() => setFailed(true)}
className="h-9 w-9 rounded-full object-cover ring-1 ring-cyan-400/30 shrink-0"
/>
);
}

export default function NewestMembers() {
const [members, setMembers] = useState<Member[] | null>(null);
const [error, setError] = useState(false);

useEffect(() => {
let active = true;
fetchNewestMembers(CLUB.slug, 3)
.then((m) => {
if (active) {
if (m.length === 0) setError(true);
else setMembers(m);
}
})
.catch(() => active && setError(true));
return () => {
active = false;
};
}, []);

return (
<section className="glass-card p-5 animate-rise-in" style={{ animationDelay: '0.05s' }}>
<header className="flex items-center gap-2 mb-4">
<UserPlus size={14} className="text-cyan-400" />
<h2 className="card-title">Newest Club Members</h2>
</header>

{members === null && !error && (  
    <ul className="space-y-3">  
      {[0, 1, 2].map((i) => (  
        <li key={i} className="flex items-center gap-3">  
          <div className="h-9 w-9 rounded-full shimmer shrink-0" />  
          <div className="flex-1 space-y-1.5">  
            <div className="h-3 w-24 rounded shimmer" />  
            <div className="h-2.5 w-16 rounded shimmer" />  
          </div>  
        </li>  
      ))}  
    </ul>  
  )}  

  {error && (  
    <div className="text-center py-4">  
      <p className="text-sm text-muted">Couldn't load live member data.</p>  
      <p className="text-xs text-muted/70 mt-1">Chess.com API may be rate-limited. Try again shortly.</p>  
    </div>  
  )}  

  {members && members.length > 0 && (  
    <ul className="space-y-3">  
      {members.map((m) => (  
        <li  
          key={m.username}  
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-ocean-600/40 transition-colors"  
        >  
          <a  
            href={m.profileUrl}  
            target="_blank"  
            rel="noreferrer"  
            className="shrink-0"  
            aria-label={`Open ${m.username} profile`}  
          >  
            <Avatar src={m.avatar} name={m.username} />  
          </a>  
          <div className="flex-1 min-w-0">  
            <a  
              href={m.profileUrl}  
              target="_blank"  
              rel="noreferrer"  
              className="inline-flex items-center gap-1 text-sm font-medium text-mist hover:text-cyan-300 transition-colors truncate"  
            >  
              <span className="truncate">{m.username}</span>  
              <ExternalLink size={11} className="text-cyan-400/50 shrink-0" />  
            </a>  
            <p className="text-xs text-muted">Joined {formatDate(m.joined)}</p>  
          </div>  
          <span className="text-[0.6rem] font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 shrink-0">  
            NEW  
          </span>  
        </li>  
      ))}  
    </ul>  
  )}  
</section>

);
      }
