# Fathima & Ashif Wedding Invitation

An original React recreation of the publicly visible wedding invitation at `https://fathimawedsashif.vercel.app/`. It uses original CSS backgrounds and an inline SVG ring illustration; it does not reuse the reference site's videos or logos. This is a static frontend and does not connect to the reference site's private backend or data.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm (or pnpm 11.25.0).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The invitation opens from the ring on the cover. Use the round menu control to jump between sections.

## Interactions

- The opening ring reveals the invitation.
- The menu links scroll to each section; press Escape or click outside to close it.
- The music button starts or pauses a quiet, locally synthesized ambient sequence. Audio starts only after the visitor presses the control.
- Scratch across the three date cards to uncover the day, month, and year.
- The countdown targets October 18, 2026 and stays at zero after the event.
- Venue, RSVP, and social controls open the public destination links in a new tab.
- “Add to Calendar” downloads a locally generated `.ics` calendar file.
- The hashtag button copies `#FathimaWedsAshif` when clipboard access is available.

## Build and deploy

```bash
npm run build
npm run preview
```

Vercel settings: Framework preset **Vite**, build command `npm run build`, output directory `dist`. No server-side environment variables are required.
