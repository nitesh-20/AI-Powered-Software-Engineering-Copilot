import axios from "axios";

const extractTextFromGeminiResponse = (responseData) =>
  responseData?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

const buildPrompt = (repositoryMetadata) => `
You are analyzing a GitHub repository from its metadata only.

Return valid JSON with exactly these keys:
- projectSummary
- technologyStack
- architectureExplanation

Requirements:
- projectSummary: a concise 2-4 sentence summary
- technologyStack: an array of strings
- architectureExplanation: a concise explanation of likely architecture based only on the metadata
- If something is uncertain, say "Likely" instead of inventing certainty

Repository metadata:
${JSON.stringify(repositoryMetadata, null, 2)}
`;

export const analyzeRepository = async (repositoryMetadata) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [
            {
              text: buildPrompt(repositoryMetadata)
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      }
    }
  );

  const text = extractTextFromGeminiResponse(response.data);

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed = JSON.parse(text);

  return {
    projectSummary: parsed.projectSummary || "",
    technologyStack: Array.isArray(parsed.technologyStack)
      ? parsed.technologyStack
      : [],
    architectureExplanation: parsed.architectureExplanation || ""
  };
};
