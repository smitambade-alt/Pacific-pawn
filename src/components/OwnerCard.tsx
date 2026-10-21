import { useEffect, useState } from 'react';
import { Crown, ExternalLink } from 'lucide-react';
import { OWNER } from '@/config';
import { fetchPlayer } from '@/lib/chessApi';

export default function OwnerCard() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    if (OWNER.useLiveAvatar) {
      fetchPlayer(OWNER.apiUsername).then((p) => {
        if (active && p?.avatar) setAvatar(p.avatar);
      });
    }
    return () => {
      active = false;
    };
  }, []);

  const src = avatar || OWNER.avatarFallback;

  return (
    <section className="glass-card p-5 animate-rise-in">
      <header className="flex items-center gap-2 mb-4">
        <Crown size={14} className="text-cyan-400" />
        <h2 className="card-title">Owner On Board</h2>
      </header>

      <div className="flex flex-col items-center text-center">
        <a
          href={OWNER.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="avatar-ring block transition-transform hover:scale-[1.03]"
          aria-label={`Open ${OWNER.username}'s Chess.com profile`}
        >
          {!failed ? (
            <img
              src={src}
              alt={`${OWNER.username} avatar`}
              width={84}
              height={84}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`h-[84px] w-[84px] rounded-full object-cover bg-ocean-700 transition-opacity duration-500 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="h-[84px] w-[84px] rounded-full bg-ocean-700 flex items-center justify-center text-cyan-400 font-display text-2xl font-bold">
              {OWNER.username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </a>

        <a
          href={OWNER.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 font-display text-lg font-semibold text-mist hover:text-cyan-300 transition-colors"
        >
          {OWNER.username}
          <ExternalLink size={13} className="text-cyan-400/70" />
        </a>

        <p className="mt-1 text-xs text-muted">Club Owner &middot; Founder</p>
      </div>
    </section>
  );
}
