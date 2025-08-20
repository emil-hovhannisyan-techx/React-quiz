import { useLocation } from "react-router-dom";
import useSWR from "swr";

const fetcher = async (url, apiKey, body) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }
  return res.json();
};

const ResultPage = () => {
  const location = useLocation();
  const quizRequest = location.state?.quizRequest;

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const { data, error, isLoading } = useSWR(
    quizRequest
      ? [
          API_URL,
          API_KEY,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are a professional quiz generator. 
                          Generate a quiz with the following parameters:

                          Topic: ${quizRequest.topic}
                          Language: ${quizRequest.language}
                          Number of Questions: ${quizRequest.count}
                          Difficulty: ${quizRequest.difficulty}
                          Special Requirements: ${
                            quizRequest.requirements || "None"
                          }

                          The output MUST strictly follow this JSON schema:

                          {
                            "quiz": {
                              "topic": "string",
                              "language": "string",
                              "difficulty": "string",
                              "questions": [
                                {
                                  "question": "string",
                                  "options": ["string", "string", "string", "string"],
                                  "correctAnswer": "string",
                                  "explanation": "string"
                                }
                              ]
                            }
                          }
                          Return ONLY valid JSON. Do not include explanations outside of JSON.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  quiz: {
                    type: "object",
                    properties: {
                      topic: { type: "string" },
                      language: { type: "string" },
                      difficulty: { type: "string" },
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            options: {
                              type: "array",
                              items: { type: "string" },
                            },
                            correctAnswer: { type: "string" },
                            explanation: { type: "string" },
                          },
                          required: ["question", "options", "correctAnswer"],
                        },
                      },
                    },
                    required: ["topic", "language", "difficulty", "questions"],
                  },
                },
              },
            },
          },
        ]
      : null,
    ([url, key, body]) => fetcher(url, key, body)
  );

  return (
    <div>
      <h1>Generated Quiz JSON</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {data && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f0f0f0",
            padding: "1rem",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ResultPage;
