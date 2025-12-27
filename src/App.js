// src/App.js
import React, { useEffect, useState, useRef } from "react";

/* ---------- CSS embebido ---------- */
const css = `
:root{
  --primary:#19a7a1;--ink:#111827;--muted:#6b7280;--bg:#f6f7fb;
  --card:#fff;--shadow:0 10px 30px rgba(0,0,0,.08);--chip:#0f1221;--chipText:#e5e7eb
}
:root[data-theme="dark"]{
  --bg:#0b1020;--ink:#e5e7eb;--muted:#9aa4b2;--card:#0f1424;--shadow:0 10px 30px rgba(0,0,0,.4)
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;background:var(--bg);color:var(--ink)}
a{text-decoration:none;color:inherit}

/* nav fija */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,.9);
backdrop-filter:blur(6px);border-bottom:1px solid #eceff3}
:root[data-theme="dark"] .nav{background:rgba(15,20,36,.75);border-bottom-color:#151b2e}
.nav .wrap{max-width:1100px;margin:0 auto;display:flex;align-items:center;
justify-content:space-between;padding:14px 18px}
.brand{font-weight:800;font-size:26px;letter-spacing:.2px}
.menu{display:flex;gap:20px;font-weight:600}
.menu a{position:relative}
.menu a::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:2px;background:#1273ea;transform:scaleX(0);transform-origin:left;transition:.25s}
.menu a:hover::after{transform:scaleX(1)}
.btn-ghost{padding:10px 14px;border:1px solid #d1d5db;border-radius:12px;background:var(--card)}
.tog{border:1px solid #d1d5db;background:var(--card);border-radius:12px;padding:8px 10px;cursor:pointer}

/* layout */
main{max-width:1100px;margin:0 auto;padding:120px 18px 60px}

/* reveal on scroll */
[data-reveal]{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}
[data-reveal].is-visible{opacity:1;transform:none}

/* hero */
.hero{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:28px}
.kicker{display:inline-block;background:#0f1221;color:#fff;padding:6px 10px;border-radius:10px;font-size:12px;margin-bottom:10px}
.hero h1{font-size:60px;line-height:1.05;margin:0}
.hero h1 .alt{
  background:linear-gradient(90deg,#0b0f19 0%,#1273ea 50%,#0b0f19 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  background-size:200% 100%;animation:shine 8s linear infinite
}
@keyframes shine{0%{background-position:0% 0}100%{background-position:200% 0}}
.hero p{color:var(--muted);max-width:640px}
.hero .cta-row{display:flex;gap:12px;margin-top:18px}

/* Avatar + aro giratorio */
.avatar-wrap{
  position:relative;justify-self:end;width:360px;height:360px;
  display:grid;place-items:center;isolation:isolate;filter:drop-shadow(0 25px 60px rgba(17,24,39,.13));
}
.avatar{
  width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center;
  transition:.45s ease;position:relative;z-index:2;background:#fff;border:8px solid #fff;
  opacity:0;transform:scale(.98);
}
.avatar.loaded{opacity:1;transform:none}
.avatar:hover{filter:hue-rotate(190deg) saturate(1.35)}
.avatar-wrap::after{
  content:"";position:absolute;inset:-14px;border-radius:50%;
  background:conic-gradient(#1273ea, #0a0a0a, #1273ea);
  animation:spin 10s linear infinite;
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 18px),#000 calc(100% - 18px));
          mask:radial-gradient(farthest-side,transparent calc(100% - 18px),#000 calc(100% - 18px));
}
@keyframes spin{to{transform:rotate(1turn)}}

/* ----------- ACERCA + EXPLORADOR DIDÁCTICO ----------- */
.section{margin-top:48px}
.s-title{font-size:36px;text-align:center;margin:0 0 18px}
.about{display:grid;grid-template-columns:1.05fr .95fr;gap:22px;align-items:start}
.bio{background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:22px 24px;line-height:1.7;}
.explorer{background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:20px}
.tabs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.tab{padding:8px 12px;border-radius:10px;border:1px solid #e2e8f0;background:var(--card);cursor:pointer}
.tab[aria-selected="true"]{background:#1273ea;color:#fff;border-color:#1273ea}
.skills{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0 6px}
.skill{
  background:var(--chip);color:var(--chipText);padding:8px 12px;border-radius:12px;
  font-size:14px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;
  transform:translateY(0);transition:.2s;box-shadow:0 4px 10px rgba(15,18,33,.18)
}
.skill:hover{transform:translateY(-3px)}
.skill[aria-pressed="true"]{outline:2px solid #1273ea}
.detail{margin-top:8px}
.detail h4{margin:4px 0 6px}
.progress{height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden;margin:8px 0 14px}
.progress > span{display:block;height:100%;background:linear-gradient(90deg,#1273ea,#19a7a1);width:0}
.progress.show > span{width:var(--w);transition:width .7s ease}
.code{position:relative;background:#0f1221;color:#e5e7eb;border-radius:12px;padding:14px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
.copy{position:absolute;top:8px;right:8px;border-radius:10px;border:1px solid #334155;background:#111827;color:#e5e7eb;padding:6px 10px;cursor:pointer}

/* tabla */
.table-card{background:var(--card);border-radius:16px;box-shadow:var(--shadow);padding:10px}
.table-card h2{text-align:center;margin:10px 0 16px}
table{width:100%;border-collapse:collapse}
thead th{background:#0f1221;color:#fff;text-align:left;padding:12px;border-top-left-radius:8px;border-top-right-radius:8px}
tbody td{padding:12px;border-top:1px solid #e5e7eb}
tbody tr:nth-child(even) td{background:#fafafa}
tbody tr:hover td{background:#dff5ff}

/* grid cards */
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{background:var(--card);border-radius:14px;box-shadow:var(--shadow);padding:18px;transition:.3s}
.card:hover{transform:translateY(-4px);box-shadow:0 6px 16px rgba(0,0,0,.15)}
.card h3{margin:6:0 8px}.muted{color:var(--muted)}
.card .btn{display:inline-block;margin-top:10px;border:1px solid #19a7a1;color:#19a7a1;padding:8px 12px;border-radius:10px}

/* contacto */
.contacto{display:grid;place-items:center;margin-top:28px}
.contact-card{position:relative;background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:26px 24px;max-width:720px;width:100%;overflow:hidden}
.contact-content{position:relative;z-index:2}
.contact-title{font-size:28px;margin:0 0 10px}
.contact-row{display:flex;gap:16px;flex-wrap:wrap}
.contact-item{background:#f3f4f6;padding:10px 14px;border-radius:12px}
.contact-card svg{position:absolute;inset:0;width:100%;height:100%;z-index:1}
.dotted-border{fill:none;stroke:#19a7a1;stroke-width:4;stroke-linecap:round;stroke-dasharray:0 14;animation:dash 8s linear infinite}
@keyframes dash{to{stroke-dashoffset:-300}}

footer{margin-top:40px;padding:24px 0;text-align:center;color:#6b7280}

/* responsive */
@media (max-width:980px){
  .hero{grid-template-columns:1fr}
  .avatar-wrap{justify-self:center;width:300px;height:300px}
  .about{grid-template-columns:1fr}
  .grid{grid-template-columns:1fr}
}
`;

