import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, env }) => {
  try {
    const formData = await request.formData();
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const servicio = formData.get('servicio');
    const mensaje = formData.get('mensaje');

    console.log({ nombre, email, servicio, mensaje });

    return new Response(JSON.stringify({ status: 'ok', message: 'Mensaje recibido correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: 'Error al procesar la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
