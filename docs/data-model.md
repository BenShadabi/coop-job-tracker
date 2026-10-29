# Data model

The page reads three collections. Each document is a plain object. Only fields you have are needed.

## `jobs/<id>`
| Field | Type | Notes |
|---|---|---|
| company, title, location | text | |
| score | 0 to 100 | below 40 should be `status: "hidden"` |
| tier | `strong`, `maybe`, `rejected`, `filtered` | `filtered` rows are never shown |
| term | `summer` or `unknown` | `unknown` shows a "Check term" chip |
| status | `new`, `ready`, `applied`, `interview`, `offer`, `rejected`, `unavailable`, `hidden` | `ready` means a package exists |
| firstSeen | ISO time | set once when the posting is added; drives the Hottest tab |
| posted | `YYYY-MM-DD` | used when `firstSeen` is missing |
| deadline | `YYYY-MM-DD` or null | past deadlines count as Not available |
| url | https link | |
| folder | text | where your application files are; shows a "Copy folder path" button |
| lane, flags, source | short text | shown as chips |
| recruiter | `{name, title, url, confirmed}` | |
| appliedDate, statusDate, followedUp | `YYYY-MM-DD` | set by the page when you change status |

## `events/<slug>`
company, title, type, date, time, location, url, registration (`open`, `none`, `waitlist`, `full`, `closed`, `unknown`), registerBy, spots, checked, cost, costNote, meet (list of `{name, title, company, url}`), employers (list), whyGo, status (`new`, `going`, `skip`).

## `trends/summer`
updated, headline, seek (list of short tips), employers (`{name, summer, other}`), history (`{name, y25, y26}`), skills (`{name, n}`), skillBase.
