/* ============================================================
   UL CGT Annonay — contenu éditable
   Modifie ACTUS et AGENDA ci-dessous pour mettre le site à jour.
   ============================================================ */

const ACTUS = [
  { cat: "lutte", tag: "Mobilisation", date: "2026-10-22", titre: "Salaires : rassemblement devant la zone industrielle", texte: "Plus de 200 salarié·es réuni·es pour exiger l'indexation des salaires sur l'inflation.", mot: "Grève" },
  { cat: "droits", tag: "Tes droits", date: "2026-10-15", titre: "Rupture conventionnelle : les pièges à éviter", texte: "Délai de rétractation, indemnités, chômage : ce qu'il faut vérifier avant de signer.", mot: "Droit" },
  { cat: "vie", tag: "Vie de l'UL", date: "2026-10-08", titre: "Formation syndicale : nouvelle session en novembre", texte: "Trois jours pour découvrir le rôle d'élu·e CSE et les bases du droit du travail.", mot: "Former" },
  { cat: "lutte", tag: "Services publics", date: "2026-09-30", titre: "Hôpital d'Annonay : on ne lâche rien", texte: "Soutien aux personnels contre les fermetures de lits et le manque d'effectifs.", mot: "Santé" },
  { cat: "droits", tag: "Tes droits", date: "2026-09-18", titre: "Heures sup non payées ? Voici comment réclamer", texte: "Jusqu'à trois ans de rappel de salaire possible. On t'explique la marche à suivre.", mot: "Payé" },
  { cat: "vie", tag: "Vie de l'UL", date: "2026-09-05", titre: "Rentrée : l'UL réunit ses syndicats", texte: "Assemblée générale de rentrée, bilan des luttes et feuille de route pour l'année.", mot: "Unis" },
];

const AGENDA = [
  { date: "2026-11-05T14:00", titre: "Permanence juridique", texte: "Sans rendez-vous, au local de l'UL." },
  { date: "2026-11-14T10:00", titre: "Manifestation salaires", texte: "Départ place des Cordeliers. Venez nombreux·ses !" },
  { date: "2026-11-24T09:00", titre: "Formation « Élu·e CSE »", texte: "Trois jours, inscription obligatoire." },
  { date: "2026-12-10T18:00", titre: "Assemblée générale de l'UL", texte: "Ouverte à tous les syndiqué·es du bassin." },
];

/* Photos : dépose les fichiers dans le dossier photos/ puis liste-les ici.
   format : "large" (2 colonnes), "haute" (2 lignes) ou rien. */
const PHOTOS = [
  // { src: "photos/manif-salaires.jpg", legende: "Manifestation pour les salaires", format: "large" },
  // { src: "photos/piquet-de-greve.jpg", legende: "Piquet de grève", format: "haute" },
];

const PERMANENCES = [
  { jour: 2, debut: 14, fin: 17, label: "Mardi 14h – 17h" },
  { jour: 4, debut: 9, fin: 12, label: "Jeudi 9h – 12h" },
];

/* ============================================================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const fmtEuro = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

document.body.classList.add("is-loading");
$("#year").textContent = new Date().getFullYear();

/* ---------- Loader + titre animé lettre par lettre ---------- */
$$(".split").forEach((el) => {
  el.innerHTML = [...el.textContent]
    .map((c, i) => `<span class="ch" style="transition-delay:${0.25 + i * 0.035}s">${c === " " ? "&nbsp;" : c}</span>`)
    .join("");
});

window.addEventListener("load", () => {
  setTimeout(() => {
    $(".loader").classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    $$(".hero .reveal").forEach((el, i) => {
      el.style.setProperty("--d", 0.5 + i * 0.12 + "s");
      el.classList.add("is-in");
    });
    if (!reduceMotion) startScramble();
  }, reduceMotion ? 0 : 1100);
});

