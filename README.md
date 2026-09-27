# Tanvir Islam — personal website

Next.js 16 (App Router) + Tailwind v4, exported as a static site. No server, no CMS.

```bash
npm run dev     # http://localhost:3002
npm run build   # static export to ./out
```

## Where things live

| Path | What |
| --- | --- |
| `content/site.ts` | Every fact on the site. Edit here, not in components. |
| `components/SignalHero.tsx` | The canvas mel spectrogram in the hero. |
| `components/WorkCatalog.tsx` | Sortable work catalogue; the SQL tracks the sort. |
| `app/` | Routes: `/`, `/work`, `/work/[slug]`, `/about`. |
| `docs/` | Project plan and the hero-direction prototypes. Not part of the build. |

## Content rules

Three rules are deliberate and documented at the top of `content/site.ts`. In short:

1. **No CGPA anywhere.** Education carries no grades at all, so the omission is
   consistent rather than conspicuous.
2. **The UCBL work is capability-level only.** No database versions, host names,
   instance counts or topology — that would map a regulated bank's estate.
   Anything added must clear the same bar, and the wording needs the supervisor's
   sign-off before launch.
3. **No referees named.** "Available on request" only.

Skills and stacks list what the source documents actually claim. Do not add a
library because a project probably used one.

## Still outstanding

- A better portrait — the CV photo is a formal white-background ID shot.
- Final CV as a PDF, then wire a download into the nav.
- Supervisor sign-off on the UCBL wording.
- Thesis figures (confusion matrix, model comparison, a spectrogram).
- IEEE paper PDF, DOI, or venue and year.
- READMEs on the GitHub repos before any of them are linked from here.
- Real-device check on a mid-range Android over 4G.

## Deploying

`npm run build` produces `./out`, which is plain static files. Vercel, GitHub
Pages, Netlify or any static host will serve it as-is.
