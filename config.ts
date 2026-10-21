/**
 * Pacific Pawns — central configuration.
 * Edit values here to customize the sidebar without touching component code.
 */

export const CLUB = {
  /** Chess.com club slug (from the public API URL). */
  slug: 'pacific-pawns',
  name: 'Pacific Pawns',
  clubUrl: 'https://www.chess.com/club/pacific-pawns',
};

export const OWNER = {
  username: 'SMiiiiiiTT',
  /** Chess.com username (lowercased) used for the public API. */
  apiUsername: 'smiiiiiittt',
  profileUrl: 'https://www.chess.com/member/SMiiiiiiTTT',
  /**
   * Avatar fallback: the live avatar is auto-synced from the Chess.com public API.
   * If the API is unreachable or returns no avatar, this URL is used instead.
   * To force a fixed image, set useLiveAvatar to false.
   */
  avatarFallback:
    'https://images.chesscomfiles.com/uploads/v1/user/587007560.d27bc317.200x200o.51ad0643653d.jpg',
  useLiveAvatar: true,
};

export const MUSIC = {
  tracks: [
    {
      title: 'Runaway',
      artist: 'AURORA',
      audioUrl: 'https://files.catbox.moe/ice6hn.mp3',
      artwork:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&q=80',
    },
  ],
};

export const MILESTONES = {
  /** Starting count used only before the live API responds. */
  initialCount: 4,
  /** Ordered list of milestone targets. When the current one is reached, the next is used. */
  targets: [100, 250, 500, 1000],
};

/** Club calendar range (inclusive). */
export const CALENDAR = {
  startYear: 2026,
  startMonth: 9, // 0-indexed: 9 = October
  endYear: 2029,
  endMonth: 11, // 0-indexed: 11 = December 2030? No -> we cap at Jan 2030 (month index 0 of 2030)
};

/**
 * Club events. Key = 'YYYY-MM-DD'. These are clearly editable placeholders;
 * replace with real club events as they are scheduled.
 */
export const CLUB_EVENTS: Record<string, { title: string; time?: string; description?: string }[]> = {
  '2026-10-25': [{ title: 'Opening Night Arena', time: '18:00 UTC', description: 'Kickoff Swiss + blitz arena. All members welcome.' }],
  '2026-11-08': [{ title: 'Pacific Pawns Swiss', time: '17:00 UTC', description: '5-round Swiss, 10+0 time control.' }],
  '2026-11-22': [{ title: 'Blitz Brawl', time: '19:00 UTC', description: '3+2 blitz arena.' }],
  '2026-12-13': [{ title: 'Holiday Rapid Cup', time: '18:00 UTC', description: '15+10 rapid tournament.' }],
  '2027-01-10': [{ title: 'New Year Resolve Arena', time: '18:00 UTC', description: 'Start the year with a club arena.' }],
};

/** Range helper for the calendar. */
export const CALENDAR_RANGE = {
  start: new Date(2026, 9, 1), // Oct 1, 2026
  end: new Date(2030, 0, 31), // Jan 31, 2030
};
