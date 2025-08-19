import { useState } from "react";
import useSWR from "swr";

// fetcher helper function
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
    const error = new Error("Failed to fetch");
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const GeminiApiComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [submittedInput, setSubmittedInput] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const { data, error, isLoading } = useSWR(
    submittedInput
      ? [
          API_URL,
          API_KEY,
          {
            contents: [{ parts: [{ text: submittedInput }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: { response: { type: "STRING" } },
              },
            },
          },
        ]
      : null,
    ([url, key, body]) => fetcher(url, key, body)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      setSubmittedInput(userInput);
    }
  };

  return (
    <div>
      <h1>Chat with Gemini API</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your message..."
        />
        <button type="submit" disabled={!userInput.trim() || isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <strong>Response:</strong>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GeminiApiComponent;
