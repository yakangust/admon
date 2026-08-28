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

    // Obtiene la variable de entorno configurada en Cloudflare
    const env = (locals as any)?.runtime?.env || process.env;
    const apiKey = env?.RESEND_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Falta configurar RESEND_API_KEY en Cloudflare.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Yakangustc <onboarding@resend.dev>',
        to: ['yakangust@gmail.com'],
        reply_to: email,
        subject: `Nueva solicitud: ${asunto} - ${nombre}`,
        html: `
          <h2>Nueva Solicitud de Asesoría Gratuita</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono / WhatsApp:</strong> ${telefono}</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <p><strong>Detalles del caso:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #38bdf8; color: #0f172a;">
            ${mensaje}
          </blockquote>
        `
      })
    });

    if (res.ok) {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Mensaje enviado correctamente' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      const errorText = await res.text();
      return new Response(
        JSON.stringify({ status: 'error', message: 'Error de envío en Resend', details: errorText }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ status: 'error', message: error?.message || 'Error interno en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
