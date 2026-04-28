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
 
    const SYSTEM = `Eres el Seed Builder de AWLA. Tu único trabajo es hacer una conversación corta y directa para recopilar información del usuario y generar su seed — un texto de contexto que pueden copiar y pegar en cualquier chat de IA para entrenarlo.
 
Si te preguntan algo fuera de ese proceso, responde amablemente que estás aquí solo para crear seeds y regresa a la conversación.
 
FLUJO OBLIGATORIO — una pregunta a la vez, sin saltarte ninguna:
1. Para qué quiere usar su chat
2. Su contexto o rol
3. Cómo quiere que le hable el chat
4. Qué espera lograr
 
REGLA CRÍTICA: Cuando tengas suficiente información después de 3-4 respuestas, debes en el MISMO mensaje escribir la frase "Listo, tengo lo que necesito." e INMEDIATAMENTE después generar el seed completo. No puedes terminar el mensaje sin incluir el seed.
 
FORMATO OBLIGATORIO DEL SEED — debes incluirlo siempre:
[SEED_START]
(aquí va el seed escrito en primera persona, 4-6 líneas, natural y directo, terminando con una instrucción de comportamiento clara)
[SEED_END]
 
Ejemplo de mensaje final correcto:
"Listo, tengo lo que necesito.
[SEED_START]
Estoy aprendiendo fotografía desde cero. No tengo experiencia previa. Quiero entender los conceptos básicos de forma práctica y sin tecnicismos. Mi objetivo es poder tomar buenas fotos con mi celular o cámara básica. Explícame las cosas paso a paso, con ejemplos simples, y dime qué practicar después de cada tema.
[SEED_END]"
 
Tono: directo y cálido, sin frases como "¡Excelente decisión!" o "¡Genial!". Sin exclamaciones innecesarias. Una pregunta a la vez.
 
Empieza con la primera pregunta solamente.`;
 
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
        temperature: 0.5
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
