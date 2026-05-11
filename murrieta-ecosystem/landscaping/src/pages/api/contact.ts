export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const SITE_NAME = 'Murrieta Landscaping';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request.' }), { status: 400, headers });
  }

  const { name, phone, email, service, message } = body;
  if (!name || !phone || !email || !service) {
    return new Response(JSON.stringify({ ok: false, error: 'Please fill in all required fields.' }), { status: 422, headers });
  }

  const leadEmail = import.meta.env.LEAD_EMAIL;
  const ownerEmail = import.meta.env.OWNER_EMAIL;
  const apiKey = import.meta.env.RESEND_API_KEY;

  if (!apiKey || !leadEmail) {
    return new Response(JSON.stringify({ ok: false, error: 'Server configuration error.' }), { status: 500, headers });
  }

  const resend = new Resend(apiKey);

  const bcc = ownerEmail && ownerEmail !== leadEmail ? [ownerEmail] : undefined;

  const { error } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: [leadEmail],
    bcc,
    subject: `New Lead – ${service} – ${SITE_NAME}`,
    html: `
      <h2>New Lead from ${SITE_NAME}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Name</td><td style="padding:8px">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Phone</td><td style="padding:8px">${phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Email</td><td style="padding:8px">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Service</td><td style="padding:8px">${service}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Message</td><td style="padding:8px">${message || '—'}</td></tr>
      </table>
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: 'Failed to send. Please try again.' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
};
