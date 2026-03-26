import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --bg:      #050a14;
  --bg2:     #0b1222;
  --bg3:     #101828;
  --accent:  #b060ff;
  --accent2: #7b61ff;
  --text:    #e8eeff;
  --muted:   #a8b2cc;
  --border:  rgba(176,96,255,0.18);
  --mono:    'JetBrains Mono', monospace;
  --sans:    'Syne', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  overflow-x: hidden;
}

/* ── scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; }

/* ── NAV ── */
.nav {
  position: fixed; top:0; left:0; right:0; z-index:100;
  padding: 22px 6%;
  display: flex; align-items: center;
  transition: background .3s, backdrop-filter .3s, padding .3s;
}
.nav.scrolled {
  background: rgba(5,10,20,.92);
  backdrop-filter: blur(16px);
  padding: 14px 6%;
  border-bottom: 1px solid var(--border);
}
.nav-inner { width:100%; display:flex; align-items:center; justify-content:space-between; }
.nav-logo { font-family:var(--mono); font-size:22px; font-weight:700; color:var(--accent); letter-spacing:2px; text-shadow:0 0 12px rgba(176,96,255,.7); }
.logo-bracket { opacity:.5; }
.logo-text { color:#fff; margin:0 2px; }

.nav-links { display:flex; list-style:none; gap:36px; align-items:center; }
.nav-links a { font-family:var(--mono); font-size:13px; color:var(--text); text-decoration:none; transition:color .2s; }
.nav-links a .num { color:var(--accent); margin-right:4px; font-size:12px; }
.nav-links a:hover, .nav-links a.active { color:var(--accent); }

.nav-right { display:flex; align-items:center; gap:20px; }
.nav-resume {
  font-family:var(--mono); font-size:13px; color:var(--accent);
  border:1px solid var(--accent); padding:8px 18px; border-radius:4px;
  text-decoration:none; cursor:pointer; background:transparent;
  transition:background .2s, color .2s;
}
.nav-resume:hover { background:rgba(176,96,255,.12); }

.hamburger { display:none; font-size:22px; cursor:pointer; color:var(--accent); background:none; border:none; }

/* mobile drawer */
.drawer {
  display:none; position:fixed; top:0; right:-280px; width:260px; height:100vh;
  background:var(--bg2); border-left:1px solid var(--border); z-index:999;
  flex-direction:column; justify-content:center; align-items:flex-start;
  padding:40px 32px; gap:28px;
  transition: right .35s cubic-bezier(.4,0,.2,1);
}
.drawer.open { right:0; }
.drawer a { font-family:var(--mono); font-size:15px; color:var(--text); text-decoration:none; transition:color .2s; }
.drawer a:hover { color:var(--accent); }
.drawer .num { color:var(--accent); margin-right:6px; font-size:13px; }
.drawer-close { position:absolute; top:26px; right:26px; font-size:22px; color:var(--accent); cursor:pointer; background:none; border:none; }
.overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:998; }
.overlay.open { display:block; }

