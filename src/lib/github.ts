import { statsFallback } from "@/lib/site";

export type GitHubStats = {
  username: string;
  publicRepos: number;
  followers: number;
  following: number;
  stars: number;
  isFallback: boolean;
};

/**
 * Fetch public GitHub profile stats (cached for 1h via the Next data cache).
 * Falls back to placeholder numbers if the handle doesn't resolve so the UI
 * never looks broken. Set GITHUB_TOKEN to raise the rate limit.
 */
export async function getGitHubStats(username: string): Promise<GitHubStats> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "vour-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!userRes.ok) throw new Error(`GitHub user request failed: ${userRes.status}`);
    const user = await userRes.json();

    let stars = 0;
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers, next: { revalidate: 3600 } },
      );
      if (reposRes.ok) {
        const repos: Array<{ stargazers_count?: number }> = await reposRes.json();
        stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
      }
    } catch {
      // best-effort
    }

    return {
      username,
      publicRepos: user.public_repos ?? statsFallback.publicRepos,
      followers: user.followers ?? statsFallback.followers,
      following: user.following ?? statsFallback.following,
      stars: stars || statsFallback.stars,
      isFallback: false,
    };
  } catch {
    return { username, ...statsFallback, isFallback: true };
  }
}
