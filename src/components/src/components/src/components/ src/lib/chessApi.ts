/**
 * Chess.com public API helpers.
 * Docs: https://www.chess.com/news/view/published-data-api
 * The pub API supports CORS (access-control-allow-origin: *) so it is safe to
 * call directly from the browser. No API key or token is required.
 */

const API = 'https://api.chess.com/pub';

export interface ClubInfo {
  name: string;
  club_id: number;
  members_count: number;
  created: number;
  url: string;
  icon?: string;
  description?: string;
}

export interface ClubMemberEntry {
  username: string;
  joined: number; // unix seconds
}

export interface PlayerProfile {
  username: string;
  avatar?: string;
  url: string;
  name?: string;
  joined?: number;
  status?: string;
}

export async function fetchClub(slug: string): Promise<ClubInfo | null> {
  try {
    const res = await fetch(`${API}/club/${slug}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name,
      club_id: data.club_id,
      members_count: data.members_count,
      created: data.created,
      url: data.url,
      icon: data.icon,
      description: data.description,
    };
  } catch {
    return null;
  }
}

/**
 * Returns all club members sorted newest-first by join timestamp.
 * The API groups members into weekly/monthly/all_time; we merge and sort.
 */
export async function fetchClubMembers(slug: string): Promise<ClubMemberEntry[]> {
  try {
    const res = await fetch(`${API}/club/${slug}/members`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data = await res.json();
    const all: ClubMemberEntry[] = [
      ...(data.weekly || []),
      ...(data.monthly || []),
      ...(data.all_time || []),
    ];
    const seen = new Set<string>();
    const unique = all.filter((m) => {
      if (seen.has(m.username)) return false;
      seen.add(m.username);
      return true;
    });
    return unique.sort((a, b) => (b.joined || 0) - (a.joined || 0));
  } catch {
    return [];
  }
}

export async function fetchPlayer(username: string): Promise<PlayerProfile | null> {
  try {
    const res = await fetch(`${API}/player/${username.toLowerCase()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      username: data.username,
      avatar: data.avatar,
      url: data.url,
      name: data.name,
      joined: data.joined,
      status: data.status,
    };
  } catch {
    return null;
  }
}

/** Newest-first members with their profile (avatar/url). Limited to `count`. */
export async function fetchNewestMembers(
  slug: string,
  count: number,
): Promise<(ClubMemberEntry & { avatar?: string; profileUrl?: string })[]> {
  const members = await fetchClubMembers(slug);
  const top = members.slice(0, count);
  const withProfiles = await Promise.all(
    top.map(async (m) => {
      const p = await fetchPlayer(m.username);
      return {
        ...m,
        avatar: p?.avatar,
        profileUrl: p?.url ?? `https://www.chess.com/member/${m.username}`,
      };
    }),
  );
  return withProfiles;
}
