/**
 * Proxy naar de Camy-agent.
 *
 * De sleutel staat in een server-side env var en wordt hier op de request gezet — de browser
 * krijgt hem nooit te zien. Daarom loopt alles via deze route en niet rechtstreeks vanuit de
 * component.
 *
 * De ROL is hier bewust géén doorgeefluik in productie: `role` uit de body werkt alleen zolang
 * CAMY_TEST_MODE aan staat op de agent. Zet die uit en een browser die role:"employee" meestuurt
 * krijgt gewoon 'anonymous' terug. De employee-sleutel wordt alleen meegestuurd als hij
 * server-side geconfigureerd is (back office), nooit op basis van iets uit de browser.
 */

const AGENT_URL = process.env.CAMY_ASK_URL ?? 'https://marketintelligencedata.nl/camy/ask';

type AskBody = {
  scope: string;
  role?: string;
  context?: Record<string, unknown>;
  messages?: Array<{ role: string; text: string }>;
  employee?: boolean;
};

export async function POST(request: Request) {
  const key = process.env.CAMY_ASK_KEY;
  if (!key) {
    return Response.json({ error: 'CAMY_ASK_KEY ontbreekt in de omgeving' }, { status: 503 });
  }

  let body: AskBody;
  try {
    body = (await request.json()) as AskBody;
  } catch {
    return Response.json({ error: 'ongeldige body' }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-12); // dek de kosten van een uitgelopen gesprek af
  if (messages.length === 0) {
    return Response.json({ error: 'geen bericht' }, { status: 400 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Camy-Key': key,
  };
  // Alleen in de testopstelling: laat de pagina de medewerkersrol kiezen. In productie hangt dit
  // aan een ingelogde sessie, niet aan een vinkje.
  if (body.employee && process.env.CAMY_EMPLOYEE_KEY && process.env.CAMY_TEST_UI === '1') {
    headers['X-Camy-Employee-Key'] = process.env.CAMY_EMPLOYEE_KEY;
  }

  try {
    const upstream = await fetch(AGENT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        scope: body.scope,
        role: body.role,
        context: body.context ?? {},
        messages,
      }),
      signal: AbortSignal.timeout(90_000),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'onbekende fout';
    return Response.json({ error: `agent niet bereikbaar: ${reason}` }, { status: 502 });
  }
}
