import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SITE = "https://equipajeordenado.com";
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"];

export interface GuideRow {
  slug: string;
  title: string;
  category: string;
  category_name: string;
  excerpt: string | null;
  featured_image: string | null;
  search_text: string | null;
}

export interface GuideCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  excerpt: string;
}

function calculateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  if (model.includes("mini")) {
    return Number((promptTokens * 0.00000015 + completionTokens * 0.0000006).toFixed(6));
  }
  return Number((promptTokens * 0.0000025 + completionTokens * 0.00001).toFixed(6));
}

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "como", "hacer", "llevar", "puedo", "puede", "pueden", "equipaje", "mano", "maleta",
  "maletas", "avion", "vuelo", "vuelos", "viaje", "viajar", "para", "con", "sin", "una",
  "uno", "unos", "unas", "los", "las", "del", "que", "cual", "cuales", "dime", "por",
  "favor", "hola", "buenas", "buenos", "dias", "tardes", "noches", "tengo", "sobre",
  "este", "esta", "estos", "estas", "mas", "muy", "permitido", "permitidos", "cabina"
]);

function stemWord(w: string): string {
  if (w.length > 5 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("s")) return w.slice(0, -1);
  return w;
}

function extractTokens(text: string): string[] {
  const words = norm(text)
    .split(" ")
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return Array.from(new Set(words));
}

let catalogCache: { at: number; rows: GuideRow[]; bySlug: Map<string, GuideRow> } | null = null;

async function loadCatalog(): Promise<{ rows: GuideRow[]; bySlug: Map<string, GuideRow> }> {
  if (catalogCache && Date.now() - catalogCache.at < 10 * 60 * 1000 && catalogCache.rows.length > 0) {
    return catalogCache;
  }
  const pages = await Promise.all([
    supabase
      .from("equipajeordenado_guides")
      .select("slug, title, category, category_name, excerpt, featured_image, search_text")
      .eq("active", true)
      .range(0, 999),
    supabase
      .from("equipajeordenado_guides")
      .select("slug, title, category, category_name, excerpt, featured_image, search_text")
      .eq("active", true)
      .range(1000, 1999),
  ]);

  const rows: GuideRow[] = [];
  const bySlug = new Map<string, GuideRow>();
  for (const p of pages) {
    if (Array.isArray(p.data)) {
      for (const r of p.data as GuideRow[]) {
        if (!bySlug.has(r.slug)) {
          bySlug.set(r.slug, r);
          rows.push(r);
        }
      }
    }
  }
  catalogCache = { at: Date.now(), rows, bySlug };
  return catalogCache;
}

function getGuideUrl(r: { slug: string; category: string }): string {
  if (!r.category || r.category === "pilar") {
    return `${SITE}/${r.slug}/`;
  }
  return `${SITE}/${r.category}/${r.slug}/`;
}

function toGuideCard(r: GuideRow): GuideCard {
  const img = r.featured_image || "/images/Charlie-Lingan.jpg";
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryName: r.category_name,
    url: getGuideUrl(r),
    image: img.startsWith("http") ? img : `${SITE}${img}`,
    excerpt: (r.excerpt || "").slice(0, 140),
  };
}

