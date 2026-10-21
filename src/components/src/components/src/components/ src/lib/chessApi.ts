
const API = 'https://api.chess.com/pub';

export type ClubMemberEntry = {
  username: string;
  joined: number;
  avatar?: string;
  profileUrl?: string;
};

type Player = {
  username?: string;
  avatar?: string;
  url?: string;
  title?: string;
  name?: string;
  country?: string;
  followers?: number;
};

type Club = {
  name?: string;
  members_count?: number;
};

export async function fetchPlayer(username: string): Promise<Player | null> {
  try {
    const response = await fetch(
      `${API}/player/${encodeURIComponent(username.toLowerCase())}`
    );
    if (!response.ok) return null;
    return (await response.json()) as Player;
  } catch {
    return null;
  }
}

export async function fetchClub(slug: string): Promise<Club | null> {
  try {
    const response = await fetch(
      `${API}/club/${encodeURIComponent(slug.toLowerCase())}`
    );
    if (!response.ok) return null;
    return (await response.json()) as Club;
  } catch {
    return null;
  }
}

export async function fetchNewestMembers(
  slug: string,
  limit = 3
): Promise<ClubMemberEntry[]> {
  try {
    const response = await fetch(
      `${API}/club/${encodeURIComponent(slug.toLowerCase())}/members`
    );
    if (!response.ok) return [];

    const data = (await response.json()) as {
      weekly?: { username: string; joined: number }[];
      monthly?: { username: string; joined: number }[];
      all_time?: { username: string; joined: number }[];
    };

    const members = [
      ...(data.weekly ?? []),
      ...(data.monthly ?? []),
      ...(data.all_time ?? []),
    ];

    const unique = new Map<string, ClubMemberEntry>();
    for (const member of members) {
      if (!member.username) continue;
      const key = member.username.toLowerCase();
      const previous = unique.get(key);
      if (!previous || member.joined > previous.joined) {
        unique.set(key, {
          username: member.username,
          joined: member.joined,
          profileUrl: `https://www.chess.com/member/${encodeURIComponent(member.username)}`,
        });
      }
    }

    return [...unique.values()]
      .sort((a, b) => b.joined - a.joined)
      .slice(0, limit);
  } catch {
    return [];
  }
}