/* ---------- Mot qui se "déchiffre" ---------- */
function startScramble() {
  const el = $(".scramble");
  const words = el.dataset.words.split("|");
  const chars = "!<>-_\\/[]{}—=+*^?#ÉÀ";
  let idx = 0;

  const scrambleTo = (target) =>
    new Promise((resolve) => {
      const from = el.textContent;
      const len = Math.max(from.length, target.length);
      const queue = Array.from({ length: len }, (_, i) => ({
        from: from[i] || "",
        to: target[i] || "",
        start: Math.floor(Math.random() * 20),
        end: Math.floor(Math.random() * 20) + 20,
      }));
      let frame = 0;
      const tick = () => {
        let out = "";
        let done = 0;
        for (const q of queue) {
          if (frame >= q.end) { done++; out += q.to; }
          else if (frame >= q.start) out += `<span class="dud">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
          else out += q.from;
        }
        el.innerHTML = out;
        if (done === queue.length) resolve();
        else { frame++; requestAnimationFrame(tick); }
      };
      tick();
    });

  const loop = async () => {
    idx = (idx + 1) % words.length;
    await scrambleTo(words[idx]);
    setTimeout(loop, 2200);
  };
  setTimeout(loop, 2200);
}

/* ---------- Canvas du hero : réseau de particules ---------- */
(() => {
  const canvas = $("#hero-canvas");
  const ctx = canvas.getContext("2d");
  const mouse = { x: -9999, y: -9999 };
  let w, h, dpr, pts = [];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(110, Math.floor((w * h) / 14000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6, red: Math.random() < 0.25,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 22000) { const f = 1 - d2 / 22000; p.vx += (dx / 140) * f; p.vy += (dy / 140) * f; }
      p.vx *= 0.97; p.vy *= 0.97;
      p.vx += (Math.random() - 0.5) * 0.03; p.vy += (Math.random() - 0.5) * 0.03;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = a.red || b.red ? `rgba(254,234,0,${0.55 * (1 - d / 130)})` : `rgba(255,255,255,${0.22 * (1 - d / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.fillStyle = p.red ? "#feea00" : "rgba(255,255,255,.8)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion && visible) requestAnimationFrame(draw);
  };

  let visible = true;
  new IntersectionObserver(([e]) => {
    const was = visible; visible = e.isIntersecting;
    if (visible && !was && !reduceMotion) requestAnimationFrame(draw);
  }).observe(canvas);

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  window.addEventListener("resize", resize);
  resize(); draw();
})();

/* ---------- Curseur, boutons magnétiques, cartes 3D ---------- */
if (finePointer && !reduceMotion) {
  const cur = $(".cursor");
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add("is-on"); });
  const follow = () => {
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    cur.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(follow);
  };
  follow();
  document.addEventListener("pointerover", (e) => {
    cur.classList.toggle("is-hover", !!e.target.closest("a, button, summary, input, .card, .post"));
  });

  $$(".magnetic").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--x", (e.clientX - r.left - r.width / 2) * 0.3 + "px");
      b.style.setProperty("--y", (e.clientY - r.top - r.height / 2) * 0.4 + "px");
    });
    b.addEventListener("pointerleave", () => { b.style.setProperty("--x", "0px"); b.style.setProperty("--y", "0px"); });
  });

  $$(".tilt").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--ry", (px - 0.5) * 16 + "deg");
      c.style.setProperty("--rx", (0.5 - py) * 16 + "deg");
      c.style.setProperty("--mx", px * 100 + "%");
      c.style.setProperty("--my", py * 100 + "%");
    });
    c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
  });
}

/* ---------- Nav : scroll, masquage, menu mobile, section active ---------- */
(() => {
  const nav = $(".nav"), bar = $(".progress span"), burger = $(".nav__burger");
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > last && y > 400 && !nav.classList.contains("is-open"));
    last = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));

  const links = $$("#menu a:not(.btn)");
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-current", l.hash === "#" + e.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => spy.observe(s));
})();

/* ---------- Actus (rendu + filtres) ---------- */
(() => {
  const grads = {
    lutte: "linear-gradient(135deg,#d20012,#7a0008)",
    droits: "linear-gradient(135deg,#17171b,#4a4a52)",
    vie: "linear-gradient(135deg,#ff4a55,#d20012)",
  };
  const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const wrap = $("#news");
  ACTUS.forEach((a, i) => {
    const el = document.createElement("article");
    el.className = "post reveal";
    el.dataset.cat = a.cat;
    el.style.setProperty("--d", (i % 3) * 0.1 + "s");
    el.innerHTML = `
      <div class="post__img" style="background:${grads[a.cat]}"><span></span></div>
      <div class="post__body">
        <span class="post__meta"></span>
        <h3></h3>
        <p></p>
      </div>`;
    $(".post__img span", el).textContent = a.mot;
    $(".post__meta", el).textContent = `${a.tag} · ${fmt(a.date)}`;
    $("h3", el).textContent = a.titre;
    $("p", el).textContent = a.texte;
    wrap.appendChild(el);
  });

  $$(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
      const f = chip.dataset.filter;
      $$(".post").forEach((p) => p.classList.toggle("is-hidden", f !== "all" && p.dataset.cat !== f));
    })
  );
})();

