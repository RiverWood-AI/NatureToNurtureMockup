// POST /api/contact: verify Turnstile, then email the enquiry to Samantha through Resend.
// Secrets (wrangler pages secret put): RESEND_API_KEY, TURNSTILE_SECRET.
// Vars: CONTACT_TO (her inbox), CONTACT_FROM (an address on a domain verified in Resend).

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad request' }, 400); }

  // Honeypot: bots fill every field. Pretend it worked.
  if (clean(body.website, 200)) return json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'missing fields' }, 400);

  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: clean(body['cf-turnstile-response'], 2048),
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  }).then((r) => r.json()).catch(() => ({ success: false }));
  if (!verify.success) return json({ error: 'spam check failed' }, 403);

  const details = [`Name: ${name}`, `Email: ${email}`, ...(phone ? [`Phone: ${phone}`] : [])].join('\n');
  const text = `New enquiry from the website\n\n${details}\n\n${message}`;
  const html = `<p>New enquiry from the website</p>
<p><strong>Name:</strong> ${escape(name)}<br><strong>Email:</strong> ${escape(email)}${phone ? `<br><strong>Phone:</strong> ${escape(phone)}` : ''}</p>
<p>${escape(message).replace(/\n/g, '<br>')}</p>`;

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text,
      html,
    }),
  });
  if (!sent.ok) {
    console.log('resend error', sent.status, await sent.text());
    return json({ error: 'send failed' }, 502);
  }
  return json({ ok: true });
}
