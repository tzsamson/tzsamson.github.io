# Terminal Portfolio

A static, dependency-free personal website in a CLI / terminal style, built from the
"Terminal Portfolio & Dispatch" design. It's plain HTML, CSS and JS with no build step, so it runs on GitHub Pages as-is.

```
.
├── index.html        ~/whoami      – banner, neofetch, bio, skills tree, git log, interactive shell
├── projects.html     ~/projects    – repository cards with filters (optionally live from the GitHub API)
├── blog.html         ~/blog-log    – posts with grep search, tag filters, pagination, sidebar
├── dispatch.html     ~/new-dispatch – local Markdown post composer (exports to config / .md)
├── 404.html
├── .nojekyll
└── assets/
    ├── css/style.css
    ├── js/config.js  ← EDIT THIS: all your content lives here
    ├── js/main.js
    └── img/          ← put avatar.jpg / resume.pdf here
```

## 1. Make it yours

Open `assets/js/config.js` and replace the sample content:

| Key | What it controls |
|---|---|
| `name`, `user`, `host`, `roleLines` | Banner and shell prompt (`user@host:~$`) |
| `avatar` | Path to a photo, e.g. `assets/img/avatar.jpg` (blank shows an ASCII placeholder) |
| `links` | GitHub / email / LinkedIn / résumé (used by `curl /contact` and `cat resume`) |
| `neofetch`, `gauge`, `bio`, `focus`, `oss` | Home page panels |
| `skills`, `commits` | Skills tree and the "git log" panel |
| `projects` | Project cards. `panel.type` can be `metrics`, `ascii`, `spark` or `code` |
| `github.autoload` | Set it to `true` (with `github.user`) to fetch your public repos live |
| `posts` | Blog entries. `body` is HTML |

**Writing posts:** open `/dispatch.html` on your site (or locally), write in Markdown,
then click **Copy config entry** and paste it at the top of the `posts: [ … ]` list.
Commit and push. The page is `noindex` and only runs in your browser.

## 2. Deploy to GitHub Pages

**As your main site (`https://<username>.github.io`):**

```bash
# create an empty public repo named <username>.github.io on GitHub, then:
cd terminal-portfolio
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

Then go to the repo's **Settings → Pages**, set Source to **Deploy from a branch**, choose `main` / `(root)`, and click Save.
The site goes live in about a minute.

**As a project site (`https://<username>.github.io/portfolio`):** follow the same steps with any repo name.
All paths are relative, so it works from a subfolder too.

**Custom domain:** add a `CNAME` file containing your domain, and set it under Settings → Pages.

## 3. Preview locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Notes
- Fonts: JetBrains Mono and Silkscreen come from Google Fonts. Everything else is self-contained.
- The interactive shells support `help`, `whoami`, `ls`, `cd <page>`, `cat bio.txt`, `cat resume`,
  `curl /contact`, `git status`, `stats`, `date`, `echo`, `clear`, and ↑/↓ for history.
- Add or rename commands in the `cmds` object inside `assets/js/main.js`.
