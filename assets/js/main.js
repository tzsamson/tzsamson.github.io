/* Terminal Portfolio — shared chrome + per-page rendering.
   No build step, no dependencies. Reads window.SITE from config.js. */
(function () {
  "use strict";
  const S = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PS = `${S.user || "user"}@${S.host || "dev"}:~$`;
  const page = document.body.dataset.page;

  const NAV = [
    ["index.html", "~/whoami", "home"],
    ["projects.html", "~/projects", "projects"],
    ["blog.html", "~/blog-log", "blog"],
    ["dispatch.html", "~/new-dispatch", "dispatch"],
  ];

  /* ---------------- toast ---------------- */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }
  async function copy(text, msg = "copied to clipboard") {
    try { await navigator.clipboard.writeText(text); toast("✓ " + msg); }
    catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); toast("✓ " + msg); } catch { toast("copy failed"); } t.remove(); }
  }

  /* ---------------- chrome ---------------- */
  function chrome() {
    const top = $("#top");
    if (top) {
      const profile = S.links?.github || "index.html";
      top.className = "topbar";
      top.innerHTML = `
      <div class="wrap">
        <div class="topline">
          <div class="row prompt-id"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span><span class="g b">${esc(S.user)}@terminal:~$</span> <span class="m">/dev/pts/0</span> <span class="badge c">[main]</span></span></div>
          <div class="row"><span class="sm hide-sm">target: <span class="w">gh-pages</span></span>
            <a class="avatar-btn" href="${esc(profile)}" aria-label="GitHub profile" ${profile.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></a></div>
        </div>
        <nav class="nav" aria-label="Primary">
          <ul>${NAV.map(([href, label, key]) => `<li><a href="${href}" ${key === page ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul>
          <span class="status hide-sm"><span class="g">[<span class="live-dot"></span>RUNNING]</span> <span class="m">pty0</span></span>
        </nav>
      </div>`;
    }
    const foot = $("#foot");
    if (foot) {
      foot.className = "statusbar";
      const yr = new Date().getFullYear();
      foot.innerHTML = `<div class="wrap">
        <div class="grp"><span class="g">▣ READY</span><span class="c">branch::[main*]</span><span class="m hide-sm">remote::${esc(S.repo || "")}</span></div>
        <div class="grp"><span class="m">© ${yr} ${esc(S.name)}</span><span class="hide-sm">deploy::[gh-pages]</span><span class="hide-sm">enc::UTF-8</span><span class="g" id="load">load: 0.14 0.08 0.02</span></div>
      </div>`;
      const l = $("#load");
      setInterval(() => { const r = () => (Math.random() * 0.3).toFixed(2); l.textContent = `load: ${r()} ${r()} ${r()}`; }, 3000);
    }
  }

  /* ---------------- shell ---------------- */
  function shell(root, { prompt = PS } = {}) {
    if (!root) return;
    const out = $(".shell-out", root), input = $("input", root);
    const print = (html, cls = "") => { const d = document.createElement("div"); d.className = "line " + cls; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; };
    const L = S.links || {};
    const contact = () => {
      const rows = [];
      if (L.email) rows.push(`  email    → <a href="mailto:${esc(L.email)}">${esc(L.email)}</a>`);
      if (L.github) rows.push(`  github   → <a href="${esc(L.github)}" target="_blank" rel="noopener">${esc(L.github)}</a>`);
      if (L.linkedin) rows.push(`  linkedin → <a href="${esc(L.linkedin)}" target="_blank" rel="noopener">${esc(L.linkedin)}</a>`);
      return rows.length ? `<span class="g">HTTP/1.1 200 OK</span>\n` + rows.join("\n") : `<span class="a">no contact links configured</span>`;
    };
    const cmds = {
      help: () => `<span class="g">available commands:</span>
  whoami        who is this
  ls            list pages
  projects      jump to ~/projects
  blog          jump to ~/blog-log
  cat bio.txt   print bio
  cat resume    open résumé
  curl /contact contact info
  git status    what I'm up to
  stats         repo stats
  clear         clear the screen`,
      whoami: () => `<span class="g">${esc(S.name)}</span>\n${(S.roleLines || []).map((l) => ">> " + esc(l)).join("\n")}`,
      ls: () => NAV.map(([h, l]) => `<a href="${h}">${l.replace("~/", "")}/</a>`).join("  "),
      "ls -la": () => cmds.ls(),
      projects: () => { location.href = "projects.html"; return "cd ~/projects ..."; },
      blog: () => { location.href = "blog.html"; return "cd ~/blog-log ..."; },
      "cat bio.txt": () => (S.bio || []).map((p) => p.replace(/<[^>]+>/g, "")).map(esc).join("\n\n"),
      "cat bio": () => cmds["cat bio.txt"](),
      "cat resume": () => L.resume ? (window.open(L.resume, "_blank"), `opening <a href="${esc(L.resume)}" target="_blank">${esc(L.resume)}</a> ...`) : `<span class="a">cat: resume: no such file — set links.resume in config.js</span>`,
      "cat resume.pdf": () => cmds["cat resume"](),
      "curl /contact": contact, contact: contact,
      "git status": () => `On branch <span class="c">main</span>\nYour branch is up to date with 'origin/main'.\n\nRecent commits:\n${(S.commits || []).map((c) => `  <span class="c">${esc(c.hash)}</span> ${esc(c.msg)}`).join("\n")}`,
      stats: () => { const p = S.projects || []; const tags = new Set(p.flatMap((x) => x.tags || [])); return `repos: <span class="g">${p.length}</span>  posts: <span class="g">${(S.posts || []).length}</span>  tags: <span class="g">${tags.size}</span>`; },
      date: () => new Date().toString(),
      sudo: () => `<span class="a">${esc(S.user)} is not in the sudoers file. This incident will be reported.</span>`,
      exit: () => "logout… just kidding. there's nowhere to go.",
    };
    function run(raw) {
      const c = raw.trim(); if (!c) return;
      print(`<span class="g">${esc(prompt)}</span> ${esc(c)}`);
      if (c === "clear") { out.innerHTML = ""; return; }
      const key = c.toLowerCase().replace(/\s+/g, " ");
      if (key.startsWith("echo ")) return print(esc(c.slice(5)), "mm");
      if (key.startsWith("sudo")) return print(cmds.sudo());
      if (key.startsWith("cd ")) { const t = key.slice(3).replace("~/", "").replace(/\/$/, ""); const n = NAV.find(([, l]) => l.replace("~/", "") === t || (t === "blog" && l.includes("blog"))); if (n) { location.href = n[0]; return; } return print(`cd: no such directory: ${esc(t)}`, "a"); }
      const f = cmds[key];
      print(f ? f() : `zsh: command not found: ${esc(c.split(" ")[0])} — try <span class="g">help</span>`, f ? "mm" : "a");
    }
    const hist = []; let hi = 0;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { hist.push(input.value); hi = hist.length; run(input.value); input.value = ""; }
      else if (e.key === "ArrowUp" && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { input.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ""); }
    });
    root.querySelectorAll("[data-run]").forEach((b) => b.addEventListener("click", () => { run(b.dataset.run); input.focus({ preventScroll: true }); }));
    return { run };
  }

  /* ---------------- HOME ---------------- */
  function home() {
    $("#banner-name").textContent = (S.name || "").toUpperCase().replace(/\s+/g, ".");
    $("#banner-lines").innerHTML = (S.roleLines || []).map((l) => `<div>&gt;&gt; ${esc(l)}</div>`).join("");
    document.querySelectorAll("[data-ps]").forEach((el) => (el.textContent = PS));

    // neofetch
    const av = $("#avatar");
    av.innerHTML = S.avatar
      ? `<img src="${esc(S.avatar)}" alt="Portrait of ${esc(S.name)}"><span class="lbl">SYS://${esc((S.user || "").toUpperCase())}</span>`
      : `<span class="ascii" aria-hidden="true">  .--.\n |o_o |\n |:_/ |\n//   \\ \\\n(|     | )\n/'\\_   _/\`\\\n\\___)=(___/</span><span class="lbl">SYS://${esc((S.user || "").toUpperCase())}</span>`;
    $("#fetch-host").textContent = `${S.user}@${S.host}-node`;
    $("#fetch-kv").innerHTML = (S.neofetch || []).map(([k, v, c]) => `<tr><td>${esc(k)}</td><td class="${c || "w"}">${esc(v)}</td></tr>`).join("");
    const g = S.gauge;
    if (g) {
      const C = 2 * Math.PI * 20, off = C * (1 - (g.value || 0) / 100);
      $("#gauge").innerHTML = `<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="20" stroke="#2d322c" stroke-width="4" fill="none"/><circle cx="26" cy="26" r="20" stroke="#00ff66" stroke-width="4" fill="none" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 26 26)" style="filter:drop-shadow(0 0 3px #00ff66)"/></svg>
        <div style="flex:1"><div class="w">${esc(g.label)}: ${g.value}%</div><div class="m sm">${esc(g.note || "")}</div></div><span class="badge g">[${esc(g.status || "OK")}]</span>`;
    } else $("#gauge").remove();

    // bio
    $("#bio").innerHTML = (S.bio || []).map((p) => `<p>${p}</p>`).join("");
    $("#focus").innerHTML = (S.focus || []).map((f) => `<div class="sub"><h3>&gt; ${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`).join("");
    const o = S.oss;
    if (o && o.repos?.length) {
      $("#oss").innerHTML = `<div class="between"><span><span class="c">✓</span> <span class="w">${esc(o.label)}:</span> ${o.repos.map((r) => `<a href="https://github.com/${esc(r)}" target="_blank" rel="noopener">${esc(r)}</a>`).join(", ")}</span>${o.stars ? `<span class="g">${esc(o.stars)} ★</span>` : ""}</div>`;
    } else $("#oss").remove();

    // skills
    $("#skills").innerHTML = (S.skills || []).map((s) => `<div class="pane hover">
      <div class="pane-head"><span class="c">drwx ./${esc(s.dir)}/</span><span class="m">${s.items.length} nodes</span></div>
      <ul class="skill-list">${s.items.map(([n, t]) => `<li><span><span class="g">»</span> <span class="w">${esc(n)}</span></span><span class="g">[${esc(t)}]</span></li>`).join("")}</ul></div>`).join("");

    // git log
    const cs = S.commits || [];
    $("#gitlog").innerHTML = cs.map((c, i) => {
      const pre = i === 0 ? "*" : i === cs.length - 1 ? "|/" : "| *";
      return `<div><span class="c">${pre}</span> <span class="c">${esc(c.hash)}</span> <span class="w">${esc(c.msg)}</span> <span class="m">(${esc(c.when)}) [${esc(S.name)}]</span></div>`;
    }).join("");

    $("#shell-label").textContent = PS;
    shell($("#shell"));
  }

  /* ---------------- PROJECTS ---------------- */
  function spark(points, w = 500, h = 70) {
    const max = Math.max(...points), min = Math.min(...points), n = points.length - 1;
    const xy = points.map((p, i) => [(i / n) * w, h - 6 - ((p - min) / (max - min || 1)) * (h - 14)]);
    let d = `M${xy[0][0]},${xy[0][1]}`;
    for (let i = 1; i < xy.length; i++) { const [x0, y0] = xy[i - 1], [x1, y1] = xy[i], cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
    const last = xy[xy.length - 1];
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d} L${w},${h} L0,${h} Z" fill="rgba(0,255,102,0.08)"/><path d="${d}" fill="none" stroke="#00ff66" stroke-width="2" vector-effect="non-scaling-stroke"/><circle cx="${last[0] - 3}" cy="${last[1]}" r="4" fill="#00ff66"/></svg>`;
  }
  function panel(p) {
    if (!p) return "";
    const head = (l, r) => `<div class="between sm"><span class="${p.type === "metrics" ? "g" : "m"}">${l}</span><span class="${p.type === "metrics" || p.type === "code" ? "g" : "c"}">${r}</span></div>`;
    if (p.type === "metrics") return `<div class="inset">${head("$ " + esc(p.cmd), "[" + esc(p.badge) + "]")}<div class="metrics">${p.items.map(([k, v, c]) => `<div>${esc(k)}<b class="${c || "w"}">${esc(v)}</b></div>`).join("")}</div></div>`;
    if (p.type === "ascii") return `<div class="inset">${head(esc(p.title), esc(p.badge))}<pre class="ascii">${esc(p.text)}</pre></div>`;
    if (p.type === "spark") return `<div class="inset">${head(esc(p.title), esc(p.badge))}${spark(p.points)}<div class="between xs m">${(p.foot || []).map((f) => `<span>${esc(f)}</span>`).join("")}</div></div>`;
    if (p.type === "code") return `<div class="inset">${head(esc(p.title), esc(p.badge))}<div class="between sub" style="margin-top:.5rem"><code class="w b sm" style="word-break:break-all">${esc(p.code)}</code><button class="chip-btn muted" data-copy="${esc(p.code)}" aria-label="Copy command">⧉</button></div>${p.foot ? `<div class="xs m" style="margin-top:.4rem">${esc(p.foot)}</div>` : ""}</div>`;
    return "";
  }
  function card(p) {
    const clone = `git clone ${p.url ? p.url.replace(/\/$/, "") + ".git" : ""}`;
    return `<article class="pane hover proj" data-flags="${esc((p.flags || []).join(" "))}">
      <div class="between"><h2><span class="badge c" style="font-size:.75rem;vertical-align:middle;text-shadow:none">[DIR]</span> <a href="${esc(p.url || "#")}" target="_blank" rel="noopener">${esc(p.name)}</a></h2>
        <span class="sm">${p.version ? `<span class="c">[${esc(p.version)}]</span> ` : ""}${p.stars != null ? `<span class="a">★</span> ${esc(p.stars)}` : ""}</span></div>
      <p class="desc">${esc(p.desc || "No description provided.")}</p>
      ${panel(p.panel)}
      <div class="between"><div class="tags">${(p.tags || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}</div>${p.updated ? `<span class="meta m">updated: ${esc(p.updated)}</span>` : ""}</div>
      ${p.url ? `<div class="clone"><code>$ ${esc(clone)}</code><button class="btn" data-copy="${esc(clone)}">⧉ copy</button><a class="btn primary" href="${esc(p.url)}" target="_blank" rel="noopener">[src] ↗</a></div>` : ""}
    </article>`;
  }
  function ago(iso) {
    const s = (Date.now() - new Date(iso)) / 1000;
    const u = [["y", 31536000], ["mo", 2592000], ["w", 604800], ["d", 86400], ["h", 3600], ["m", 60]];
    for (const [k, v] of u) if (s >= v) return Math.floor(s / v) + k + " ago";
    return "just now";
  }
  async function projects() {
    let list = [...(S.projects || [])];
    const gh = S.github || {};
    const grid = $("#proj-grid");
    const render = () => {
      grid.innerHTML = list.length ? list.map(card).join("") : `<div class="empty">ls: ./repositories/: empty directory</div>`;
      const allFlags = [...new Set(list.flatMap((p) => p.flags || []))];
      $("#flags").innerHTML = `<span class="m">[FLAGS]:</span> <button class="chip-btn on" data-flag="all">--all</button>` + allFlags.map((f) => `<button class="chip-btn" data-flag="${esc(f)}">--${esc(f)}</button>`).join("");
      $("#found").textContent = `found: ${list.length} dirs, ${list.reduce((a, p) => a + (p.tags || []).length, 0)} tags`;
    };
    render();
    if (gh.autoload && gh.user) {
      try {
        const r = await fetch(`https://api.github.com/users/${encodeURIComponent(gh.user)}/repos?sort=pushed&per_page=100`);
        if (!r.ok) throw new Error(r.status);
        const repos = (await r.json()).filter((x) => !x.fork && !(gh.exclude || []).includes(x.name));
        const byName = new Map(list.map((p) => [p.name.toLowerCase(), p]));
        const fetched = repos.slice(0, gh.max || 12).map((x) => {
          const mine = byName.get(x.name.toLowerCase()) || {};
          byName.delete(x.name.toLowerCase());
          return { name: x.name, desc: x.description, stars: x.stargazers_count, url: x.html_url, updated: ago(x.pushed_at), tags: (x.topics || []).slice(0, 5).concat(x.language && !(x.topics || []).length ? [x.language.toLowerCase()] : []), flags: x.language ? [x.language.toLowerCase()] : [], ...mine };
        });
        list = [...fetched, ...byName.values()];
        render();
        $("#synced").innerHTML = `<span class="live-dot"></span>INDEX_SYNCED_OK · api.github.com`;
      } catch (e) {
        $("#synced").innerHTML = `<span class="a">● GITHUB_API_UNAVAILABLE — showing config</span>`;
      }
    }
    $("#flags").addEventListener("click", (e) => {
      const b = e.target.closest("[data-flag]"); if (!b) return;
      $("#flags").querySelectorAll(".chip-btn").forEach((x) => x.classList.toggle("on", x === b));
      const f = b.dataset.flag;
      grid.querySelectorAll(".proj").forEach((c) => (c.hidden = f !== "all" && !c.dataset.flags.split(" ").includes(f)));
    });
    $("#tree-cmd").textContent = `${S.user}@system:~/projects$`;
    $("#shell-label").textContent = `${S.user}@system:~$`;
    shell($("#shell"), { prompt: `${S.user}@system:~$` });
  }

  /* ---------------- BLOG ---------------- */
  function postHTML(p) {
    const typeCls = { EVENT: "g", POST: "g", UPDATE: "g", THOUGHTS: "a" }[p.type] || "g";
    return `<article class="pane post hover" id="post-${esc(p.hash)}" data-tags="${esc((p.tags || []).join(" "))}">
      <div class="post-head"><span><span class="c">${/^v\d/.test(p.hash) ? "tag:" : "commit"} ${esc(p.hash)}</span> <span class="m">|</span> <span class="${typeCls}">[DISPATCH::${esc(p.type)}]</span> <span class="m">${esc(p.file || "")}</span></span><span class="w">${esc(p.date)} UTC</span></div>
      <div class="post-body">
        <div class="between" style="align-items:flex-start"><h2>[${esc(p.type)}] ${esc(p.title)}</h2>${p.release ? `<span class="badge solid">${esc(p.release)}</span>` : ""}</div>
        ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ""}
        ${p.body ? `<div class="content">${p.body}</div>` : ""}
        <div class="post-foot"><span class="tags"><span class="m">tags:</span> ${(p.tags || []).map((t) => `<a href="?tag=${encodeURIComponent(t)}" data-tag="${esc(t)}">[${esc(t)}]</a>`).join("")}</span>
          ${p.link ? `<a class="btn" href="${esc(p.link.href)}" ${/^http/.test(p.link.href) ? 'target="_blank" rel="noopener"' : ""} style="color:var(--green)">${esc(p.link.label)}</a>` : ""}</div>
      </div></article>`;
  }
  function blog() {
    const posts = [...(S.posts || [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const per = S.postsPerPage || 5;
    const params = new URLSearchParams(location.search);
    let tag = params.get("tag") || "all", q = "", pg = 1;
    const tagCount = {};
    posts.forEach((p) => (p.tags || []).forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1)));
    const tags = Object.keys(tagCount).sort();

    $("#tagflags").innerHTML = `<span class="m">flags:</span> <button class="chip-btn" data-t="all">--all</button>` + tags.slice(0, 6).map((t) => `<button class="chip-btn" data-t="${esc(t)}" style="color:var(--cyan)">--tag=${esc(t)}</button>`).join("");
    $("#tagcloud").innerHTML = tags.map((t) => `<a href="?tag=${encodeURIComponent(t)}" data-tag="${esc(t)}">${esc(t)} <span class="m">[${tagCount[t]}]</span></a>`).join("  ");
    $("#tagcount").textContent = `${tags.length} tokens`;
    $("#recent").innerHTML = posts.slice(0, 4).map((p) => `<a href="#post-${esc(p.hash)}" data-jump="${esc(p.hash)}"><div class="between"><span class="${p.type === "THOUGHTS" ? "a" : "g"}">[${esc(p.type)}] ${esc(p.title.slice(0, 28))}${p.title.length > 28 ? "…" : ""}</span><span class="m">${esc(p.hash)}</span></div></a>`).join("");
    $("#tele").innerHTML = `<tr><td>TOTAL DISPATCHES</td><td class="w">${posts.length}</td></tr><tr><td>LATEST</td><td class="g">${esc((posts[0]?.date || "—").slice(0, 10))}</td></tr><tr><td>HEAD SHA</td><td class="c">${esc(posts[0]?.hash || "—")}</td></tr><tr><td>TAGS INDEXED</td><td class="w">${tags.length}</td></tr>`;

    function draw() {
      const ql = q.toLowerCase();
      const filtered = posts.filter((p) => (tag === "all" || (p.tags || []).includes(tag)) && (!ql || [p.title, p.summary, p.hash, p.type, ...(p.tags || [])].join(" ").toLowerCase().includes(ql)));
      const pages = Math.max(1, Math.ceil(filtered.length / per));
      pg = Math.min(pg, pages);
      const slice = filtered.slice((pg - 1) * per, pg * per);
      $("#posts").innerHTML = slice.length ? slice.map(postHTML).join("") : (posts.length ? `<div class="pane empty">grep: no dispatches match <span class="g">${esc(q || tag)}</span></div>` : `<div class="pane empty">git log: your current branch has no commits yet<br><span class="m sm">first dispatch coming soon</span></div>`);
      $("#pageinfo").textContent = `PAGE ${pg} OF ${pages} (TOTAL COMMITS: ${filtered.length})`;
      $("#prev").disabled = pg <= 1; $("#next").disabled = pg >= pages;
      $("#tagflags").querySelectorAll("[data-t]").forEach((b) => b.classList.toggle("on", b.dataset.t === tag));
      $("#regex").textContent = q || tag !== "all" ? "[FILTER: ACTIVE]" : "[REGEX: READY]";
    }
    function setTag(t) { tag = t; pg = 1; const u = new URL(location); t === "all" ? u.searchParams.delete("tag") : u.searchParams.set("tag", t); history.replaceState(null, "", u); draw(); }
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tag],[data-t]");
      if (t) { e.preventDefault(); setTag(t.dataset.tag || t.dataset.t); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      const j = e.target.closest("[data-jump]");
      if (j) { const h = j.dataset.jump; const i = posts.findIndex((p) => p.hash === h); tag = "all"; q = ""; $("#grep").value = ""; pg = Math.floor(i / per) + 1; draw(); e.preventDefault(); $("#post-" + CSS.escape(h))?.scrollIntoView({ behavior: "smooth" }); }
    });
    $("#grep").addEventListener("input", (e) => { q = e.target.value; pg = 1; draw(); });
    $("#prev").addEventListener("click", () => { pg--; draw(); window.scrollTo({ top: 0 }); });
    $("#next").addEventListener("click", () => { pg++; draw(); window.scrollTo({ top: 0 }); });
    draw();
  }

  /* ---------------- DISPATCH (post composer) ---------------- */
  function md(src) {
    const blocks = [], lines = src.replace(/\r/g, "").split("\n");
    const inline = (s) => esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => /^(https?:|\/|#|\.)/.test(u.replace(/&amp;/g, "&")) ? `<a href="${u}">${t}</a>` : t);
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; blocks.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`); continue; }
      const h = l.match(/^(#{1,4})\s+(.*)/); if (h) { const n = Math.min(h[1].length + 1, 4); blocks.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }
      if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, "")); blocks.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`); continue; }
      if (/^\s*[-*+]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) buf.push(`<li>${inline(lines[i++].replace(/^\s*[-*+]\s+/, ""))}</li>`); blocks.push(`<ul>${buf.join("")}</ul>`); continue; }
      if (!l.trim()) { i++; continue; }
      const buf = []; while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|>|\s*[-*+]\s)/.test(lines[i])) buf.push(lines[i++]);
      blocks.push(`<p>${inline(buf.join(" "))}</p>`);
    }
    return blocks.join("\n");
  }
  function dispatch() {
    const f = { title: $("#f-title"), type: $("#f-type"), date: $("#f-date"), summary: $("#f-summary"), body: $("#f-body") };
    let tags = ["rust", "linux-kernel"];
    const KEY = "dispatch-draft";
    try { const d = JSON.parse(localStorage.getItem(KEY) || "null"); if (d) { f.title.value = d.title || ""; f.type.value = d.type || "POST"; f.summary.value = d.summary || ""; f.body.value = d.body || ""; tags = d.tags || tags; if (d.date) f.date.value = d.date; } } catch {}
    if (!f.date.value) { const n = new Date(); n.setSeconds(0, 0); f.date.value = n.toISOString().slice(0, 16); }
    const slug = () => (f.title.value || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "untitled";
    const hash = () => { let h = 0; const s = f.title.value + f.date.value; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(16).padStart(7, "0").slice(0, 7); };
    const post = () => ({ hash: hash(), type: f.type.value, date: f.date.value.replace("T", " "), file: `posts/${slug()}.md`, title: f.title.value || "Untitled", summary: f.summary.value, tags, body: md(f.body.value) });

    function drawTags() {
      $("#tagbox").innerHTML = tags.map((t, i) => `<span class="t">#${esc(t)}<button type="button" data-rm="${i}" aria-label="remove ${esc(t)}">×</button></span>`).join("") + `<input id="tag-in" placeholder="+add_tag" aria-label="Add tag">`;
      const ti = $("#tag-in");
      ti.addEventListener("keydown", (e) => {
        if (["Enter", ",", "Tab"].includes(e.key) && ti.value.trim()) { e.preventDefault(); tags.push(ti.value.trim().replace(/^#/, "").toLowerCase().replace(/\s+/g, "-")); drawTags(); update(); $("#tag-in").focus(); }
        else if (e.key === "Backspace" && !ti.value && tags.length) { tags.pop(); drawTags(); update(); $("#tag-in").focus(); }
      });
    }
    $("#tagbox").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { tags.splice(+b.dataset.rm, 1); drawTags(); update(); } });
    function update() {
      $("#preview").innerHTML = postHTML(post());
      $("#out-file").textContent = `_posts/${f.date.value.slice(0, 10)}-${slug()}.md`;
      const ln = f.body.value.slice(0, f.body.selectionStart).split("\n");
      $("#lncol").textContent = `Ln: ${ln.length}, Col: ${ln[ln.length - 1].length + 1}`;
      $("#modified").hidden = false;
      try { localStorage.setItem(KEY, JSON.stringify({ title: f.title.value, type: f.type.value, date: f.date.value, summary: f.summary.value, body: f.body.value, tags })); } catch {}
      $("#words").textContent = `${(f.body.value.match(/\S+/g) || []).length} words`;
    }
    Object.values(f).forEach((el) => el.addEventListener("input", update));
    f.body.addEventListener("click", update); f.body.addEventListener("keyup", update);
    $("#seg").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $("#seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      $("#panes").className = "editor-panes " + b.dataset.mode;
    });
    const markdown = () => `---\ntitle: "${f.title.value.replace(/"/g, '\\"')}"\ntype: ${f.type.value}\ndate: ${f.date.value}:00Z\ntags: [${tags.join(", ")}]\nsummary: "${f.summary.value.replace(/"/g, '\\"')}"\n---\n\n${f.body.value}\n`;
    $("#act-copy-config").addEventListener("click", () => copy(JSON.stringify(post(), null, 2) + ",", "config entry copied — paste into posts: [ … ] in config.js"));
    $("#act-copy-md").addEventListener("click", () => copy(markdown(), "markdown copied"));
    $("#act-download").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([markdown()], { type: "text/markdown" }));
      a.download = `${f.date.value.slice(0, 10)}-${slug()}.md`; a.click(); URL.revokeObjectURL(a.href); toast("✓ downloaded " + a.download);
    });
    $("#act-clear").addEventListener("click", () => { if (!f.body.value || confirmClear()) { Object.values(f).forEach((el) => el !== f.type && el !== f.date && (el.value = "")); tags = []; drawTags(); update(); try { localStorage.removeItem(KEY); } catch {} toast("buffer cleared"); } });
    let armed = false, armT; function confirmClear() { if (armed) return true; armed = true; toast("press [ x ] again to discard draft"); clearTimeout(armT); armT = setTimeout(() => (armed = false), 2500); return false; }
    $("#target").textContent = `${(S.repo || "").replace(/^github\.com\//, "")}:refs/heads/main`;
    drawTags(); update(); $("#modified").hidden = true;
  }

  /* ---------------- boot ---------------- */
  chrome();
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-copy]"); if (b) copy(b.dataset.copy); });
  ({ home, projects, blog, dispatch })[page]?.();
})();
