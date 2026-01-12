import { INSTRUCTIONS_AGENT } from '@/app/contants/constants';
import { getCoordinateTool } from '@/app/lib/tools';
import { Agent, AgentInputItem, run, setDefaultOpenAIKey } from '@openai/agents';
import { NextResponse } from 'next/server';

const apikey = process.env.NEXT_PUBLIC_API_KEY_OPENAI;

if (!apikey) {
    throw new Error('API Key no proporcionada');
}

let thread: AgentInputItem[] = [];

const agent = new Agent({
    name: 'Atlas Assistant',
    instructions: INSTRUCTIONS_AGENT,
    model: "gpt-4.1-nano-2025-04-14",
    tools: [getCoordinateTool]
});

setDefaultOpenAIKey(apikey);

export async function POST(req: Request) {

    try {

        const { question } = await req.json();

        if (!question) {
            return NextResponse.json({ message: 'Pregunta no proporcionada' }, { status: 400 });
        }

        const response = await run(agent, thread.concat({ role: "user", content: question }));
        thread = response.history;
        const finalOutput = response.finalOutput;

        const itemsCall = response.newItems ?? [];
        console.log("itemsCall: ", itemsCall);
        const toolCalls = itemsCall.filter(e => e.type === "tool_call_output_item").map(e => e.rawItem);

        const toolOutputs = toolCalls.map((call: any) => {
            try {
                const output = JSON.parse(call.output.text);
                return {
                    name: call.name,
                    ...output
                };
            } catch {
                return null;
            }
        }).filter(Boolean);

        return NextResponse.json({ text: finalOutput, places: toolOutputs, itemsCall });

    } catch (error) {

        console.error('Error en la consulta a OpenAI:', error);
        return NextResponse.json({ message: 'Error en la consulta a OpenAI', error: (error as Error).message }, { status: 500 });
    }
}