/* ── HERO ── */
#home {
  min-height:100vh; display:flex; align-items:center;
  position:relative; overflow:hidden; padding:120px 6% 80px;
}
.grid-overlay {
  position:absolute; inset:0;
  background-image:
    linear-gradient(rgba(176,96,255,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(176,96,255,.05) 1px, transparent 1px);
  background-size:60px 60px; pointer-events:none;
}
.hero-glow1 {
  position:absolute; top:-200px; left:-200px; width:600px; height:600px;
  background:radial-gradient(circle, rgba(176,96,255,.22) 0%, transparent 70%);
  pointer-events:none;
}
.hero-glow2 {
  position:absolute; bottom:-100px; right:-100px; width:500px; height:500px;
  background:radial-gradient(circle, rgba(123,97,255,.14) 0%, transparent 70%);
  pointer-events:none;
}
.hero-inner {
  width:100%; max-width:1200px; margin:0 auto;
  display:flex; align-items:center; justify-content:space-between;
  gap:60px; position:relative; z-index:1;
}
.hero-left { flex:1; }
.hero-tag { font-family:var(--mono); font-size:13px; color:var(--accent); margin-bottom:24px; letter-spacing:1px; }
.blink { animation:blink 1s step-end infinite; margin-right:6px; }
@keyframes blink { 50% { opacity:0; } }

.hero-name {
  font-family:var(--sans); font-size:clamp(52px,7vw,90px);
  font-weight:800; line-height:1; color:#fff; margin-bottom:20px;
}
.hero-name span {
  color:var(--accent);
  text-shadow:0 0 20px rgba(176,96,255,.6), 0 0 60px rgba(176,96,255,.25);
}
.hero-location { font-family:var(--mono); font-size:13px; color:var(--muted); margin-bottom:16px; }
.hero-location i { color:var(--accent); margin-right:6px; }
.hero-desc { font-size:16px; color:var(--muted); max-width:440px; line-height:1.7; margin-bottom:36px; }
.hero-cta { display:flex; gap:16px; margin-bottom:40px; flex-wrap:wrap; }

.btn-primary {
  background:var(--accent); color:#fff;
  padding:13px 32px; border-radius:4px;
  text-decoration:none; font-family:var(--mono); font-size:14px; font-weight:700;
  transition:opacity .2s, transform .2s, box-shadow .2s;
  display:inline-block; box-shadow:0 0 20px rgba(176,96,255,.4);
  border:none; cursor:pointer;
}
.btn-primary:hover { opacity:.85; transform:translateY(-2px); box-shadow:0 0 36px rgba(176,96,255,.65); }

.btn-ghost {
  border:1px solid var(--border); color:var(--text);
  padding:13px 32px; border-radius:4px;
  text-decoration:none; font-family:var(--mono); font-size:14px;
  transition:border-color .2s, color .2s, transform .2s;
  display:inline-block; background:transparent; cursor:pointer;
}
.btn-ghost:hover { border-color:var(--accent); color:var(--accent); transform:translateY(-2px); }

.hero-socials { display:flex; gap:20px; }
.hero-socials a { font-size:20px; color:var(--muted); text-decoration:none; transition:color .2s, transform .2s; }
.hero-socials a:hover { color:var(--accent); transform:translateY(-3px); }

/* terminal */
.hero-right { flex:0 0 440px; }
.terminal {
  background:var(--bg2); border:1px solid var(--border); border-radius:10px; overflow:hidden;
  box-shadow:0 0 60px rgba(176,96,255,.12), 0 20px 60px rgba(0,0,0,.5);
}
.t-header { background:#1a2235; padding:12px 16px; display:flex; align-items:center; gap:8px; }
.t-dot { width:12px; height:12px; border-radius:50%; }
.t-dot.red { background:#ff5f57; }
.t-dot.yellow { background:#febc2e; }
.t-dot.green { background:#28c840; }
.t-title { font-family:var(--mono); font-size:12px; color:var(--muted); margin-left:8px; }
.t-body { padding:24px; font-family:var(--mono); font-size:13px; line-height:2; }
.t-line { display:block; }
.t-prompt { color:var(--accent); margin-right:10px; }
.t-out { color:var(--muted); padding-left:20px; }
.t-cursor { color:var(--accent); animation:blink 1s step-end infinite; }
.t-ok { color:#28c840; }

.scroll-hint {
  position:absolute; bottom:36px; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:6px;
  font-family:var(--mono); font-size:11px; color:var(--muted);
  animation:scrollBounce 2s ease-in-out infinite; z-index:1;
}
@keyframes scrollBounce {
  0%,100% { transform:translateX(-50%) translateY(0); }
  50% { transform:translateX(-50%) translateY(6px); }
}

/* ── SECTION SHARED ── */
.container { max-width:1100px; margin:0 auto; padding:100px 6%; }
.section-label { font-family:var(--mono); font-size:13px; color:var(--accent); letter-spacing:2px; margin-bottom:12px; }
.section-num { margin-right:6px; }
.section-title { font-size:clamp(28px,4vw,42px); font-weight:800; color:#fff; margin-bottom:48px; }

/* ── ABOUT ── */
#about { background:var(--bg2); }
.about-grid { display:grid; grid-template-columns:340px 1fr; gap:80px; align-items:start; }
.about-img-wrap { position:relative; }
.img-frame { border-radius:8px; overflow:hidden; border:1px solid var(--border); position:relative; z-index:1; }
.img-frame img { width:100%; display:block; filter:grayscale(20%); transition:filter .3s; }
.img-frame:hover img { filter:none; }
.img-accent {
  position:absolute; top:16px; left:16px; right:-16px; bottom:-16px;
  border:2px solid var(--accent); border-radius:8px; z-index:0;
  opacity:.35;
}
.about-text { font-size:15px; color:var(--muted); line-height:1.8; margin-bottom:32px; }

.tab-bar { display:flex; border-bottom:1px solid var(--border); margin-bottom:28px; }
.tab-btn {
  font-family:var(--mono); font-size:13px; color:var(--muted);
  background:none; border:none; cursor:pointer;
  padding:10px 20px 10px 0; margin-right:24px;
  position:relative; transition:color .2s;
}
.tab-btn::after {
  content:''; position:absolute; bottom:-1px; left:0;
  width:0; height:2px; background:var(--accent); transition:width .3s;
}
.tab-btn.active { color:var(--accent); }
.tab-btn.active::after { width:100%; }

.skill-item { margin-bottom:20px; }
.skill-cat { font-family:var(--mono); font-size:13px; color:var(--accent); display:block; margin-bottom:8px; }
.skill-tags { display:flex; gap:8px; flex-wrap:wrap; }
.skill-tags span {
  background:rgba(176,96,255,.08); border:1px solid var(--border);
  color:var(--text); padding:4px 12px; border-radius:4px;
  font-family:var(--mono); font-size:12px;
}
.skill-item p { font-size:14px; color:var(--muted); line-height:1.6; }

.edu-item { margin-bottom:24px; }
.edu-school { font-family:var(--mono); font-size:13px; color:var(--accent); margin-bottom:4px; }
.edu-degree { font-size:15px; font-weight:600; color:#fff; margin-bottom:4px; }
.edu-detail { font-size:13px; color:var(--muted); font-family:var(--mono); }
.edu-note { font-size:12px; color:var(--muted); opacity:.7; margin-top:4px; font-style:italic; }

/* ── EXPERIENCE ── */
#experience { background:var(--bg); }
.exp-list { display:flex; flex-direction:column; gap:16px; }
.exp-card {
  display:flex; gap:32px; padding:36px;
  background:var(--bg3); border:1px solid var(--border); border-radius:8px;
  transition:border-color .3s, transform .3s, box-shadow .3s;
  position:relative; overflow:hidden;
}
.exp-card::before {
  content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
  background:var(--accent); opacity:0; transition:opacity .3s;
}
.exp-card:hover { border-color:rgba(176,96,255,.5); transform:translateX(4px); box-shadow:0 8px 40px rgba(176,96,255,.1); }
.exp-card:hover::before { opacity:1; }
.exp-icon { font-size:28px; color:var(--accent); flex-shrink:0; margin-top:4px; opacity:.7; }
.exp-info { flex:1; }
.exp-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px; }
.exp-company { font-family:var(--mono); font-size:13px; color:var(--accent); }
.exp-date { font-family:var(--mono); font-size:12px; color:var(--muted); }
.exp-role { font-size:20px; font-weight:700; color:#fff; margin-bottom:12px; }
.exp-bullets { list-style:none; margin-bottom:16px; }
.exp-bullets li { font-size:14px; color:var(--muted); line-height:1.7; padding-left:18px; position:relative; }
.exp-bullets li::before { content:'▸'; position:absolute; left:0; color:var(--accent); font-size:12px; }
.exp-tag-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
.exp-tag { font-family:var(--mono); font-size:11px; color:var(--accent); background:rgba(176,96,255,.08); border:1px solid var(--border); padding:3px 10px; border-radius:3px; }

/* ── PROJECTS ── */
#projects { background:var(--bg2); }
.projects-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:24px; }
.project-card {
  background:var(--bg3); border:1px solid var(--border); border-radius:8px;
  padding:28px; transition:border-color .3s, transform .3s, box-shadow .3s;
  display:flex; flex-direction:column; overflow:hidden;
}
.project-card:hover {
  border-color:rgba(176,96,255,.6); transform:translateY(-6px);
  box-shadow:0 20px 40px rgba(176,96,255,.12), 0 0 30px rgba(176,96,255,.08);
}
.project-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.project-folder { font-size:36px; color:var(--accent); opacity:.8; }
.project-links { display:flex; gap:16px; }
.project-links a { font-size:18px; color:var(--muted); text-decoration:none; transition:color .2s; }
.project-links a:hover { color:var(--accent); }
.project-title { font-size:18px; font-weight:700; color:#fff; margin-bottom:10px; }
.project-desc { font-size:13px; color:var(--muted); line-height:1.7; flex:1; margin-bottom:20px; }
.project-stack { display:flex; gap:8px; flex-wrap:wrap; margin-top:auto; }
.project-stack span { font-family:var(--mono); font-size:11px; color:var(--accent); opacity:.8; }
.center-btn { display:block; margin:48px auto 0; width:fit-content; }

/* ── CONTACT ── */
#contact { background:var(--bg); }
.contact-intro { font-size:15px; color:var(--muted); max-width:480px; line-height:1.8; margin-bottom:56px; margin-top:-24px; }
.contact-grid { display:grid; grid-template-columns:1fr 1.4fr; gap:80px; align-items:start; }
.contact-info-item { display:flex; align-items:center; gap:14px; margin-bottom:20px; font-size:14px; color:var(--muted); font-family:var(--mono); }
.contact-info-item i { font-size:18px; color:var(--accent); }
.contact-info-item a { color:var(--muted); text-decoration:none; transition:color .2s; }
.contact-info-item a:hover { color:var(--accent); }
.social-icons { display:flex; gap:18px; margin:32px 0; }
.social-icons a { font-size:22px; color:var(--muted); text-decoration:none; transition:color .2s, transform .2s; }
.social-icons a:hover { color:var(--accent); transform:translateY(-3px); }

.form-group { margin-bottom:20px; }
.form-group label { display:block; font-family:var(--mono); font-size:12px; color:var(--accent); margin-bottom:8px; letter-spacing:1px; }
.form-group input, .form-group textarea {
  width:100%; background:var(--bg2); border:1px solid var(--border);
  border-radius:4px; padding:14px 16px; color:var(--text);
  font-family:var(--mono); font-size:14px; outline:none; transition:border-color .2s;
}
.form-group input:focus, .form-group textarea:focus { border-color:var(--accent); }
.form-group textarea { resize:vertical; min-height:120px; }
.form-msg { font-family:var(--mono); font-size:13px; color:#28c840; display:block; margin-top:12px; height:18px; }
.form-err { color:#ff5f57; }

/* status badge */
.status-badge {
  display:inline-flex; align-items:center; gap:10px;
  background:rgba(40,200,64,.08); border:1px solid rgba(40,200,64,.25);
  border-radius:40px; padding:10px 20px; margin-bottom:32px;
  font-family:var(--mono); font-size:13px; color:#28c840;
}
.status-dot { width:8px; height:8px; border-radius:50%; background:#28c840; animation:pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(40,200,64,.4);} 50%{box-shadow:0 0 0 6px rgba(40,200,64,0);} }

/* ── FOOTER ── */
footer {
  text-align:center; padding:28px;
  border-top:1px solid var(--border);
  font-family:var(--mono); font-size:13px; color:var(--muted);
  margin-top:80px;
}
footer span { color:var(--accent); }
footer a { color:var(--muted); text-decoration:none; transition:color .2s; }
footer a:hover { color:var(--accent); }

/* ── RESPONSIVE ── */
@media (max-width:900px) {
  .hero-inner { flex-direction:column; }
  .hero-right { flex:0 0 auto; width:100%; }
  .about-grid { grid-template-columns:1fr; gap:48px; }
  .contact-grid { grid-template-columns:1fr; gap:48px; }
}
@media (max-width:700px) {
  .nav-links { display:none; }
  .hamburger { display:block; }
  .nav-resume { display:none; }
  .hero-name { font-size:44px; }
  .exp-card { flex-direction:column; gap:16px; padding:24px; }
}
`;

/* ─── DATA ──────────────────────────────────────────────────── */
const navLinks = [
  { num: "00.", label: "Home",       href: "#home"       },
  { num: "01.", label: "About",      href: "#about"      },
  { num: "02.", label: "Experience", href: "#experience" },
  { num: "03.", label: "Projects",   href: "#projects"   },
  { num: "04.", label: "Contact",    href: "#contact"    },
];

const experiences = [
  {
    icon: "fa-solid fa-briefcase",
    company: "Community Organization",
    date: "2022 – 2023",
    role: "Assistant Manager & Volunteer — Event Coordination",
    bullets: [
      "Coordinated event logistics end-to-end, supervised setups and resolved participant issues in real time.",
      "Led cross-functional teams to organize donation drives, demonstrating leadership and teamwork.",
      "Applied structured problem-solving under pressure to consistently deliver timely, high-quality results.",
    ],
    tags: ["Leadership", "Project Management", "Teamwork"],
  },
  {
    icon: "fa-solid fa-laptop-code",
    company: "AIS Club @ UT Dallas",
    date: "2024 – Ongoing",
    role: "Web Developer — RateMyCareer Club Project",
    bullets: [
      "Contributing to RateMyCareer, a full-stack web application built through the Association for Information Systems.",
      "Collaborating with a student team using Agile workflows, peer code reviews, and version control via GitHub.",
    ],
    tags: ["Vue.js", "Agile", "GitHub", "Teamwork"],
  },
];

const projects = [
  {
    title: "Café E-Commerce Platform",
    desc: "Full-stack e-commerce site for a café. Built with HTML, CSS, and JavaScript with SQL database integration for inventory management and order tracking. Uses component-based design for scalability.",
    stack: ["HTML", "CSS", "JavaScript", "SQL"],
    github: "https://github.com/zxahamza20",
    live: "#",
  },
  {
    title: "Euphorus — T-Mobile Reviews WebApp",
    desc: "Scrapes and ranks T-Mobile reviews from Twitter/X using Python APIs, sorting hot topics from critical to popular. Voice-activated I/O for accessibility. Deployed as a full-stack Flask app.",
    stack: ["Python", "Flask", "APIs", "Audio Libs"],
    github: "https://github.com/zxahamza20",
    live: "#",
  },
  {
    title: "Article Database Search Tool",
    desc: "Academic search engine (CS 2336) querying a MySQL database for articles matching keywords. Efficient search and display implemented in Java to improve information accessibility.",
    stack: ["Java", "MySQL"],
    github: "https://github.com/zxahamza20",
    live: "#",
  },
];

/* ─── COMPONENTS ────────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // highlight active section
      const sections = navLinks.map(l => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="logo-bracket">[</span>
            <span className="logo-text">HM</span>
            <span className="logo-bracket">]</span>
          </div>
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.href}>
                <a href={l.href} className={active === l.href ? "active" : ""}>
                  <span className="num">{l.num}</span>{l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <a href="/resume.pdf" download className="nav-resume">
              Resume <i className="fa-solid fa-download" style={{marginLeft:6}}></i>
            </a>
            <button className="hamburger" onClick={() => setDrawerOpen(true)}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer${drawerOpen ? " open" : ""}`} style={{display:"flex"}}>
        <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {navLinks.map(l => (
          <a key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>
            <span className="num">{l.num}</span>{l.label}
          </a>
        ))}
        <a href="/resume.pdf" download className="nav-resume" style={{marginTop:12}}>
          Resume <i className="fa-solid fa-download" style={{marginLeft:6}}></i>
        </a>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section id="home">
      <div className="grid-overlay" />
      <div className="hero-glow1" />
      <div className="hero-glow2" />
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="blink">▋</span> Emerging Software Engineer
          </div>
          <h1 className="hero-name">Hamza<br /><span>Munis</span></h1>
          <p className="hero-location"><i className="fa-solid fa-location-dot"></i> Dallas, TX</p>
          <p className="hero-desc">CS student @ UT Dallas (GPA 3.6) — building full-stack apps, search engines, and tools that solve real problems.</p>
          <div className="hero-cta">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact" className="btn-ghost">Get in Touch</a>
          </div>
          <div className="hero-socials">
            <a href="https://github.com/zxahamza20" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
            <a href="https://linkedin.com/in/Hamza-Munis" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://x.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-x-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>

        <div className="hero-right">
          <div className="terminal">
            <div className="t-header">
              <span className="t-dot red"></span>
              <span className="t-dot yellow"></span>
              <span className="t-dot green"></span>
              <span className="t-title">hamza@portfolio:~</span>
            </div>
            <div className="t-body">
              <span className="t-line"><span className="t-prompt">$</span> whoami</span>
              <span className="t-line t-out">Hamza Munis — CS @ UTD (GPA: 3.6)</span>
              <span className="t-line"><span className="t-prompt">$</span> cat skills.txt</span>
              <span className="t-line t-out">C++, Java, Python, JS, SQL, Vue.js</span>
              <span className="t-line"><span className="t-prompt">$</span> ls projects/</span>
              <span className="t-line t-out">cafe-ecom/  euphorus/  article-db/</span>
              <span className="t-line"><span className="t-prompt">$</span> echo $status</span>
              <span className="t-line t-out t-ok">Open to opportunities ✓</span>
              <span className="t-line"><span className="t-prompt">$</span> <span className="t-cursor">█</span></span>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span><i className="fa-solid fa-chevron-down"></i>
      </div>
    </section>
  );
}

function About() {
  const [tab, setTab] = useState("skills");
  return (
    <section id="about">
      <div className="container">
        <div className="section-label"><span className="section-num">01.</span> About Me</div>
        <div className="about-grid">
          <div className="about-img-wrap">
            <div className="img-frame">
              <img src="/About.JPEG" alt="Hamza Munis" />
            </div>
            <div className="img-accent"></div>
          </div>

          <div className="about-content">
            <h2 className="section-title">Who I Am</h2>
            <p className="about-text">
              Hey, I'm Hamza — a Computer Science student at UT Dallas with a 3.6 GPA and a drive to build software that makes a real difference.
              I transferred from the University of Arizona where I started in Astronomy before following my true passion into CS.
              Outside of class I'm shipping full-stack apps, contributing to club projects, and exploring everything from database engines to voice-activated web tools.
            </p>

            <div className="tab-bar">
              {["skills","experience","education"].map(t => (
                <button
                  key={t}
                  className={`tab-btn${tab === t ? " active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {tab === "skills" && (
              <div>
                <div className="skill-item">
                  <span className="skill-cat">Languages &amp; Tools</span>
                  <div className="skill-tags">
                    {["HTML","CSS","JavaScript","C++","Java","Python","UNIX / C","SQL","Vue.js","Tailwind"].map(s=><span key={s}>{s}</span>)}
                  </div>
                </div>
                <div className="skill-item">
                  <span className="skill-cat">Core Competencies</span>
                  <div className="skill-tags">
                    {["OOP","Web Development","Data Structures","Systems Programming"].map(s=><span key={s}>{s}</span>)}
                  </div>
                </div>
                <div className="skill-item">
                  <span className="skill-cat">Methodologies</span>
                  <div className="skill-tags">
                    {["Agile","Peer Code Reviews","GitHub","Version Control"].map(s=><span key={s}>{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {tab === "experience" && (
              <div>
                <div className="skill-item">
                  <span className="skill-cat">Event Coordination — Assistant Manager &amp; Volunteer</span>
                  <p>Coordinated logistics, led donation drives, and applied leadership in high-pressure environments.</p>
                </div>
                <div className="skill-item">
                  <span className="skill-cat">AIS Club @ UTD — RateMyCareer Project</span>
                  <p>Contributing to a club-built web application with the Association for Information Systems.</p>
                </div>
              </div>
            )}

            {tab === "education" && (
              <div>
                <div className="edu-item">
                  <p className="edu-school">University of Texas at Dallas</p>
                  <p className="edu-degree">B.S. in Computer Science</p>
                  <p className="edu-detail">GPA: 3.6 · Expected May 2027</p>
                  <p className="edu-note">Resuming from August 2024</p>
                </div>
                <div className="edu-item">
                  <p className="edu-school">University of Arizona</p>
                  <p className="edu-degree">B.S. in Astronomy → Transferred to CS</p>
                  <p className="edu-detail">Transferred · Tucson, AZ</p>
                  <p className="edu-note">Changed major to Computer Science and transferred to UTD</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <div className="section-label"><span className="section-num">02.</span> Experience</div>
        <h2 className="section-title">Where I've Worked</h2>
        <div className="exp-list">
          {experiences.map((e, i) => (
            <div className="exp-card" key={i}>
              <div className="exp-icon"><i className={e.icon}></i></div>
              <div className="exp-info">
                <div className="exp-meta">
                  <span className="exp-company">{e.company}</span>
                  <span className="exp-date">{e.date}</span>
                </div>
                <h3 className="exp-role">{e.role}</h3>
                <ul className="exp-bullets">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div className="exp-tag-row">
                  {e.tags.map(t => <span className="exp-tag" key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <div className="section-label"><span className="section-num">03.</span> Projects</div>
        <h2 className="section-title">Things I've Built</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card" key={i}>
              <div className="project-top">
                <div className="project-folder"><i className="fa-regular fa-folder-open"></i></div>
                <div className="project-links">
                  <a href={p.github} target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
                  <a href={p.live}><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                </div>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-stack">
                {p.stack.map(s => <span key={s}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
        <a href="https://github.com/zxahamza20" target="_blank" rel="noreferrer" className="btn-ghost center-btn">
          See More on GitHub <i className="fa-brands fa-github" style={{marginLeft:8}}></i>
        </a>
      </div>
    </section>
  );
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbCjPPH3o1-1Wp1DnY5wIw-p5SdC54QE1AYkpNyPg-t0-oM9Paulc3zomPwvIlksvz/exec";

function Contact() {
  const [form, setForm] = useState({ Name:"", Email:"", Message:"" });
  const [status, setStatus] = useState({ msg:"", err:false });
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setStatus({ msg:"", err:false });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      await fetch(SCRIPT_URL, { method:"POST", body:fd });
      setStatus({ msg:"Message sent — I'll get back to you soon! ✓", err:false });
      setForm({ Name:"", Email:"", Message:"" });
    } catch {
      setStatus({ msg:"Something went wrong. Please email me directly.", err:true });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="section-label"><span className="section-num">04.</span> Contact</div>
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-intro">
          Whether you have a question, an opportunity, or just want to say hi — my inbox is always open.
        </p>

        <div className="contact-grid">
          {/* Left */}
          <div>
            <div className="status-badge">
              <span className="status-dot"></span>
              Available for opportunities
            </div>
            <div className="contact-info-item">
              <i className="fa-solid fa-paper-plane"></i>
              <a href="mailto:hamzamunis1316@email.com">hamzamunis1316@email.com</a>
            </div>
            <div className="contact-info-item">
              <i className="fa-solid fa-square-phone-flip"></i>
              <span>+1 (817) 823-9794</span>
            </div>
            <div className="social-icons">
              <a href="https://github.com/zxahamza20" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
              <a href="https://linkedin.com/in/Hamza-Munis" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
              <a href="https://discord.com/channels/@me" target="_blank" rel="noreferrer"><i className="fa-brands fa-discord"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
            </div>
            <a href="/resume.pdf" download className="btn-primary" style={{marginTop:8}}>
              Download Resume <i className="fa-solid fa-download" style={{marginLeft:8}}></i>
            </a>
          </div>

          {/* Right – form */}
          <div>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="Name" placeholder="John Doe" value={form.Name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Your Email</label>
              <input type="email" name="Email" placeholder="john@example.com" value={form.Email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="Message" rows={5} placeholder="What's on your mind?" value={form.Message} onChange={handleChange} />
            </div>
            <button className="btn-primary" style={{width:"100%", fontSize:15}} onClick={handleSubmit} disabled={sending}>
              {sending ? "Sending…" : <>Send Message <i className="fa-solid fa-paper-plane" style={{marginLeft:8}}></i></>}
            </button>
            <span className={`form-msg${status.err ? " form-err" : ""}`}>{status.msg}</span>
          </div>
        </div>
      </div>

      <footer>
        <p>Designed &amp; Built by <span>Hamza Munis</span> — 2025 ·{" "}
          <a href="https://github.com/zxahamza20" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>
        </p>
      </footer>
    </section>
  );
}

/* ─── APP ───────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}
