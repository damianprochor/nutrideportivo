import { useState, useRef, useEffect } from "react";

// ─── Design tokens ───────────────────────────────────────────
// Deep field-green + electric lime accent + warm off-white
// Typeface: system-ui for utility, wide-tracking caps for headers
// Signature: a "cancha" gradient strip that anchors every screen

const COLORS = {
  fieldDark: "#0D1F0F",
  fieldMid: "#1A3A1C",
  fieldLine: "#2B5E2E",
  lime: "#A8E63D",
  limeLight: "#C8F56A",
  limeDim: "#6B9C22",
  cream: "#F5F0E8",
  sand: "#D4C9A8",
  red: "#E84040",
  amber: "#F5A623",
  white: "#FFFFFF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: ${COLORS.fieldDark}; color: ${COLORS.cream}; }

  .app { min-height: 100vh; display: flex; flex-direction: column; max-width: 430px; margin: 0 auto; position: relative; overflow: hidden; }

  /* Cancha strip — the signature element */
  .cancha-strip {
    height: 4px;
    background: repeating-linear-gradient(90deg, ${COLORS.lime} 0 60px, transparent 60px 80px);
    flex-shrink: 0;
  }

  /* Nav */
  .nav { background: ${COLORS.fieldMid}; border-bottom: 1px solid ${COLORS.fieldLine}; }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
  .nav-logo { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; color: ${COLORS.lime}; }
  .nav-logo span { color: ${COLORS.cream}; }
  .nav-role { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${COLORS.limeDim}; background: ${COLORS.fieldDark}; padding: 3px 8px; border-radius: 4px; }

  /* Tab bar */
  .tabbar { display: flex; background: ${COLORS.fieldMid}; border-top: 1px solid ${COLORS.fieldLine}; }
  .tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: ${COLORS.sand}; cursor: pointer; border: none; background: none; transition: color .2s; }
  .tab.active { color: ${COLORS.lime}; }
  .tab-icon { font-size: 20px; }

  /* Screens */
  .screen { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; }

  /* Cards */
  .card { background: ${COLORS.fieldMid}; border: 1px solid ${COLORS.fieldLine}; border-radius: 12px; padding: 16px; }
  .card-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${COLORS.limeDim}; margin-bottom: 10px; }

  /* Hero stat */
  .hero-stat { display: flex; gap: 12px; align-items: center; }
  .hero-num { font-size: 52px; font-weight: 900; line-height: 1; color: ${COLORS.lime}; letter-spacing: -3px; }
  .hero-label { font-size: 13px; color: ${COLORS.sand}; line-height: 1.4; }
  .hero-label strong { display: block; font-size: 15px; color: ${COLORS.cream}; }

  /* Progress bar */
  .pbar-wrap { margin-top: 8px; }
  .pbar-label { display: flex; justify-content: space-between; font-size: 12px; color: ${COLORS.sand}; margin-bottom: 5px; }
  .pbar { height: 8px; background: ${COLORS.fieldDark}; border-radius: 4px; overflow: hidden; }
  .pbar-fill { height: 100%; background: ${COLORS.lime}; border-radius: 4px; transition: width .5s; }
  .pbar-fill.amber { background: ${COLORS.amber}; }
  .pbar-fill.red { background: ${COLORS.red}; }

  /* Food log */
  .food-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid ${COLORS.fieldLine}; }
  .food-row:last-child { border-bottom: none; }
  .food-emoji { font-size: 26px; flex-shrink: 0; }
  .food-info { flex: 1; }
  .food-name { font-size: 14px; font-weight: 600; color: ${COLORS.cream}; }
  .food-macro { font-size: 12px; color: ${COLORS.sand}; margin-top: 2px; }
  .food-kcal { font-size: 16px; font-weight: 700; color: ${COLORS.lime}; }

  /* Add food */
  .add-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px; background: ${COLORS.lime}; color: ${COLORS.fieldDark}; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; border: none; border-radius: 10px; cursor: pointer; transition: background .15s; }
  .add-btn:hover { background: ${COLORS.limeLight}; }

  /* Suggestion chip */
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .chip { background: ${COLORS.fieldDark}; border: 1px solid ${COLORS.fieldLine}; border-radius: 20px; padding: 6px 12px; font-size: 12px; color: ${COLORS.sand}; cursor: pointer; transition: border-color .15s, color .15s; }
  .chip:hover, .chip.sel { border-color: ${COLORS.lime}; color: ${COLORS.lime}; }

  /* AI response area */
  .ai-box { background: ${COLORS.fieldDark}; border: 1px solid ${COLORS.fieldLine}; border-left: 3px solid ${COLORS.lime}; border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.7; color: ${COLORS.cream}; white-space: pre-wrap; }
  .ai-box.loading { color: ${COLORS.limeDim}; font-style: italic; }

  /* Meal plan card */
  .meal-card { background: ${COLORS.fieldDark}; border-radius: 10px; padding: 12px 14px; border-left: 3px solid ${COLORS.lime}; margin-bottom: 8px; }
  .meal-time { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${COLORS.limeDim}; }
  .meal-name { font-size: 15px; font-weight: 700; color: ${COLORS.cream}; margin: 3px 0; }
  .meal-detail { font-size: 12px; color: ${COLORS.sand}; }

  /* Alert */
  .alert { display: flex; gap: 10px; align-items: flex-start; background: #2A1A0A; border: 1px solid ${COLORS.amber}; border-radius: 10px; padding: 12px; }
  .alert-icon { font-size: 18px; flex-shrink: 0; }
  .alert-text { font-size: 13px; color: ${COLORS.amber}; line-height: 1.5; }

  /* Player list (coach view) */
  .player-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid ${COLORS.fieldLine}; }
  .player-row:last-child { border-bottom: none; }
  .player-avatar { width: 42px; height: 42px; border-radius: 50%; background: ${COLORS.fieldDark}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; border: 2px solid ${COLORS.fieldLine}; }
  .player-name { font-size: 14px; font-weight: 600; color: ${COLORS.cream}; }
  .player-sub { font-size: 12px; color: ${COLORS.sand}; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-left: auto; }
  .status-dot.ok { background: ${COLORS.lime}; }
  .status-dot.warn { background: ${COLORS.amber}; }
  .status-dot.bad { background: ${COLORS.red}; }

  /* Input */
  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${COLORS.limeDim}; }
  .field-input { background: ${COLORS.fieldDark}; border: 1px solid ${COLORS.fieldLine}; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: ${COLORS.cream}; font-family: inherit; width: 100%; }
  .field-input:focus { outline: none; border-color: ${COLORS.lime}; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .field-select { background: ${COLORS.fieldDark}; border: 1px solid ${COLORS.fieldLine}; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: ${COLORS.cream}; font-family: inherit; width: 100%; }

  /* Role toggle */
  .role-toggle { display: flex; gap: 0; background: ${COLORS.fieldDark}; border-radius: 8px; overflow: hidden; border: 1px solid ${COLORS.fieldLine}; margin-bottom: 8px; }
  .role-btn { flex: 1; padding: 10px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: background .15s, color .15s; background: transparent; color: ${COLORS.sand}; }
  .role-btn.active { background: ${COLORS.lime}; color: ${COLORS.fieldDark}; }

  /* Floating log modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: flex; align-items: flex-end; justify-content: center; z-index: 100; }
  .modal { background: ${COLORS.fieldMid}; border-radius: 16px 16px 0 0; padding: 20px 16px; width: 100%; max-width: 430px; border-top: 1px solid ${COLORS.fieldLine}; }
  .modal-handle { width: 36px; height: 4px; background: ${COLORS.fieldLine}; border-radius: 2px; margin: 0 auto 18px; }
  .modal-title { font-size: 16px; font-weight: 700; color: ${COLORS.cream}; margin-bottom: 14px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.fieldLine}; border-radius: 2px; }

  /* Section header */
  .section-hdr { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${COLORS.limeDim}; padding: 4px 0 8px; }

  .badge { display: inline-flex; align-items: center; background: ${COLORS.fieldDark}; border: 1px solid ${COLORS.fieldLine}; border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 600; color: ${COLORS.sand}; }
  .badge.lime { border-color: ${COLORS.lime}; color: ${COLORS.lime}; }
`;

// ─── Mock data ────────────────────────────────────────────────
const PLAYER = {
  name: "Tomás Herrera",
  age: 16,
  weight: 62,
  height: 172,
  position: "Volante",
  goal: "masa_muscular",
  kcalGoal: 2800,
  proteinGoal: 140,
};

const TODAY_LOG = [
  { id: 1, emoji: "🍳", name: "Huevos revueltos (3)", kcal: 210, p: 18, c: 2, g: 14, time: "07:30" },
  { id: 2, emoji: "🍞", name: "Pan marraqueta (2)", kcal: 240, p: 8, c: 46, g: 3, time: "07:30" },
  { id: 3, emoji: "🥛", name: "Leche (200ml)", kcal: 100, p: 7, c: 10, g: 3, time: "10:15" },
  { id: 4, emoji: "🍚", name: "Arroz c/ pollo (plato)", kcal: 420, p: 32, c: 48, g: 8, time: "13:00" },
];

const TEAM = [
  { id: 1, name: "Tomás Herrera", pos: "Volante", kcal: 970, goal: 2800, status: "warn", emoji: "⚡" },
  { id: 2, name: "Bruno Salinas", pos: "Defensa", kcal: 2100, goal: 2400, status: "ok", emoji: "🛡️" },
  { id: 3, name: "Mateo Fuentes", pos: "Delantero", kcal: 400, goal: 3000, status: "bad", emoji: "🔥" },
  { id: 4, name: "Ignacio Vera", pos: "Arco", kcal: 1900, goal: 2600, status: "ok", emoji: "🧤" },
];

const QUICK_FOODS = [
  { emoji: "🍌", name: "Plátano", kcal: 90, p: 1, c: 23, g: 0 },
  { emoji: "🥚", name: "Huevo duro", kcal: 70, p: 6, c: 0, g: 5 },
  { emoji: "🍞", name: "Pan marraqueta", kcal: 120, p: 4, c: 23, g: 1 },
  { emoji: "🥛", name: "Leche (200ml)", kcal: 100, p: 7, c: 10, g: 3 },
  { emoji: "🍚", name: "Arroz c/ pollo", kcal: 420, p: 32, c: 48, g: 8 },
  { emoji: "🫘", name: "Lentejas (plato)", kcal: 230, p: 18, c: 40, g: 1 },
];

// ─── Helpers ──────────────────────────────────────────────────
function macroBar(label, val, max, color = "") {
  const pct = Math.min((val / max) * 100, 100);
  const cls = pct > 90 ? "red" : pct > 60 ? "amber" : color;
  return (
    <div className="pbar-wrap">
      <div className="pbar-label"><span>{label}</span><span>{val} / {max}</span></div>
      <div className="pbar"><div className={`pbar-fill ${cls}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

// ─── Claude API call ─────────────────────────────────────────
async function askClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await res.json();
  return d.content?.map(b => b.text || "").join("\n") || "Sin respuesta.";
}