function searchGuides(rows: GuideRow[], userMessage: string, historyText: string, limit = 16): GuideRow[] {
  const primaryTokens = extractTokens(userMessage);
  const contextTokens = extractTokens(historyText).filter((t) => !primaryTokens.includes(t));
  const fullPhrase = norm(userMessage);

  if (primaryTokens.length === 0 && contextTokens.length === 0) {
    const starterSlugs = [
      "medidas-equipaje-de-mano",
      "equipaje-de-mano",
      "que-liquidos-estan-permitidos-en-el-equipaje-de-mano",
      "cuales-son-las-restricciones-de-peso-para-el-equipaje-de-mano",
      "que-se-considera-como-equipaje-de-mano",
      "como-asegurar-tu-equipaje-de-mano-contra-robos",
      "seguro-para-maletas-de-viaje",
      "puedo-viajar-con-bateria-externa-o-power-bank",
    ];
    const picked: GuideRow[] = [];
    for (const s of starterSlugs) {
      const found = rows.find((r) => r.slug === s);
      if (found) picked.push(found);
    }
    return picked.length > 0 ? picked : rows.slice(0, 8);
  }

  const scored: Array<{ r: GuideRow; score: number }> = [];

  for (const r of rows) {
    const titleNorm = norm(r.title);
    const catNorm = norm(`${r.category_name} ${r.category}`);
    const bodyNorm = r.search_text || `${titleNorm} ${catNorm} ${norm(r.excerpt || "")}`;

    let score = 0;

    if (r.category === "pilar") {
      score += 4;
    }

    if (fullPhrase.length >= 5 && titleNorm.includes(fullPhrase)) {
      score += 45;
    }

    let matchedPrimary = 0;
    for (const tok of primaryTokens) {
      const stem = stemWord(tok);
      if (titleNorm.includes(tok) || (stem.length >= 4 && titleNorm.includes(stem))) {
        score += 16;
        matchedPrimary++;
      } else if (catNorm.includes(tok) || (stem.length >= 4 && catNorm.includes(stem))) {
        score += 8;
        matchedPrimary++;
      } else if (bodyNorm.includes(tok) || (stem.length >= 4 && bodyNorm.includes(stem))) {
        score += 5;
        matchedPrimary++;
      }
    }

    if (matchedPrimary >= 2) {
      score += matchedPrimary * 8;
    }

    for (const cTok of contextTokens.slice(-5)) {
      const stem = stemWord(cTok);
      if (titleNorm.includes(cTok) || (stem.length >= 4 && titleNorm.includes(stem))) {
        score += 3;
      }
    }

    if (score > 0) {
      scored.push({ r, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.r);
}

const AIRLINES_SUMMARY = `
TABLA OFICIAL VERIFICADA DE MEDIDAS Y PESO POR AEROLÍNEA (EQUIPAJEORDENADO.COM):
- Iberia (España): Maleta cabina 56 x 40 x 25 cm (10 kg) | Artículo personal 40 x 30 x 15 cm | ¿Incluida en Basic?: Sí.
- Air Europa (España): Maleta cabina 55 x 35 x 25 cm (10 kg) | Artículo personal 40 x 30 x 15 cm | ¿Incluida en Lite?: Sí.
- Vueling (España): Maleta cabina 55 x 40 x 20 cm (10 kg) | Artículo personal 40 x 30 x 20 cm | ¿Incluida en Basic?: No (solo bolso bajo asiento).
- Ryanair (Irlanda): Maleta cabina 55 x 40 x 20 cm (10 kg) | Artículo personal 40 x 30 x 20 cm | ¿Incluida en Basic?: No (requiere Prioridad y 2 piezas).
- easyJet (Reino Unido): Maleta cabina 56 x 45 x 25 cm (15 kg) | Artículo personal 45 x 36 x 20 cm | ¿Incluida en Basic?: No (solo bolso bajo asiento 45x36x20 cm gratis).
- LATAM Airlines (Sudamérica/Perú/Chile): Maleta cabina 55 x 35 x 25 cm (12 kg) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Basic?: No (Basic solo incluye artículo personal; Light y superiores incluyen maleta).
- Avianca (Colombia/Latam): Maleta cabina 55 x 35 x 25 cm (10 kg) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Basic?: No (Basic solo artículo personal).
- Aeroméxico (México): Maleta cabina 55 x 40 x 25 cm (10 kg Básica / 15 kg Clásica combinados) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Básica?: Sí.
- Copa Airlines (Panamá/Latam): Maleta cabina 56 x 36 x 26 cm (10 kg) | Artículo personal 43 x 25 x 22 cm | ¿Incluida en Basic?: Sí (todas las tarifas incluyen maleta + artículo personal).
- JetSMART (Perú/Chile/Latam): Maleta cabina 55 x 35 x 25 cm (10 kg) | Artículo personal 45 x 35 x 25 cm | ¿Incluida en tarifa básica?: No (solo mochila bajo asiento).
- Sky Airline (Perú/Chile): Maleta cabina 55 x 35 x 25 cm (12 kg) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Zero?: No (Zero solo artículo personal; Plus sí incluye).
- Volaris (México): Maleta cabina 55 x 40 x 25 cm (20 kg combinados cuando la tarifa lo incluye) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Zero?: No.
- Viva Aerobus (México): Maleta cabina 55 x 40 x 25 cm (10 kg) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Zero?: No.
- Aerolíneas Argentinas: Maleta cabina 55 x 35 x 25 cm (8 kg nacional / 10 kg internacional) | Artículo personal 40 x 30 x 15 cm (3 kg).
- American Airlines (EE.UU.): Maleta cabina 56 x 36 x 23 cm (sin límite de peso publicado) | Artículo personal 45 x 35 x 20 cm | ¿Incluida en Basic Economy?: Sí.
- United Airlines (EE.UU.): Maleta cabina 56 x 35 x 23 cm | Artículo personal 43 x 25 x 22 cm | Basic Economy solo permite artículo personal en rutas domésticas (sí incluye maleta en transatlánticos/Sudamérica).
- Delta Air Lines (EE.UU.): Maleta cabina 56 x 35 x 23 cm | Artículo personal bajo asiento | ¿Incluida en Basic Economy?: Sí.
- KLM (Países Bajos): Maleta cabina 55 x 35 x 25 cm (12 kg combinados) | Artículo personal 40 x 30 x 15 cm.
- Air France (Francia): Maleta cabina 55 x 35 x 25 cm (12 kg combinados) | Artículo personal 40 x 30 x 15 cm | ¿Incluida en Economy Light?: Sí.
- Lufthansa (Alemania): Maleta cabina 55 x 40 x 23 cm (8 kg) | Artículo personal 40 x 30 x 15 cm.
URL oficial de la tabla completa: ${SITE}/medidas-equipaje-de-mano/
`;

const CATEGORIES_OVERVIEW = `
SECCIONES Y CATEGORÍAS OFICIALES DE EQUIPAJEORDENADO.COM:
- Tabla de Medidas por Aerolínea: ${SITE}/medidas-equipaje-de-mano/
- Guía Completa del Equipaje de Mano: ${SITE}/equipaje-de-mano/
- Qué llevar en el equipaje de mano (líquidos, comida, electrónicos, medicinas): ${SITE}/que-se-puede-llevar-en-el-equipaje-de-mano/
- Reglas y medidas por aerolínea: ${SITE}/reglas-de-equipaje/
- Regulaciones aeroportuarias (TSA, UE, IATA, 100 ml, peso): ${SITE}/regulaciones/
- Marcas de maletas (Samsonite, American Tourister, Travelpro, Cabin Max): ${SITE}/marcas/
- Tipos de equipaje (rígidas, blandas, mochilas de cabina, carry-on): ${SITE}/tipos/
- Equipaje económico y ofertas: ${SITE}/barato/
- Seguridad en viajes (candados TSA, seguro de maletas, antirrobo): ${SITE}/seguridad/
- Consejos de empaque y organización: ${SITE}/consejos/
- Guías paso a paso de equipaje: ${SITE}/guias/
- Experiencias y tips de viajeros: ${SITE}/experiencias-y-tips-de-viajeros/
- Aerolíneas comerciales y low cost: ${SITE}/aerolineas/
- Reseñas de maletas: ${SITE}/resenas/
- Sobre Charlie Lingán (autor): ${SITE}/hola-hablamos/
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || (req.method === "GET" ? "config" : "chat");

    // 1. Load live config
    const { data: configRow } = await supabase
      .from("equipajeordenado_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = configRow || {
      is_enabled: true,
      ai_model: "gpt-4o-mini",
      temperature: 0.4,
      max_messages_per_session: 25,
      daily_budget_usd: 5.0,
      welcome_message:
        "¡Hola! 👋 Soy tu Asesor de Equipaje y Vuelos IA de Equipaje Ordenado. Pregúntame sobre las medidas y peso de cabina de tu aerolínea, qué puedes llevar en el avión (líquidos 100 ml, baterías, medicamentos), cómo empacar tu maleta o cualquier duda de viaje.",
      custom_instructions: "",
    };

    const activeModel = ALLOWED_MODELS.includes(config.ai_model) ? config.ai_model : "gpt-4o-mini";

    if (mode === "config" || req.method === "GET") {
      return json({
        is_enabled: config.is_enabled,
        welcome_message: config.welcome_message,
        ai_model: activeModel,
        max_messages_per_session: config.max_messages_per_session,
      });
    }

    // 2. Track click on a guide link or card
    if (mode === "track_click") {
      const { session_id, visitor_id, guide_slug, guide_title, category, target_url, page_url } = body;
      if (target_url) {
        await supabase.from("equipajeordenado_chat_clicks").insert({
          session_id: session_id || null,
          visitor_id: String(visitor_id || "anon").slice(0, 80),
          guide_slug: guide_slug ? String(guide_slug).slice(0, 160) : null,
          guide_title: guide_title ? String(guide_title).slice(0, 220) : null,
          category: category ? String(category).slice(0, 80) : null,
          target_url: String(target_url).slice(0, 500),
          page_url: page_url ? String(page_url).slice(0, 500) : null,
        });

        if (session_id) {
          const { data: sess } = await supabase
            .from("equipajeordenado_chat_sessions")
            .select("clicks_count, clicked_urls")
            .eq("id", session_id)
            .maybeSingle();
          if (sess) {
            const urls = Array.isArray(sess.clicked_urls) ? sess.clicked_urls : [];
            if (!urls.includes(target_url)) urls.push(target_url);
            await supabase
              .from("equipajeordenado_chat_sessions")
              .update({
                clicks_count: (sess.clicks_count || 0) + 1,
                clicked_urls: urls,
              })
              .eq("id", session_id);
          }
        }
      }
      return json({ success: true });
    }

    // 3. Chat Completion Mode
    if (!config.is_enabled) {
      return json({
        reply: `En este momento el Asesor de Equipaje IA está en mantenimiento breve. Puedes consultar nuestra tabla oficial en [Medidas por Aerolínea](${SITE}/medidas-equipaje-de-mano/) o la [Guía Completa de Equipaje de Mano](${SITE}/equipaje-de-mano/).`,
        recommended_guides: [],
        suggested_options: ["Ver medidas por aerolínea"],
        disabled: true,
      });
    }

    const userMessage = String(body.message || "").trim().slice(0, 1000);
    if (!userMessage) {
      return json({ error: "Mensaje vacío" }, 400);
    }

    const visitorId = String(body.visitor_id || "visitor-" + crypto.randomUUID().slice(0, 8)).slice(0, 80);
    const pageUrl = String(body.page_url || SITE + "/").slice(0, 500);
    const userAgent = String(body.user_agent || req.headers.get("user-agent") || "").slice(0, 300);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    // Check daily budget
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { data: todaySessions } = await supabase
      .from("equipajeordenado_chat_sessions")
      .select("estimated_cost_usd")
      .gte("last_message_at", startOfDay.toISOString());

    const spentToday = (todaySessions || []).reduce(
      (acc: number, r: any) => acc + Number(r.estimated_cost_usd || 0),
      0
    );

    if (spentToday >= Number(config.daily_budget_usd || 5)) {
      return json({
        reply: `Hemos alcanzado el límite diario de consultas automáticas. Puedes consultar todas las medidas y reglas gratis en [Medidas por Aerolínea](${SITE}/medidas-equipaje-de-mano/) y en [Equipaje Ordenado](${SITE}/).`,
        recommended_guides: [],
        suggested_options: [],
      });
    }

    // Load or create session
    let existingSession: any = null;
    if (sessionId) {
      const { data: s } = await supabase
        .from("equipajeordenado_chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      existingSession = s;
    }

    if (
      existingSession &&
      existingSession.messages_count >= (config.max_messages_per_session || 25) * 2
    ) {
      return json({
        session_id: existingSession.id,
        reply: `Hemos llegado al límite de mensajes de esta sesión. ¡Buen viaje! Puedes abrir cualquiera de las guías recomendadas o consultar nuestra tabla en [Medidas de Equipaje de Mano](${SITE}/medidas-equipaje-de-mano/).`,
        recommended_guides: [],
        suggested_options: [],
      });
    }

    if (!existingSession) {
      const { data: created, error: createErr } = await supabase
        .from("equipajeordenado_chat_sessions")
        .insert({
          visitor_id: visitorId,
          page_url: pageUrl,
          user_agent: userAgent,
          first_user_message: userMessage.slice(0, 250),
          last_user_message: userMessage.slice(0, 250),
          messages_count: 1,
          model_used: activeModel,
        })
        .select("*")
        .single();

      if (!createErr && created) {
        existingSession = created;
        sessionId = created.id;
      }
    }

    if (sessionId) {
      await supabase.from("equipajeordenado_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    // Search matching guides in our catalog
    const catalog = await loadCatalog();
    const recentHistoryText = history
      .slice(-3)
      .map((h: any) => h?.content || "")
      .join(" ");
    const candidateRows = searchGuides(catalog.rows, userMessage, recentHistoryText, 16);

    const candidatesPrompt =
      candidateRows.length > 0
        ? candidateRows
            .map(
              (r) =>
                `- SLUG: "${r.slug}" | TÍTULO: "${r.title}" | CATEGORÍA: ${r.category_name} | URL: ${getGuideUrl(r)} | RESUMEN: ${(r.excerpt || "").slice(0, 150)}`
            )
            .join("\n")
        : "No se encontraron guías exactas con esos términos en el índice.";

    const systemPrompt = `Eres el Asesor Experto en Equipaje de Mano, Maletas y Vuelos IA Oficial de Equipaje Ordenado (${SITE}), el portal creado por Charlie Lingán con más de 550 guías prácticas sobre medidas por aerolínea, normativas aeroportuarias (IATA, TSA, UE), qué artículos llevar en cabina, comparativas de maletas y consejos de viaje.

Tu misión es responder todas las inquietudes de los usuarios sobre maletas, medidas y peso de equipaje de mano, artículo personal bajo el asiento, líquidos de 100 ml, baterías/electrónicos, objetos prohibidos, seguros de equipaje, vuelos y destinos con precisión, claridad y tono cercano, guiándolos siempre hacia las URLs oficiales de nuestra web.

REGLAS OBLIGATORIAS DE ORIENTACIÓN:
1. DATOS EXACTOS DE AEROLÍNEAS Y NORMATIVAS:
   - Si el usuario pregunta por una aerolínea (Iberia, LATAM, Ryanair, Avianca, Vueling, Air Europa, Copa, JetSMART, Sky, Volaris, Viva Aerobus, Aeroméxico, American, United, Delta, KLM, Air France, Lufthansa, easyJet, Aerolíneas Argentinas), dale las medidas exactas en cm, el límite de peso en kg, las medidas del bolso personal bajo el asiento y aclara si su tarifa Basic incluye o no la maleta de cabina según la TABLA OFICIAL de abajo.
   - Si pregunta por líquidos en cabina: explica la regla de envases de máximo 100 ml (3.4 oz) dentro de 1 bolsa transparente resellable de 1 litro (20 x 20 cm), más las excepciones (medicamentos con receta, leche/comida para bebé).
   - Si pregunta por baterías externas (power banks), laptops o cigarrillos electrónicos: indica que las baterías de litio (hasta 100 Wh / ~27,000 mAh) van SIEMPRE en cabina y están prohibidas en bodega.
2. CUANDO TENEMOS GUÍAS EN EL LISTADO DE ABAJO QUE RESPONDEN O COMPLEMENTAN LA CONSULTA:
   - Enlaza de 1 a 3 guías dentro de tu texto en formato Markdown: [Título de la Guía](${SITE}/...).
   - Incluye los slugs exactos (máximo 3) en el arreglo "recommended_slugs" para que el chat muestre las tarjetas visuales con foto y botón directo.
3. NUNCA inventes URLs ni slugs que no estén en el listado de GUÍAS ENCONTRADAS o en las SECCIONES OFICIALES. Todos los enlaces deben pertenecer a ${SITE}/.
4. Si la consulta es sobre cómo empacar una maleta, evitar cargos extra o elegir entre maleta rígida, blanda o mochila de 40L, dale consejos prácticos accionables paso a paso y enlázale las guías correspondientes.
5. Contexto actual del visitante: está navegando en la página ${pageUrl}.
${config.custom_instructions ? "6. INSTRUCCIÓN ADICIONAL DEL ADMINISTRADOR: " + config.custom_instructions : ""}

${AIRLINES_SUMMARY}

${CATEGORIES_OVERVIEW}

GUÍAS ENCONTRADAS EN EQUIPAJEORDENADO.COM PARA ESTA CONSULTA (USA SOLO ESTOS SLUGS Y URLS EXACTAS):
${candidatesPrompt}

FORMATO DE RESPUESTA (JSON ESTRICTO):
Responde ÚNICAMENTE con un objeto JSON válido con estas 3 llaves exactas:
{
  "reply": "Tu respuesta experta, clara y bien estructurada en español (máximo 3 párrafos cortos o viñetas con datos exactos y enlaces Markdown [Título](${SITE}/...) hacia nuestras guías)",
  "recommended_slugs": ["slug-exacto-1", "slug-exacto-2"],
  "suggested_options": [
    "Pregunta corta de seguimiento 1",
    "Pregunta corta de seguimiento 2",
    "Pregunta corta de seguimiento 3"
  ]
}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
        chatMessages.push({ role: h.role, content: h.content.slice(0, 1200) });
      }
    }
    chatMessages.push({ role: "user", content: userMessage });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages: chatMessages,
        temperature: Number(config.temperature) || 0.4,
        max_tokens: 850,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      throw new Error("OpenAI status " + openaiRes.status);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent,
        recommended_slugs: candidateRows.slice(0, 2).map((r) => r.slug),
        suggested_options: [
          "Medidas por aerolínea",
          "Regla de líquidos 100 ml",
          "¿Puedo llevar mochila y maleta?",
        ],
      };
    }

    const slugs: string[] = Array.isArray(parsed.recommended_slugs)
      ? parsed.recommended_slugs.slice(0, 3)
      : [];
    const recommendedGuides: GuideCard[] = slugs
      .map((s) => catalog.bySlug.get(s))
      .filter((r): r is GuideRow => Boolean(r))
      .map(toGuideCard);

    if (recommendedGuides.length === 0 && candidateRows.length > 0) {
      recommendedGuides.push(...candidateRows.slice(0, 2).map(toGuideCard));
    }

    const suggestedOptions: string[] = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options.slice(0, 3).map((s: unknown) => String(s).slice(0, 70))
      : [];

    const replyText: string =
      parsed.reply ||
      `Puedes consultar las medidas exactas y reglas de equipaje en [Medidas por Aerolínea](${SITE}/medidas-equipaje-de-mano/).`;

    const promptTokens = openaiData.usage?.prompt_tokens || 0;
    const completionTokens = openaiData.usage?.completion_tokens || 0;
    const totalTokens = openaiData.usage?.total_tokens || promptTokens + completionTokens;
    const costUsd = calculateCostUsd(activeModel, promptTokens, completionTokens);

    if (sessionId && existingSession) {
      await supabase.from("equipajeordenado_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: replyText,
        recommended_guides: recommendedGuides,
        suggested_options: suggestedOptions,
        model: activeModel,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const prevRecs: string[] = Array.isArray(existingSession.recommended_guides)
        ? existingSession.recommended_guides
        : [];
      for (const rg of recommendedGuides) {
        if (!prevRecs.includes(rg.title)) prevRecs.push(rg.title);
      }

      await supabase
        .from("equipajeordenado_chat_sessions")
        .update({
          last_user_message: userMessage.slice(0, 250),
          messages_count: (existingSession.messages_count || 1) + 2,
          recommended_guides: prevRecs.slice(0, 30),
          prompt_tokens: (existingSession.prompt_tokens || 0) + promptTokens,
          completion_tokens: (existingSession.completion_tokens || 0) + completionTokens,
          total_tokens: (existingSession.total_tokens || 0) + totalTokens,
          estimated_cost_usd: Number(
            (Number(existingSession.estimated_cost_usd || 0) + costUsd).toFixed(6)
          ),
          model_used: activeModel,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    await supabase.from("token_usage").insert({
      source: "equipajeordenado.com",
      content_type: "ai_chat",
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
      slug: sessionId || visitorId,
    });

    return json({
      session_id: sessionId,
      reply: replyText,
      recommended_guides: recommendedGuides,
      suggested_options: suggestedOptions,
      model: activeModel,
    });
  } catch (err: any) {
    console.error("equipajeordenado-chat error:", err);
    return json(
      {
        error: err.message || "Error interno",
        reply: `Tuvimos un inconveniente momentáneo al procesar tu consulta. Puedes revisar todas las medidas en [Medidas de Equipaje por Aerolínea](${SITE}/medidas-equipaje-de-mano/).`,
        recommended_guides: [],
        suggested_options: ["Intentar de nuevo"],
      },
      500
    );
  }
});