/* ---------- hooks ---------- */
const useTypingEffect = (text, speed = 100) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
};

const useRevealOnScroll = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && e.target.classList.add("is-visible"),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

/* ---------- data: skills didácticos ---------- */
const SKILLS = {
  Frontend: [
    {key:"html", name:"HTML5", level:90, desc:"Define la estructura semántica del documento.", example:`<header>\n  <nav>...</nav>\n</header>\n<main>\n  <article>Contenido</article>\n</main>\n<footer>© 2025</footer>`},
    {key:"css", name:"CSS3", level:88, desc:"Estilos responsivos, grid y animaciones.", example:`.card{display:grid;gap:12px;border-radius:12px;padding:16px}`},
    {key:"tailwind", name:"Tailwind CSS", level:80, desc:"Utilidades para prototipar rápido y mantener consistencia.", example:`<button class="px-4 py-2 rounded-xl border">Guardar</button>`},
    {key:"js", name:"JavaScript", level:85, desc:"Interactividad del DOM y lógica.", example:`const btn=document.querySelector('button');\nbtn.addEventListener('click',()=>alert('Hola!'))`},
    {key:"react", name:"React.js", level:82, desc:"Componentes reutilizables y estado.", example:`function Hola({nombre}){return <h1>Hola {nombre}</h1>}`},
    {key:"figma", name:"Figma", level:70, desc:"Diseño UI y handoff para devs.", example:`/* Tokens: color, tipografía, espaciado */`},
  ],
  Backend: [
    {key:"php", name:"PHP 8", level:70, desc:"APIs rápidas y plantillas.", example:`$app->get('/saludo', fn()=>['msg'=>'Hola']);`},
    {key:"laravel", name:"Laravel", level:72, desc:"MVC + migraciones + colas.", example:`Route::get('/users',[UserController::class,'index']);`},
    {key:"docker", name:"Docker", level:68, desc:"Entornos replicables.", example:`FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD ["npm","run","dev"]`},
    {key:"jwt", name:"JWT", level:65, desc:"Autenticación stateless.", example:`const token = jwt.sign({id}, SECRET, {expiresIn:'1h'})`},
    {key:"linux", name:"Linux", level:75, desc:"CLI, permisos, systemd.", example:`sudo systemctl status nginx`},
    {key:"git", name:"GIT", level:82, desc:"Flujos de trabajo, ramas y PRs.", example:`git switch -c feat/ui-refactor`},
  ],
  Database: [
    {key:"mysql", name:"MySQL", level:78, desc:"Relaciones y joins.", example:`SELECT u.name, p.title FROM users u JOIN posts p ON p.user_id=u.id;`},
    {key:"pg", name:"PostgreSQL", level:70, desc:"CTE, JSONB, ventanas.", example:`WITH c AS (SELECT * FROM sales)\nSELECT * FROM c WHERE total>100;`},
    {key:"mssql", name:"SQLServer", level:65, desc:"Procedimientos almacenados.", example:`CREATE PROCEDURE spUsers AS SELECT * FROM Users;`},
  ],
};

