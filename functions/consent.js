/**
 * AWLA · Registro centralizado de consentimientos
 * Ruta: /functions/api/consent.js  →  endpoint: https://www.awla.live/api/consent
 *
 * Recibe un POST con el consentimiento del usuario, captura la IP real
 * (vía Cloudflare) y lo guarda en la base de datos D1 vinculada como "DB".
 *
 * Cumple el estándar que pidió la asesoría legal: registro centralizado,
 * verificable y auditable con email (si existe), fecha, versión, medio e IP.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // IP real del usuario: el navegador no la conoce, pero Cloudflare la inyecta.
    const ip = request.headers.get('CF-Connecting-IP') || 'desconocida';
    const userAgent = request.headers.get('User-Agent') || '';
    const timestamp = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO consentimientos (email, timestamp, version, medio, tipo, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.email || null,
      timestamp,
      data.version || '1.0',
      data.medio || 'web',
      data.tipo || null,
      ip,
      userAgent
    ).run();

    return new Response(JSON.stringify({ ok: true, timestamp }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    // Nunca bloqueamos al usuario por un fallo de registro; solo respondemos el error.
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Rechaza métodos que no sean POST (evita ruido en el endpoint).
export async function onRequestGet() {
  return new Response('Method Not Allowed', { status: 405 });
}
