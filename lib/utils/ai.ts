const API_URL = "https://api.groq.com/openai/v1/chat/completions";

type SummarizeResponse = {
  summary: string;
  error?: string;
};

export async function summarizeText(
  text: string,
  apiKey: string
): Promise<SummarizeResponse> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: [
          {
            role: "system",
            content: `You are a summarization engine.
            - Summarize **factual and descriptive content** from the input.
            - If the input contains **time-based events**, meetings, or reminders, include them as concise bullet points.
            - Ignore greetings, questions, or conversational elements.
            - If there’s no **substantial content** to summarize, respond with:
              "⚠️ No significant content to summarize."
            - Your output should have **3–5 bullet points** maximum.
            - Each bullet point should be **short and concise** (max 2 lines). Avoid unnecessary elaboration or filler.
            - Do not answer questions or engage in conversation, focus only on summarizing the content.`
          },
          {
            role: "user",
            content: `Summarize the following content based solely on factual or descriptive information. If the input does not provide such content, return a warning:\n\n${text}`,
          },
        ],

        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { summary: data.choices[0].message.content };
  } catch (error) {
    console.error("Error summarizing text:", error);
    return {
      summary: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
