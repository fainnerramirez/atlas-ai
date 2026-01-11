import { Agent, run, setDefaultOpenAIKey } from '@openai/agents';
import { NextResponse } from 'next/server';

const apikey = process.env.NEXT_PUBLIC_API_KEY_OPENAI;

if (!apikey) {
    throw new Error('API Key no proporcionada');
}

const agent = new Agent({
    name: 'Atlas Assistant',
    instructions: 'You are a helpful assistant',
    model: "gpt-4.1-nano-2025-04-14", // Utilizando el modelo especificado
});

setDefaultOpenAIKey(apikey);

export async function POST(req: Request) {

    try {

        const { question } = await req.json();

        if (!question) {
            return NextResponse.json({ message: 'Pregunta no proporcionada' }, { status: 400 });
        }
        const response = await run(agent, question);
        return NextResponse.json({ response: response.finalOutput });

    } catch (error) {

        console.error('Error en la consulta a OpenAI:', error);
        return NextResponse.json({ message: 'Error en la consulta a OpenAI', error: (error as Error).message }, { status: 500 });
    }
}