/* ---------- Galerie photo + visionneuse ---------- */
(() => {
  const grid = $("#gallery");
  if (!PHOTOS.length) {
    const vides = [["Manif", "is-wide"], ["Grève", "is-tall"], ["AG", ""], ["Formation", ""], ["Piquet", ""], ["Solidarité", ""], ["1er mai", "is-wide"], ["Rassemblement", "is-wide"]];
    vides.forEach(([mot, cls]) => {
      const f = document.createElement("figure");
      f.className = `is-empty ${cls}`;
      f.innerHTML = "<div><b></b>Photo à venir</div>";
      $("b", f).textContent = mot;
      grid.appendChild(f);
    });
    return;
  }

  const box = $("#lightbox"), img = $("img", box), cap = $("figcaption", box);
  let cur = 0, lastFocus = null;
  const show = (i) => {
    cur = (i + PHOTOS.length) % PHOTOS.length;
    img.src = PHOTOS[cur].src;
    img.alt = PHOTOS[cur].legende || "";
    cap.textContent = PHOTOS[cur].legende || "";
  };
  const open = (i) => { lastFocus = document.activeElement; show(i); box.hidden = false; document.body.style.overflow = "hidden"; $(".lightbox__close", box).focus(); };
  const close = () => { box.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };

  PHOTOS.forEach((p, i) => {
    const f = document.createElement("figure");
    f.className = "reveal " + ({ large: "is-wide", haute: "is-tall" }[p.format] || "");
    f.style.setProperty("--d", (i % 4) * 0.08 + "s");
    f.tabIndex = 0;
    f.innerHTML = '<img loading="lazy" alt="" /><figcaption></figcaption>';
    $("img", f).src = p.src;
    $("img", f).alt = p.legende || "";
    $("figcaption", f).textContent = p.legende || "";
    f.addEventListener("click", () => open(i));
    f.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(i)));
    grid.appendChild(f);
  });

  $(".lightbox__close", box).addEventListener("click", close);
  $(".lightbox__prev", box).addEventListener("click", () => show(cur - 1));
  $(".lightbox__next", box).addEventListener("click", () => show(cur + 1));
  box.addEventListener("click", (e) => e.target === box && close());
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
})();

/* ---------- Photo du secrétaire général (initiales si absente) ---------- */
$$("[data-src]").forEach((el) => {
  const im = new Image();
  im.alt = "";
  im.onload = () => el.replaceChildren(im);
  im.src = el.dataset.src;
});

/* ---------- Agenda + compte à rebours ---------- */
(() => {
  const now = new Date();
  const upcoming = AGENDA.map((e) => ({ ...e, d: new Date(e.date) })).filter((e) => e.d > now).sort((a, b) => a.d - b.d);
  const tl = $("#timeline");
  const list = upcoming.length ? upcoming : AGENDA.map((e) => ({ ...e, d: new Date(e.date) }));
  list.forEach((e, i) => {
    const li = document.createElement("li");
    li.className = "reveal";
    li.style.setProperty("--d", i * 0.1 + "s");
    li.innerHTML = "<time></time><h3></h3><p></p>";
    $("time", li).dateTime = e.date;
    $("time", li).textContent = e.d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + " · " + e.d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    $("h3", li).textContent = e.titre;
    $("p", li).textContent = e.texte;
    tl.appendChild(li);
  });

  const box = $("#countdown");
  const next = upcoming[0];
  const head = document.createElement("p");
  box.appendChild(head);
  if (!next) { head.textContent = "Prochaines dates bientôt annoncées."; return; }
  head.textContent = `Prochain rendez-vous : ${next.titre}`;
  box.insertAdjacentHTML("beforeend", ["Jours", "Heures", "Min", "Sec"].map((l) => `<div><b>00</b><small>${l}</small></div>`).join(""));
  const cells = $$("b", box);
  const tick = () => {
    let s = Math.max(0, Math.floor((next.d - new Date()) / 1000));
    const vals = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
    vals.forEach((v, i) => (cells[i].textContent = String(v).padStart(2, "0")));
  };
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Statut de la permanence en direct ---------- */
(() => {
  const n = new Date(), day = n.getDay(), h = n.getHours() + n.getMinutes() / 60;
  const open = PERMANENCES.find((p) => p.jour === day && h >= p.debut && h < p.fin);
  const status = $("#perm-status"), dot = $(".pulse");
  if (open) status.textContent = `Ouverte maintenant · ${open.label}`;
  else { dot.classList.add("is-off"); status.textContent = "Fermée · " + PERMANENCES.map((p) => p.label).join(" / "); }
})();

/* ---------- Simulateur de cotisation ---------- */
(() => {
  const range = $("#salaire");
  const update = () => {
    const s = +range.value;
    const cot = s * 0.01, reel = cot * 0.34;
    $("#salaire-out").textContent = s.toLocaleString("fr-FR");
    $("#cot").textContent = fmtEuro(cot);
    $("#reel").textContent = fmtEuro(reel);
    $("#jour").textContent = fmtEuro(reel / 30);
    range.style.setProperty("--p", ((s - range.min) / (range.max - range.min)) * 100 + "%");
  };
  range.addEventListener("input", update);
  update();
})();

/* ---------- Reveal au scroll + compteurs ---------- */
(() => {
  const countUp = (el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(end * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    }),
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el) => { if (!el.closest(".hero")) io.observe(el); });
  $$(".stats .stat").forEach((el, i) => el.style.setProperty("--d", i * 0.1 + "s"));
})();

