# How it works

## The page
One HTML file with no build step. It renders from three collections (`jobs`, `events`, `trends`). Every change you make (Applied, Going, Hide, Follow-up sent) is one `update()` on one document, then the page re-renders from the database snapshot.

## Status rules
- `new` and `ready` count as "to apply". A posting past its `deadline` shows as Not available without changing the saved status.
- Marking Applied also sets `appliedDate`, which feeds the weekly goal ring, the streak, the funnel and the timeline.
- Follow-up appears 7 days after `appliedDate` until you press "Follow-up sent".

## Hottest
`isHot(job)` is true when the job is to-apply, not hidden, not rejected, scores 40 or more and `ageHours` is 72 or less. `ageHours` uses `firstSeen`, else the posted date at midnight. The list is sorted newest first in 12-hour steps, then by score.

## Scoring method (example)
Start from fit with your target roles, then adjust:
1. **Role fit** with your lanes (for example deals and consulting highest, analyst roles inside a bank next).
2. **Skills match**: count the posting's tools that you can honestly claim.
3. **Term check**: keep a posting as your term only when it says your start month or a matching term. Winter, fall and full-time roles are rejected.
4. **Employer bonus** for companies on your priority list.
Strong is 70 and up, maybe 50 to 69, below 40 is hidden. A hidden posting is never deleted, it moves to the Hidden filter.

## Ideas for next steps
- Add a real shared database so your phone and laptop stay in sync.
- Add an "interview prep" link per job.
- Export the funnel to CSV.
