const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export type ContributionDay = {
  date: string;
  contributionCount: number;
};

export type GitHubRepo = {
  name: string;
  createdAt: string;
  url: string;
};

export async function fetchGitHubContributions(
  username = GITHUB_USERNAME,
  year: number = new Date().getFullYear() // default to current year
) {
  try {
    // Start of the year
    const from = new Date(Date.UTC(year, 0, 1)); // Jan 1, YYYY
    const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // Dec 31, YYYY

    const oneWeekAgo = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);

    const query = `
      query ($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 100) {
              contributions(first: 100) { nodes { occurredAt } }
            }
            pullRequestContributions(first: 100) { nodes { occurredAt } }
            issueContributions(first: 100) { nodes { occurredAt } }
            pullRequestReviewContributions(first: 100) { nodes { occurredAt } }
          }
          repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes { name createdAt url }
          }
        }
      }
    `;

    const variables = { username, from: from.toISOString(), to: to.toISOString() };

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);

    const collection = json.data.user.contributionsCollection;
    const repos = json.data.user.repositories.nodes;

    // Build contributions calendar
    const trueCalendar: Record<string, { commits: number; prs: number; issues: number; reviews: number; total: number }> = {};

    const add = (date: string, type: keyof typeof trueCalendar[string]) => {
      if (!trueCalendar[date]) trueCalendar[date] = { commits: 0, prs: 0, issues: 0, reviews: 0, total: 0 };
      trueCalendar[date][type]++;
      trueCalendar[date].total++;
    };

    collection.commitContributionsByRepository.forEach((repo: any) =>
      repo.contributions.nodes.forEach((c: any) => add(c.occurredAt.split("T")[0], "commits"))
    );
    collection.pullRequestContributions.nodes.forEach((pr: any) => add(pr.occurredAt.split("T")[0], "prs"));
    collection.issueContributions.nodes.forEach((issue: any) => add(issue.occurredAt.split("T")[0], "issues"));
    collection.pullRequestReviewContributions.nodes.forEach((rev: any) => add(rev.occurredAt.split("T")[0], "reviews"));

    const weeklyNewRepos: GitHubRepo[] = [];
    for (const repo of repos) {
      const createdAtTime = new Date(repo.createdAt).getTime();
      if (createdAtTime >= oneWeekAgo.getTime()) {
        weeklyNewRepos.push(repo);
      }
    }

    const weeklyNewReposCount = weeklyNewRepos.length;

    return {
      contributionsCollection: collection,
      trueCalendar,
      weeklyNewReposCount,
      weeklyNewRepos,
      totalRepositories: repos.length,
      repositories: repos, 
    };
  } catch (err: any) {
    console.error(err);
    return { error: "Failed to fetch GitHub contributions", weeklyNewReposCount: 0, totalRepositories: 0 };
  }
}