/* ---------- util ---------- */
const copy = async (text, setCopied) => {
  try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1200); }
  catch {}
};

/* ---------- Componentes ---------- */
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme==="dark"?"dark":"light");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <button className="tog" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} aria-label="Cambiar tema">
      {theme==="dark" ? "☀️" : "🌙"}
    </button>
  );
};

const Nav = () => (
  <nav className="nav" role="navigation" aria-label="principal">
    <div className="wrap">
      <div className="brand">Jhamir Mallqui</div>
      <div className="menu">
        <a href="#inicio">Inicio</a>
        <a href="#about">Acerca de mí</a>
        <a href="#plan">Plan</a>
        <a href="#proyectos">Proyectos</a>
        <a href="#contacto">Contáctame</a>
      </div>
      <div style={{display:"flex", gap:10}}>
        <ThemeToggle />
        <a className="btn-ghost" href="/cv-jhamir.pdf" target="_blank" rel="noreferrer">Descargar CV</a>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const animatedText = useTypingEffect("Desarrollador Front-End", 120);
  const reveal = useRevealOnScroll();
  const [src, setSrc] = useState("/yo.jpeg");
  const [loaded, setLoaded] = useState(false);
  const onError = () => setSrc("https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&h=800&fit=crop");

  return (
    <section id="inicio" className="hero" data-reveal ref={reveal}>
      <div>
        <span className="kicker">Hola, Yo soy</span>
        <h1>
          <span className="alt">Jhamir Mallqui</span><br />
          {animatedText}
        </h1>
        <p>Portafolio académico con mis actividades semanales del curso de Desarrollo de Aplicaciones Web.</p>
        <div className="cta-row">
          <a className="btn-ghost" href="#proyectos">Ver proyectos</a>
          <a className="btn-ghost" href="#contacto">Contáctame</a>
        </div>
      </div>
      <div className="avatar-wrap">
        <img className={`avatar ${loaded ? "loaded" : ""}`} src={src} alt="Foto de Jhamir" onError={onError} onLoad={()=>setLoaded(true)} loading="eager" />
      </div>
    </section>
  );
};

