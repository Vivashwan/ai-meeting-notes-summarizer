export async function POST(req) {
    const { transcript, prompt } = await req.json();

    if (!process.env.GROQ_API_KEY) {
        return new Response(
            JSON.stringify({ error: "Missing GROQ_API_KEY in environment." }),
            { status: 500 }
        );
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a meeting summarizer." },
                    { role: "user", content: `${prompt}\n\nTranscript:\n${transcript}` },
                ],
            }),
        });

        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content || "No summary generated.";

        return new Response(JSON.stringify({ summary }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
