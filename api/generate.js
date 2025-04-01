import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { prompt, imageMode, imageURL } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    let completion;

    if (imageMode && imageURL) {
      // Vision model
      completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageURL,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });
    } else {
      // Text-only mode (use gpt-3.5-turbo for now)
      completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
    }
    
    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({ error: "OpenAI call failed" });
  }
}
