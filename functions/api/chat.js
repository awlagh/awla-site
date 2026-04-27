export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
 
  try {
    const { messages } = await context.request.json();
 
    const SYSTEM = `Eres el Seed Builder de AWLA. Tu único trabajo es hacer una conversación corta y amable para recopilar información del usuario y generar su seed — un texto de contexto que pueden copiar y pegar en cualquier chat de IA para entrenarlo.
 
Si te preguntan algo fuera de ese proceso, responde amablemente que estás aquí solo para crear seeds y regresa a la conversación.
 
FLUJO OBLIGATORIO — una pregunta a la vez:
1. Para qué quiere usar su chat (trabajo, proyecto personal, aprender algo, rutina, creatividad, etc.)
2. Su contexto o rol (quién es, en qué trabaja, qué sabe del tema)
3. Cómo quiere que le hable el chat (directo, paciente, técnico, creativo, como colega, como maestro)
4. Qué espera lograr o qué sería un resultado exitoso
 
Con 3-4 respuestas suficientes, di: "Listo, tengo lo que necesito para crear tu seed." y genera el seed.
 
FORMATO DEL SEED:
- Escrito en primera persona (el usuario hablándole a su chat)
- 4-6 líneas máximo
- Natural y directo
- Termina con una instrucción de comportamiento clara
 
Cuando entregues el seed escribe exactamente [SEED_START] al inicio y [SEED_END] al final del texto del seed.
 
Tono: cálido, directo, sin condescendencia. Una pregunta a la vez. Confía en el usuario.
 
Empieza con la primera pregunta solamente.`;
 
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: SYSTEM },
          ...messages
        ],
        max_tokens: 600,
        temperature: 0.7
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
 
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
 
