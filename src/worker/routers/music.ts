import { eq } from "drizzle-orm";
import { kvCache } from "../db/schema";
import { now, publicProcedure, router } from "../trpc";

interface TopTrack {
  name: string;
  artist: string;
  url: string;
}

const CACHE_KEY = "spotify-top-track";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// David's most played track over roughly the last four weeks, per Spotify's
// top-tracks endpoint. Deliberately not "now playing": it shows a favorite,
// not a live activity feed.
export const musicRouter = router({
  topTrack: publicProcedure.query(async ({ ctx }): Promise<TopTrack | null> => {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
      ctx.env;
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
      return null;
    }

    const [cached] = await ctx.db
      .select()
      .from(kvCache)
      .where(eq(kvCache.key, CACHE_KEY));
    if (cached && Date.now() - Date.parse(cached.updatedAt) < CACHE_TTL_MS) {
      return JSON.parse(cached.value) as TopTrack | null;
    }

    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            authorization: `Basic ${btoa(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            )}`,
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: SPOTIFY_REFRESH_TOKEN,
          }),
        }
      );
      if (!tokenResponse.ok) return cachedOrNull(cached);
      const { access_token } = (await tokenResponse.json()) as {
        access_token: string;
      };

      const trackResponse = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1",
        { headers: { authorization: `Bearer ${access_token}` } }
      );
      if (!trackResponse.ok) return cachedOrNull(cached);
      const data = (await trackResponse.json()) as {
        items?: Array<{
          name: string;
          artists: Array<{ name: string }>;
          external_urls: { spotify: string };
        }>;
      };

      const item = data.items?.[0];
      const track: TopTrack | null = item
        ? {
            name: item.name,
            artist: item.artists.map((artist) => artist.name).join(", "),
            url: item.external_urls.spotify,
          }
        : null;

      const timestamp = now();
      await ctx.db
        .insert(kvCache)
        .values({
          key: CACHE_KEY,
          value: JSON.stringify(track),
          updatedAt: timestamp,
        })
        .onConflictDoUpdate({
          target: kvCache.key,
          set: { value: JSON.stringify(track), updatedAt: timestamp },
        });

      return track;
    } catch {
      return cachedOrNull(cached);
    }
  }),
});

// A stale cache entry beats an empty footer when Spotify has a bad moment.
function cachedOrNull(
  cached: { value: string } | undefined
): TopTrack | null {
  return cached ? (JSON.parse(cached.value) as TopTrack | null) : null;
}
