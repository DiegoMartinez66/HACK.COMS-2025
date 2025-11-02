import mammoth from "mammoth";

export async function generateQuizFromFile(file, apiKey) {
  if (!file) throw new Error("No file uploaded.");

  let fileText = "";

  // 🧠 Detect file type
  if (file.name.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    fileText = value;
  } else {
    // fallback for txt/pdf/etc
    fileText = await file.text();
  }

  if (!fileText || fileText.trim().length < 20) {
    throw new Error("The uploaded file appears empty or unreadable.");
  }

  // 💬 Updated prompt — force JSON-only output
  const prompt = `
  You are a quiz flashcard generator. Read the following text and create
  a JSON array of 5–10 question-answer pairs suitable for a quiz game.

  ⚠️ Important formatting rules:
  - Return ONLY raw JSON (no code fences, no markdown, no text before or after)
  - Use this structure exactly:
  [
    { "question": "Question text", "answer": "Answer text" },
    ...
  ]

  Here is the file content you will use:
  ${fileText}
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a helpful AI that generates educational flashcards." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!data?.choices?.[0]?.message?.content) {
    console.error("Invalid OpenRouter response:", data);
    throw new Error("No output from Gemini.");
  }

  try {
    const text = data.choices[0].message.content.trim();
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    console.error("Failed to parse Gemini output:", e);
    console.log("Raw response:", data.choices[0].message.content);
    throw new Error("Gemini output was not valid JSON. Check console for raw text.");
  }
}
