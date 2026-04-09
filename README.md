# Born Again

A free, open source Bible reading app for new believers and curious seekers.
Built with React, TypeScript, Supabase, and DaisyUI.

**Live at [placeholder.com](https://placeholder.com)**

---

## What it is

Born Again walks readers through scripture section by section — starting in
the Gospel of John, with three layers per passage:

- **Scripture** - World English Bible (WEB)
- **Summary** - plain English retelling, no jargon
- **Commentary** - deeper explanation of meaning and context

No streaks. No XP. No paywall. Go at your own pace.

---

## Features

- Curated daily reading plan starting in John
- Three-layer reader: summary, scripture, commentary
- Tap any verse to save it to your favorites
- Progress saved to your account via Supabase
- Read time estimate per section
- One-tap verse sharing
- Full reading plan overview
- Fully free, open source, donation-supported

---

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS + DaisyUI
- Supabase (auth + Postgres)
- World English Bible JSON (local)
- React Query (TanStack Query)
- React Router v6

---

## Running locally

```bash
git clone https://github.com/YOUR_USERNAME/born-again
cd born-again/born-again
npm install
```

```bash
cp .env.example .env.local
```

Then set the .env keys

```bash
npm run dev
```

## Contributing

Pull requests welcome, especially for content improvements.
Commentary corrections, new sections, and typo fixes are all appreciated.

---

## Translation

All scripture is from the [World English Bible](https://worldenglishbible.org),
a public domain modern English translation. No licensing fees or restrictions.

---

## Support

Born Again is free forever. If it has helped you, consider
[buying me a coffee](https://buymeacoffee.com/aznos).

---

## License

MIT