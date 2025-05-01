import DeepseekService from '@/core/services/deepseek';

export async function POST(req) {
  try {
    const { prompt } = await req.json(); // Obtén el prompt del cuerpo de la solicitud
    const challenge = await DeepseekService.generateCodeChallenge(prompt);

    return new Response(JSON.stringify({ challenge }), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/create:", error);
    return new Response(JSON.stringify({ error: "Failed to generate code challenge" }), { status: 500 });
  }
}