// ─── Screens ──────────────────────────────────────────────────

function PlayerHome({ log, onAdd }) {
  const kcal = log.reduce((s, f) => s + f.kcal, 0);
  const prot = log.reduce((s, f) => s + f.p, 0);
  const pct = Math.round((kcal / PLAYER.kcalGoal) * 100);

  return (
    <div className="screen">
      {/* Hero */}
      <div className="card">
        <div className="card-title">Hoy · {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "short" })}</div>
        <div className="hero-stat">
          <div className="hero-num">{pct}<span style={{ fontSize: 24 }}>%</span></div>
          <div className="hero-label">
            <strong>{kcal} kcal consumidas</strong>
            Meta: {PLAYER.kcalGoal} kcal · Objetivo: Masa muscular
          </div>
        </div>
        {macroBar("Proteína (g)", prot, PLAYER.proteinGoal)}
        {macroBar("Calorías", kcal, PLAYER.kcalGoal, "")}
      </div>

      {/* Alert if low */}
      {pct < 50 && (
        <div className="alert">
          <div className="alert-icon">⚠️</div>
          <div className="alert-text">Llevas menos de la mitad de tus calorías del día. Tu entrenador será notificado.</div>
        </div>
      )}

      {/* Log */}
      <div className="card">
        <div className="card-title">Registro de comidas</div>
        {log.map(f => (
          <div className="food-row" key={f.id}>
            <div className="food-emoji">{f.emoji}</div>
            <div className="food-info">
              <div className="food-name">{f.name}</div>
              <div className="food-macro">P {f.p}g · C {f.c}g · G {f.g}g · {f.time}</div>
            </div>
            <div className="food-kcal">{f.kcal}</div>
          </div>
        ))}
        <div style={{ marginTop: 12 }}>
          <button className="add-btn" onClick={onAdd}>＋ Agregar comida</button>
        </div>
      </div>
    </div>
  );
}

function PlayerMealPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setPlan(null);
    const prompt = `Eres nutricionista deportivo para jugadores jóvenes de fútbol de escasos recursos en Latinoamérica.
Jugador: ${PLAYER.name}, ${PLAYER.age} años, ${PLAYER.weight}kg, ${PLAYER.height}cm, posición ${PLAYER.position}, objetivo: ganar masa muscular.
Meta calórica: ${PLAYER.kcalGoal} kcal/día, ${PLAYER.proteinGoal}g proteína.

Genera un plan de comidas para HOY con 5 momentos (desayuno, colación mañana, almuerzo, colación tarde, cena).
Usa SOLO alimentos económicos y accesibles en Latinoamérica: huevo, leche, arroz, lentejas, frijoles, pan, plátano, avena, pollo entero, atún en lata, papa, zanahoria, cebolla.
Para cada comida indica: nombre, ingredientes simples con gramos aproximados, calorías y proteína.
Responde de forma clara, breve y amigable para un adolescente. Sin markdown, solo texto directo.`;
    const resp = await askClaude(prompt);
    setPlan(resp);
    setLoading(false);
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="card-title">Plan de comidas · IA</div>
        <p style={{ fontSize: 13, color: COLORS.sand, lineHeight: 1.6, marginBottom: 12 }}>
          Generado según tu peso, posición y objetivo. Solo alimentos económicos y accesibles.
        </p>
        <button className="add-btn" onClick={generate} disabled={loading}>
          {loading ? "Generando…" : "🤖 Generar mi plan de hoy"}
        </button>
      </div>

      {loading && (
        <div className="ai-box loading">El nutricionista virtual está preparando tu plan…</div>
      )}

      {plan && (
        <div className="ai-box">{plan}</div>
      )}

      {!plan && !loading && (
        <div className="card">
          <div className="card-title">¿Qué considero?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["⚖️", "Tu peso y talla actuales"],
              ["🎯", "Objetivo: ganar masa muscular"],
              ["🏃", "Posición de campo: Volante"],
              ["💰", "Alimentos económicos y accesibles"],
            ].map(([icon, txt]) => (
              <div key={txt} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: COLORS.sand }}>
                <span style={{ fontSize: 18 }}>{icon}</span>{txt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CoachView() {
  const [selected, setSelected] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getAdvice(player) {
    setSelected(player);
    setAdvice(null);
    setLoading(true);
    const kcalPct = Math.round((player.kcal / player.goal) * 100);
    const prompt = `Eres asistente de un entrenador/nutricionista deportivo. 
Jugador: ${player.name}, posición ${player.pos}. 
Hoy lleva ${player.kcal} kcal de un objetivo de ${player.goal} kcal (${kcalPct}%).
${kcalPct < 50 ? "Está muy por debajo de su meta." : kcalPct < 80 ? "Está algo debajo de su meta." : "Está bien encaminado."}

Redacta en 3-4 líneas una nota concisa para el entrenador: qué problema detectas, qué consecuencia puede tener en el rendimiento y UNA acción concreta y económica que se le puede pedir al jugador o a su familia hoy. Sé directo y práctico.`;
    const resp = await askClaude(prompt);
    setAdvice(resp);
    setLoading(false);
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="card-title">Estado del equipo · Hoy</div>
        {TEAM.map(p => {
          const pct = Math.round((p.kcal / p.goal) * 100);
          return (
            <div className="player-row" key={p.id} style={{ cursor: "pointer" }} onClick={() => getAdvice(p)}>
              <div className="player-avatar">{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div className="player-name">{p.name}</div>
                <div className="player-sub">{p.pos} · {pct}% meta calórica</div>
                <div className="pbar" style={{ marginTop: 5 }}>
                  <div className={`pbar-fill ${p.status === "ok" ? "" : p.status === "warn" ? "amber" : "red"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
              <div className={`status-dot ${p.status}`} />
            </div>
          );
        })}
      </div>

      {(loading || advice) && (
        <div className="card">
          <div className="card-title">Alerta IA · {selected?.name}</div>
          {loading
            ? <div className="ai-box loading">Analizando…</div>
            : <div className="ai-box">{advice}</div>}
        </div>
      )}

      <div className="card">
        <div className="card-title">Leyenda</div>
        {[
          [COLORS.lime, "En meta o cerca (>80%)"],
          [COLORS.amber, "Por debajo (50–80%)"],
          [COLORS.red, "Crítico (<50%)"],
        ].map(([c, l]) => (
          <div key={l} style={{ display: "flex", gap: 10, alignItems: "center", padding: "5px 0", fontSize: 13, color: COLORS.sand }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />{l}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddFoodModal({ onClose, onAdd }) {
  const [sel, setSel] = useState(null);
  const [custom, setCustom] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  async function analyzeCustom() {
    if (!custom.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    const prompt = `Eres un nutricionista. El usuario comió: "${custom}".
Responde SOLO con un JSON sin markdown en este formato exacto:
{"emoji":"🍽️","name":"Nombre corto","kcal":0,"p":0,"c":0,"g":0}
Donde kcal=calorías, p=proteínas g, c=carbohidratos g, g=grasas g. Usa valores realistas para una porción normal.`;
    try {
      const resp = await askClaude(prompt);
      const clean = resp.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiResult(parsed);
    } catch { setAiResult({ emoji: "🍽️", name: custom, kcal: 200, p: 10, c: 25, g: 5 }); }
    setAiLoading(false);
  }

  function add(food) {
    onAdd({ ...food, id: Date.now(), time: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">¿Qué comiste?</div>

        {/* Quick options */}
        <div className="section-hdr">Selección rápida</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {QUICK_FOODS.map(f => (
            <div key={f.name} className={`chip ${sel?.name === f.name ? "sel" : ""}`}
              onClick={() => setSel(f)}>
              {f.emoji} {f.name}
            </div>
          ))}
        </div>

        {sel && (
          <div style={{ marginBottom: 14 }}>
            <div className="ai-box">{sel.emoji} {sel.name} — {sel.kcal} kcal · P {sel.p}g · C {sel.c}g · G {sel.g}g</div>
            <button className="add-btn" style={{ marginTop: 10 }} onClick={() => add(sel)}>Agregar esta comida</button>
          </div>
        )}

        {/* Custom */}
        <div className="section-hdr" style={{ marginTop: 4 }}>O describe lo que comiste</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="field-input" placeholder="Ej: un plato de cazuela con papa" value={custom}
            onChange={e => setCustom(e.target.value)} style={{ flex: 1 }} />
          <button className="add-btn" style={{ width: "auto", padding: "0 14px", fontSize: 12 }}
            onClick={analyzeCustom} disabled={aiLoading}>
            {aiLoading ? "…" : "Analizar"}
          </button>
        </div>

        {aiResult && (
          <div style={{ marginTop: 12 }}>
            <div className="ai-box">{aiResult.emoji} {aiResult.name} — {aiResult.kcal} kcal · P {aiResult.p}g · C {aiResult.c}g · G {aiResult.g}g</div>
            <button className="add-btn" style={{ marginTop: 10 }} onClick={() => add(aiResult)}>Agregar esta comida</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState("player");
  const [tab, setTab] = useState("home");
  const [log, setLog] = useState(TODAY_LOG);
  const [showModal, setShowModal] = useState(false);

  const TABS_PLAYER = [
    { id: "home", icon: "📋", label: "Registro" },
    { id: "plan", icon: "🤖", label: "Mi Plan" },
  ];
  const TABS_COACH = [
    { id: "home", icon: "👥", label: "Equipo" },
  ];

  const tabs = role === "player" ? TABS_PLAYER : TABS_COACH;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="cancha-strip" />

        {/* Nav */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="nav-logo">Nutri<span>Jugador</span></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div className="role-toggle">
                <button className={`role-btn ${role === "player" ? "active" : ""}`} onClick={() => { setRole("player"); setTab("home"); }}>Jugador</button>
                <button className={`role-btn ${role === "coach" ? "active" : ""}`} onClick={() => { setRole("coach"); setTab("home"); }}>Entrenador</button>
              </div>
            </div>
          </div>
        </nav>

        {/* Screen */}
        {role === "player" && tab === "home" && <PlayerHome log={log} onAdd={() => setShowModal(true)} />}
        {role === "player" && tab === "plan" && <PlayerMealPlan />}
        {role === "coach" && <CoachView />}

        {/* Tab bar */}
        <nav className="tabbar">
          {tabs.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Modal */}
        {showModal && (
          <AddFoodModal
            onClose={() => setShowModal(false)}
            onAdd={food => setLog(prev => [...prev, food])}
          />
        )}
      </div>
    </>
  );
}