/* --------- Sección didáctica segura --------- */
const SkillExplorer = () => {
  const reveal = useRevealOnScroll();
  const cats = Object.keys(SKILLS);

  const [cat, setCat] = useState(cats[0]);
  const [sel, setSel] = useState(SKILLS[cats[0]]?.[0]?.key ?? "");

  const list = SKILLS[cat] ?? [];
  const active = list.find((s) => s.key === sel) || list[0];

  const [copied, setCopied] = useState(false);

  const handleSwitchTab = (c) => {
    setCat(c);
    const first = SKILLS[c]?.[0]?.key ?? "";
    setSel(first);
  };

  return (
    <section id="about" className="section" data-reveal ref={reveal}>
      <h2 className="s-title">Acerca de mí</h2>

      <div className="about">
        <article className="bio">
          <p>
            Me gusta explicar lo que uso. Explora mis tecnologías para ver <strong>qué son</strong>,
            <strong> cuándo las aplico</strong> y un <strong>ejemplo corto</strong>. Esto muestra mi forma de pensar y construir interfaces claras.
          </p>
        </article>

        <aside className="explorer" aria-live="polite">
          {/* Tabs */}
          <div className="tabs" role="tablist">
            {cats.map((c) => (
              <button
                key={c}
                role="tab"
                className="tab"
                aria-selected={cat === c}
                onClick={() => handleSwitchTab(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Si no hay skills */}
          {list.length === 0 ? (
            <p className="muted">No hay habilidades cargadas para esta categoría.</p>
          ) : (
            <>
              {/* Chips de skills */}
              <div className="skills" role="group" aria-label="skills">
                {list.map((s) => (
                  <button
                    key={s.key}
                    className="skill"
                    aria-pressed={sel === s.key}
                    onClick={() => setSel(s.key)}
                  >
                    • {s.name}
                  </button>
                ))}
              </div>

              {/* Detalle del skill */}
              <div className="detail">
                <h4>{active?.name ?? ""}</h4>
                <p style={{ marginTop: 4 }}>{active?.desc ?? ""}</p>

                <div
                  className={`progress ${active ? "show" : ""}`}
                  style={{ "--w": active ? `${active.level}%` : "0%" }}
                >
                  <span aria-hidden="true"></span>
                </div>

                {active && (
                  <div className="code">
                    <button
                      className="copy"
                      onClick={() => copy(active.example, setCopied)}
                    >
                      {copied ? "✅ Copiado" : "Copiar"}
                    </button>
                    <pre>
                      <code>{active.example}</code>
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
};

const Plan = () => {
  const reveal = useRevealOnScroll();
  return (
    <section id="plan" className="section" data-reveal ref={reveal}>
      <div className="table-card">
        <h2>Plan de Actividades Semanales</h2>
        <table>
          <thead>
            <tr><th>Semana</th><th>Tema</th><th>Aprendido</th></tr>
          </thead>
          <tbody>
  <tr><td>1</td><td>Introducción y VS Code</td><td>Entorno, atajos y flujo de trabajo.</td></tr>
  <tr><td>2</td><td>HTML y CSS</td><td>Estructura semántica y estilos responsive.</td></tr>
  <tr><td>3</td><td>Ejercicios HTML/CSS</td><td>Prácticas de maquetación y componentes.</td></tr>
  <tr><td>4</td><td>Tailwind + JavaScript</td><td>Estilos avanzados e interactividad con JS.</td></tr>
  <tr><td>5</td><td>Integración + Intro React</td><td>Unir tecnologías y primera app en React.</td></tr>
  <tr><td>6</td><td>React con Vite/Next</td><td>Entornos modernos y despliegue.</td></tr>
  <tr><td>7</td><td>React + Vite (TypeScript)</td><td>Comprensión del flujo moderno con TypeScript.</td></tr>

  <tr>
    <td>8</td>
    <td>Examen Parcial</td>
    <td>Evaluación de conocimientos frontend y fundamentos web.</td>
  </tr>

  <tr>
    <td>9</td>
    <td>Teoría Backend Java (JSP / Tomcat / Maven)</td>
    <td>Fundamentos del backend con Java, JSP, Tomcat y Maven.</td>
  </tr>

  <tr>
    <td>10</td>
    <td>CRUD Estudiante (Spring Boot + MySQL + Postman)</td>
    <td>Desarrollo de un CRUD usando Spring Boot y validación con Postman.</td>
  </tr>

  <tr>
    <td>11</td>
    <td>CRUD Docente (Swagger + Postman)</td>
    <td>Documentación de APIs con Swagger y endpoints adicionales.</td>
  </tr>

  <tr>
    <td>12</td>
    <td>Teoría Backend PHP (Apache + Composer)</td>
    <td>Arquitectura backend con PHP moderno y dependencias.</td>
  </tr>

  <tr>
    <td>13</td>
    <td>CRUD Laravel (MySQL + Blade + Tailwind)</td>
    <td>Desarrollo de CRUD completo usando Laravel.</td>
  </tr>

  <tr>
    <td>14</td>
    <td>Python + Flask + App Inteligente (LLM)</td>
    <td>CRUD con Flask y aplicación inteligente usando LLM tipo LLaMA.</td>
  </tr>

  <tr>
    <td>15</td>
    <td>Proyecto Final Integrador</td>
    <td>Integración frontend + backend y presentación final.</td>
  </tr>
</tbody>
        </table>
      </div>
    </section>
  );
};

const Proyectos = () => {
  const reveal = useRevealOnScroll();
  const semanas = [
  { titulo: "Semana 01 | VS Code", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana01" },
  { titulo: "Semana 02 | HTML y CSS", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana02" },
  { titulo: "Semana 03 | HTML/CSS Práctico", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana03" },
  { titulo: "Semana 04 | Tailwind + JavaScript", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana04" },
  { titulo: "Semana 05 | Integración + React", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana05" },
  { titulo: "Semana 06 | React con Vite", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana06" },
  { titulo: "Semana 07 | React + Vite (TypeScript)", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana07" },

  { titulo: "Semana 08 | Examen Parcial", url: "#" },

  { titulo: "Semana 09 | Backend Java (JSP / Tomcat / Maven)", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana09" },

  { titulo: "Semana 10 | CRUD Estudiante (Spring Boot)", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana10" },

  { titulo: "Semana 11 | CRUD Docente (Swagger + Postman)", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana11" },

  { titulo: "Semana 12 | Backend PHP (Apache + Composer)", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana12" },

  { titulo: "Semana 13 | CRUD Laravel", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana13" },

  { titulo: "Semana 14 | Flask + LLM (App Inteligente)", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana14" },

  { titulo: "Semana 15 | Proyecto Final Integrador", url: "https://github.com/Jhamir-rw/PortafolioAcademico/tree/main/SemanasAcademicas/Semana15" },
];

  const [q, setQ] = useState("");
  const filtered = semanas.filter(s => s.titulo.toLowerCase().includes(q.toLowerCase()));

  return (
    <section id="proyectos" className="section" data-reveal ref={reveal}>
      <h2 className="s-title">Repositorio de Proyectos Académicos</h2>

      <div style={{display:"flex", gap:10, margin:"8px 0 16px"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar semana..." aria-label="Buscar" style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1px solid #d1d5db",background:"var(--card)",color:"var(--ink)"}}/>
        {q && <button className="btn-ghost" onClick={()=>setQ("")}>Limpiar</button>}
      </div>

      <div className="grid">
        {filtered.map((s, i) => (
          <article className="card" key={i}>
            <h3>{s.titulo}</h3>
            <p className="muted">Revisión de las actividades de la semana.</p>
            <a className="btn" href={s.url} target="_blank" rel="noreferrer">Dirígete al repositorio</a>
          </article>
        ))}
        {filtered.length===0 && <p className="muted">No hay resultados para “{q}”.</p>}
      </div>
    </section>
  );
};


const Contacto = () => {
  const reveal = useRevealOnScroll();
  return (
    <section id="contacto" className="contacto section" data-reveal ref={reveal}>
      <div className="contact-card" aria-live="polite">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect className="dotted-border" x="2" y="2" width="96" height="96" rx="10" ry="10" />
        </svg>
        <div className="contact-content">
          <h3 className="contact-title">Contáctame</h3>
          <p className="muted" style={{marginTop: -6, marginBottom: 14}}>
            ¿Tienes una idea o proyecto? Hablemos.
          </p>
          <div className="contact-row">
            <div className="contact-item">📞 <strong>952 043 730</strong></div>
            <div className="contact-item">📧 <strong>jhamir.mallqui.mez@gmail.com</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <>
      <style>{css}</style>
      <Nav />
      <main>
        <Hero />
        <SkillExplorer />  {/* sección didáctica */}
        <Plan />
        <Proyectos />
        <Contacto />
        <footer>© {new Date().getFullYear()} Jhamir Mallqui — Portafolio académico</footer>
      </main>
    </>
  );
}
