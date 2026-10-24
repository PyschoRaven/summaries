# Study Lounge — Mobile Device Security

An interactive study site for Chapters 1–8, with expandable notes, exam-answer reveals, completion tracking, dark mode, encouragement, Quran reading breaks, and optional five-minute wellbeing reminders.

## Deployment

- Production site: https://mobile-device-security-summaries.netlify.app
- Production branch: `main`
- Publish directory: `public`
- Build command: leave empty (the site is plain HTML, CSS and JavaScript).

Connect this repository to the existing Netlify project under Project configuration → Build & deploy → Continuous deployment → Repository. Netlify then deploys every push to `main`. Deployment takes time; it is not an instant live editor.

The root `netlify.toml` configures the publish directory. No API keys, build hooks, GitHub Actions tokens, or other secrets are needed in this repository.

## Updating the site

Edit files inside `public/`, commit, and push to `main`. Netlify publishes the updated files after its deployment completes. Visitors can refresh their browser to see the changes.

Progress and preferences are stored in each visitor’s browser, rather than synced between devices. Wellbeing reminders run while the site is open. Quran readings include source references and translation attribution.
