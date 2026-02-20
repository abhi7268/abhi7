import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { leetcodeUser, codeforcesUser } = await req.json();
  const results: any = { leetcode: [], codeforces: [] };

  try {
    // 1. LeetCode Sync Logic
    if (leetcodeUser) {
      const lcQuery = `query { recentSubmissionList(username: "${leetcodeUser}", limit: 20) { title statusDisplay } }`;
      const lcRes = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: lcQuery }),
      });
      const lcData = await lcRes.json();
      results.leetcode = lcData.data.recentSubmissionList || [];
    }

    // 2. Codeforces Sync Logic
    if (codeforcesUser) {
      const cfRes = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesUser}&from=1&count=20`);
      const cfData = await cfRes.json();
      if (cfData.status === "OK") {
        results.codeforces = cfData.result.map((sub: any) => ({
          title: sub.problem.name,
          status: sub.verdict === "OK" ? "Accepted" : "Wrong"
        }));
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}