/* ---------- Pré-remplir l'objet depuis le bouton "Adhérer" ---------- */
$$("[data-subject]").forEach((a) =>
  a.addEventListener("click", () => { $("#f-obj").value = a.dataset.subject; })
);

/* ---------- Formulaire de contact ---------- */
(() => {
  const form = $("#form"), msg = $(".form__msg");
  // Remplace par l'adresse réelle de l'UL :
  const EMAIL_UL = "contact@ul-cgt-annonay.fr";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.closest(".field").classList.toggle("is-error", bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.style.color = "var(--red)"; msg.textContent = "Vérifie les champs en rouge."; return; }

    const d = Object.fromEntries(new FormData(form));
    const body = `Nom : ${d.nom}\nEmail : ${d.email}\nEntreprise : ${d.entreprise || "-"}\n\n${d.message}`;
    window.location.href = `mailto:${EMAIL_UL}?subject=${encodeURIComponent("[Site] " + d.objet)}&body=${encodeURIComponent(body)}`;
    msg.style.color = "#1db954";
    msg.textContent = "Ton logiciel mail s'ouvre. Merci, on te répond vite ✊";
    form.reset();
  });
  $$("input, textarea", form).forEach((f) => f.addEventListener("input", () => f.closest(".field").classList.remove("is-error")));
})();

/* ============================================================
   Effets avancés (désactivés si l'utilisateur réduit les animations)
   ============================================================ */
