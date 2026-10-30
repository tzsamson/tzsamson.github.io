/* =====================================================================
   SITE CONFIG — the only file you need to edit.
   Everything on every page (name, bio, skills, projects, blog posts,
   links) is read from this object. The sample content below comes from
   the design mockups — replace it with your own.
   ===================================================================== */
window.SITE = {
  /* ---- identity ---- */
  name: "Frank Samson",              // GitHub lists "Frank Ngailo" — use whichever you prefer
  user: "tzsamson",                  // used in shell prompts: user@host:~$
  host: "dev",
  roleLines: [
    "AI & XR Developer",
    "Explainable ML · Augmented reality · Interactive web experiences",
  ],
  avatar: "https://avatars.githubusercontent.com/u/203362850?v=4", // or "assets/img/avatar.jpg"

  /* ---- links (leave "" to hide) ---- */
  links: {
    github: "https://github.com/tzsamson",
    email: "",                       // e.g. "you@example.com"
    linkedin: "https://www.linkedin.com/in/frank-samson-51b952164/",
    resume: "",                      // e.g. "assets/resume.pdf"
  },
  repo: "github.com/tzsamson/tzsamson.github.io", // shown in the status bar

  /* ---- home: neofetch panel (label, value, color: "g" | "c" | "a" | "") ---- */
  neofetch: [
    ["Role", "AI & XR Developer", "g"],
    ["Host", "GH Pages Static Edge", "c"],
    ["GitHub", "@tzsamson", "c"],
    ["Repos", "11 public", ""],
    ["Stack", "TypeScript · JS · Python", ""],
    ["Focus", "AI / XR", "g"],
    ["Since", "GitHub · 2025", ""],
  ],
  gauge: null,                       // e.g. { label: "Availability", value: 80, note: "Open to roles", status: "OPEN" }

  /* ---- home: bio (HTML allowed: <strong> = green, <em> = cyan) ----
     TODO: replace with your LinkedIn "About" section. */
  bio: [
    "Hi, I'm <strong>Frank Samson</strong>, an <em>AI &amp; XR developer</em>. I build at the intersection of machine learning and immersive technology — from augmented-reality exploration apps to the backends that power interactive experiences.",
    "I'm especially interested in <em>trustworthy AI</em>: interpretable models, fairness assessment and explainability tooling that make machine-learning systems easier to understand and safer to deploy.",
  ],
  focus: [
    { title: "Explainable AI", text: "Interpretable models and black-box explanations with InterpretML, AIX360 and the What-If Tool." },
    { title: "Responsible ML", text: "Assessing and improving model fairness with Fairlearn; accessible deep learning with ktrain." },
    { title: "Extended Reality", text: "Location-aware AR exploration experiences built with TypeScript and modern web tooling." },
    { title: "Interactive Systems", text: "Node.js game servers, escape-room frameworks and computer-vision navigation on Android." },
  ],
  oss: { label: "Exploring", repos: ["interpretml/interpret", "fairlearn/fairlearn", "PAIR-code/what-if-tool", "Trusted-AI/AIX360"], stars: "" },

  /* ---- home: skills tree ---- TODO: refine with your LinkedIn skills */
  skills: [
    { dir: "languages", items: [["TypeScript", "Web / AR"], ["JavaScript", "Node.js"], ["Python", "ML / Data"], ["Shell", "Tooling"]] },
    { dir: "ai-ml", items: [["InterpretML", "Explainability"], ["Fairlearn", "Fairness"], ["AIX360", "Interpretability"], ["ktrain", "Deep Learning"]] },
    { dir: "xr-and-apps", items: [["Augmented Reality", "Web AR"], ["Mapbox Vision", "Android / CV"], ["Node.js servers", "Game backends"], ["Git / GitHub", "CI / Pages"]] },
  ],

  /* ---- home: recent activity (git log) ---- */
  commits: [
    { hash: "tzsamson.github.io", msg: "init: portfolio site on GitHub Pages", when: "Oct 2026" },
    { hash: "EscapeRoom-Framework", msg: "feat: start escape-room framework", when: "Aug 2026" },
    { hash: "interpret", msg: "fork: explore interpretable ML tooling", when: "Mar 2026" },
  ],

  /* ---- projects ----
     autoload = true pulls your public, non-fork repos live from GitHub.
     Entries below with the same name add descriptions/tags on top. */
  github: { user: "tzsamson", autoload: true, exclude: ["tzsamson.github.io", "EscapeRoom-Framework", "takemethere"], max: 12 },

  projects: [
    {
      name: "wander-ar-explore", flags: ["xr", "web"],
      desc: "Augmented-reality exploration app for discovering places around you, built with TypeScript and a modern component-based web stack.",
      tags: ["typescript", "augmented-reality", "xr"],
      url: "https://github.com/tzsamson/wander-ar-explore",
    },
    {
      name: "escaperoomserver", flags: ["backend"],
      desc: "Node.js server powering an escape-room game: room definitions in JSON, database helpers and an HTTP API for game state.",
      tags: ["javascript", "nodejs", "game-server"],
      url: "https://github.com/tzsamson/escaperoomserver",
    },
    {
      name: "navigation", flags: ["xr", "vision"],
      desc: "Mapbox Vision SDK examples for Android — computer-vision driven navigation and lane/sign detection experiments.",
      tags: ["android", "mapbox", "computer-vision"],
      url: "https://github.com/tzsamson/navigation",
    },
  ],

  /* ---- blog / dispatch log ----
     Empty for now. Use the ~/new-dispatch page to draft a post, then
     "Copy config entry" and paste it inside this list. */
  posts: [],
  postsPerPage: 4,
};
