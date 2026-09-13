# Design plan — "Marquee"

## Reference design (Figma/Dribbble)
**Chosen reference:** *Online Movie Streaming Platform* by Purrweb UI/UX
Agency — https://dribbble.com/shots/14614377-Online-Movie-Streaming-Platform

Why this one: it already covers a home screen with a genre-filtered movie
list and a details screen with full description + cast, which maps almost
1:1 onto this brief's required sections (Movies section, Category filter,
Movie details). Colors below were sampled directly from a screenshot of the
shot, so the palette below is a close match to the real reference — not a
guess.

> 📸 Keep the screenshot you took of the shot and submit it alongside this
> repo as the "original UI reference" — that's the actual submission
> requirement, this file just documents the tokens pulled from it.

## Color
| Token | Hex | Use |
|---|---|---|
| `--base` | `#171A35` | page background (deep indigo) |
| `--surface` | `#20244A` | cards, inputs |
| `--surface-2` | `#262B52` | nested surfaces, hero overlays |
| `--text` | `#F5F6FA` | primary text |
| `--muted` | `#9AA0BE` | secondary text, meta |
| `--accent` | `#2F80ED` | the one bold accent — CTAs, active genre pill |
| `--star` | `#FFC542` | star ratings |
| `--success` | `#33C2A0` | success messages (auth) |
| `--red` | `#EF5A52` | errors, destructive actions |

## Type
- Display/headline & movie titles: **Poppins** (geometric, modern-app feel,
  matches the clean sans-only look of the reference).
- UI chrome, body, forms: **Inter** (neutral, highly legible at small sizes).

## Layout
- Left-aligned hero with a bold headline over a full-bleed backdrop image.
- Auto-filling poster grid (`repeat(auto-fill, minmax(170px,1fr))`) so it
  reflows naturally at any width instead of a fixed column count.
- Rounded cards (14px radius) and quiet chrome elsewhere — borders instead
  of shadows, one accent color, no gradients-as-decoration.

## Principles
- The accent blue is spent once per view (a CTA, an active pill) — never
  decorative. Ratings get their own gold, separate from the CTA color.
- Posters carry the personality of the page; UI stays out of the way.
- Every async boundary (search, filter, modal) has an explicit loading and
  error state — nothing pops in silently or fails silently.
