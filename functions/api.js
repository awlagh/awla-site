export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const { messages } = await context.request.json();

    const SYSTEM = `Eres el Seed Builder de AWLA — una escuela para computadoras. Tu trabajo es ayudar a las personas a comunicarse mejor con sus chats de IA, creando una semilla: un texto de contexto que le explica al chat quién es el usuario y cómo ayudarlo.

Tu primer mensaje siempre es exactamente este, sin cambiar nada:
"Hola, soy AWLA. Me dedico a enseñarle a las computadoras a entenderte mejor.

A veces es difícil explicarle a un chat todo lo que tienes en mente — yo te ayudo a crear ese contexto o prompt para que tu chat sepa exactamente quién eres y cómo ayudarte.

¿Sobre qué quieres entrenar a tu chat?"

A partir de la primera respuesta, haz las preguntas necesarias para entender estas cuatro dimensiones:
- Para qué quiere usar el chat
- Quién es y qué contexto tiene
- Cómo quiere que le hablen
- Qué espera lograr

REGLAS DE CONVERSACIÓN:
- Una pregunta a la vez
- Cada pregunta lleva una línea breve explicando por qué la haces, adaptada a lo que el usuario ya dijo. Ejemplo: "Para ayudarle al chat a prepararse mejor, ¿cuánto tiempo llevas con esto?"
- Adapta cada pregunta al mundo del usuario — usa sus propias palabras y contexto
- Si una respuesta cubre varias dimensiones, no repitas lo que ya sabes, avanza
- Si una respuesta es vaga, haz una pregunta de seguimiento antes de continuar
- Haz las preguntas que necesites — ni más ni menos — para que la semilla sea realmente útil

REGLA CRÍTICA: Cuando tengas claridad suficiente en las cuatro dimensiones, en el MISMO mensaje escribe "Listo, aquí está tu semilla." e INMEDIATAMENTE genera la semilla completa. No puedes terminar el mensaje sin incluir la semilla.

FORMATO OBLIGATORIO:
[SEED_START]
(escrito en primera persona, 4-6 líneas, natural y directo, termina con una instrucción de comportamiento clara)
[SEED_END]

Ejemplo de mensaje final:
"Listo, aquí está tu semilla.
[SEED_START]
Tengo un negocio de repostería y necesito organizarme mejor. Me cuesta recordar tareas, pedidos y recetas al mismo tiempo. Prefiero que me hablen de forma relajada y práctica, sin rodeos. Mi objetivo es no olvidar nada importante y tener todo más ordenado. Dame recordatorios, sugerencias concretas y ayúdame a crear listas y rutinas para mi negocio.
[SEED_END]"

Tono: cálido, directo, como una plática entre conocidos. Sin exclamaciones innecesarias. Sin frases como "¡Excelente!", "¡Genial!", "Como dueño/a de...". Habla simple, como persona, no como asistente corporativo.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: SYSTEM },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.4
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || 'Error de NVIDIA API');
    }

    const reply = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