if (!reduceMotion) {
  /* ---------- Fond liquide WebGL du hero ---------- */
  (() => {
    const canvas = $("#hero-gl");
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
    const fs = `precision mediump float;
      uniform vec2 r;uniform float t;uniform vec2 m;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/r;vec2 asp=vec2(r.x/r.y,1.);vec2 p=uv*asp*1.6;
        float tm=t*.05;
        vec2 d=(m-uv)*asp;float md=exp(-dot(d,d)*5.);
        vec2 q=vec2(fbm(p+tm),fbm(p+vec2(5.2,1.3)-tm));
        vec2 s=vec2(fbm(p+3.*q+vec2(1.7,9.2)+tm*1.6+md*.8),fbm(p+3.*q+vec2(8.3,2.8)-tm));
        float f=fbm(p+2.6*s);
        vec3 dark=vec3(.32,0.,.03),red=vec3(.823,0.,.07),hot=vec3(1.,.26,.2),yel=vec3(1.,.92,0.);
        vec3 c=mix(dark,red,smoothstep(.2,.68,f));
        c=mix(c,hot,smoothstep(.7,.98,f)*.45);
        c+=yel*pow(smoothstep(.55,1.,f*length(q)),3.)*.5;
        c+=yel*md*.12;
        c*=1.-.32*length(uv-vec2(.35,.5));
        gl_FragColor=vec4(c,1.);}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r"), uT = gl.getUniformLocation(prog, "t"), uM = gl.getUniformLocation(prog, "m");

    const hero = $(".hero");
    const mouse = { x: 0.7, y: 0.5, tx: 0.7, ty: 0.5 };
    const resize = () => {
      const s = 0.5; // demi-résolution : fluide même sur mobile
      canvas.width = canvas.clientWidth * s; canvas.height = canvas.clientHeight * s;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = 1 - (e.clientY - r.top) / r.height;
    });
    let visible = true;
    new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) requestAnimationFrame(frame); }).observe(canvas);
    const t0 = performance.now();
    const frame = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible) requestAnimationFrame(frame);
    };
    window.addEventListener("resize", resize);
    resize();
    hero.classList.add("has-gl");
    requestAnimationFrame(frame);
  })();

  /* ---------- Effets liés au défilement ---------- */
  (() => {
    const heroInner = $(".hero__inner");

    // Texte mot par mot
    const words = $$(".words").map((el) => {
      el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
      return { el, spans: $$(".w", el) };
    });

    // Nos combats en horizontal (grand écran uniquement)
    const lut = $("#luttes"), track = $("#luttes .cards"), bar = $("#luttes .pin__bar");
    let dist = 0;
    const layout = () => {
      const on = innerWidth > 1000;
      lut.classList.toggle("is-pinned", on);
      if (!on) { lut.style.height = ""; track.style.removeProperty("--tx"); return; }
      dist = Math.max(0, track.scrollWidth - track.parentElement.clientWidth + 2 * parseFloat(getComputedStyle(track.parentElement).paddingLeft));
      lut.style.height = innerHeight + dist + "px";
    };

    // Bandeau : vitesse et sens suivent le scroll
    const mq = $(".marquee"), mqTrack = $(".marquee__track");
    mqTrack.innerHTML += mqTrack.innerHTML;
    mq.classList.add("is-js");
    let mqX = 0, dir = 1, lastY = scrollY, vel = 0;

    const tick = () => {
      const y = scrollY;
      const dy = y - lastY; lastY = y;
      if (dy) dir = dy > 0 ? 1 : -1;
      vel += (Math.min(Math.abs(dy), 80) - vel) * 0.1;
      const half = mqTrack.scrollWidth / 2;
      mqX -= (0.8 + vel * 0.6) * dir;
      if (mqX <= -half) mqX += half;
      if (mqX > 0) mqX -= half;
      mqTrack.style.transform = `translate3d(${mqX}px,0,0)`;

      if (y < innerHeight) {
        heroInner.style.transform = `translate3d(0,${y * 0.35}px,0)`;
        heroInner.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.8));
      }

      for (const { el, spans } of words) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.5)));
        const lit = Math.round(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle("is-lit", i < lit));
      }

      if (dist) {
        const p = Math.min(1, Math.max(0, (y - lut.offsetTop) / dist));
        track.style.setProperty("--tx", -p * dist + "px");
        bar.style.setProperty("--p", p);
      }
      requestAnimationFrame(tick);
    };
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    layout();
    requestAnimationFrame(tick);
  })();

  /* ---------- « TOUS ENSEMBLE » : lettres qui se soulèvent ---------- */
  (() => {
    const big = $(".footer__big");
    big.innerHTML = [...big.textContent].map((c) => (c === " " ? " " : `<span class="l">${c}</span>`)).join("");
    big.classList.add("is-split");
    const letters = $$(".l", big);
    big.addEventListener("pointermove", (e) => {
      letters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const k = Math.max(0, 1 - d / 220);
        l.style.setProperty("--ly", -k * 0.18 * r.height + "px");
        l.style.setProperty("--ls", 1 + k * 0.08);
        l.style.setProperty("--lc", k > 0.35 ? "#feea00" : "#fff");
      });
    });
    big.addEventListener("pointerleave", () => letters.forEach((l) => { l.style.setProperty("--ly", "0px"); l.style.setProperty("--ls", 1); l.style.setProperty("--lc", "#fff"); }));
  })();

  /* ---------- Étincelles au clic ---------- */
  (() => {
    const colors = ["#feea00", "#d20012", "#ffffff", "#0d0d0f"];
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input, textarea, select, .lightbox")) return;
      for (let i = 0; i < 12; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.style.background = colors[i % colors.length];
        document.body.appendChild(s);
        const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4, dist = 40 + Math.random() * 50;
        s.animate(
          [
            { transform: `translate(${e.clientX}px, ${e.clientY}px) scale(1)`, opacity: 1 },
            { transform: `translate(${e.clientX + Math.cos(a) * dist}px, ${e.clientY + Math.sin(a) * dist}px) scale(0)`, opacity: 0 },
          ],
          { duration: 600 + Math.random() * 300, easing: "cubic-bezier(.16,1,.3,1)" }
        ).onfinish = () => s.remove();
      }
    });
  })();
}
