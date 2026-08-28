import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const nombre = formData.get('nombre')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const telefono = formData.get('telefono')?.toString() || '';
    const asunto = formData.get('asunto')?.toString() || '';
    const mensaje = formData.get('mensaje')?.toString() || '';

    // Leer variables desde Cloudflare
    const env = (locals as any)?.runtime?.env || process.env;
    const apiKey = env?.RESEND_API_KEY || 're_ho5brDjb_5nrJknqjbxue4V6LYzxycxJJ';
    const toEmail = env?.DESTINATION_EMAIL || 'yakangust@gmail.com';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Yakangustc <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: email,
        subject: `Nueva solicitud: ${asunto} - ${nombre}`,
        html: `
          <h2>Nueva Solicitud de Asesoría Gratuita</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Correo del interesado:</strong> ${email}</p>
          <p><strong>Teléfono / WhatsApp:</strong> ${telefono}</p>
          <p><strong>Tipo de trámite:</strong> ${asunto}</p>
          <p><strong>Detalles del caso:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #38bdf8; color: #0f172a;">
            ${mensaje}
          </blockquote>
        `
      })
    });

    if (res.ok) {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Correo enviado con éxito' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      const errorText = await res.text();
      console.error('Error Resend API:', errorText);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Error en Resend', details: errorText }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ status: 'error', message: error?.message || 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
