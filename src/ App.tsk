import OwnerCard from '@/components/OwnerCard';
import NewestMembers from '@/components/NewestMembers';
import MusicPlayer from '@/components/MusicPlayer';
import MilestoneTracker from '@/components/MilestoneTracker';
import ClubCalendar from '@/components/ClubCalendar';
import { CLUB } from '@/config';

export default function App() {
  return (
    <div className="ocean-bg">
      <div className="relative z-10 mx-auto max-w-md px-4 py-6 sm:py-8 space-y-5">
        {/* Compact club header */}
        <header className="text-center pt-2 pb-1">
          <a
            href={CLUB.clubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-col items-center group"
          >
            <span className="font-display text-2xl font-extrabold tracking-tight text-mist group-hover:text-cyan-300 transition-colors">
              Pacific Pawns
            </span>
            <span className="text-[0.65rem] tracking-[0.3em] uppercase text-cyan-400/70 mt-1">
              Chess Club
            </span>
          </a>
        </header>

        <OwnerCard />
        <NewestMembers />
        <MusicPlayer />
        <MilestoneTracker />
        <ClubCalendar />

        <footer className="text-center text-[0.65rem] text-muted/50 pt-2 pb-4">
          Data via Chess.com public API &middot; Pacific Pawns
        </footer>
      </div>
    </div>
  );
}
