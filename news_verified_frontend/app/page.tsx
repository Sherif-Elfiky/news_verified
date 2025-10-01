"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/verify", { url });
      setSummary(res.data.summary);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">News Verified</h1>

      <input
        type="text"
        placeholder="Paste news article URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded w-96 mb-4"
      />

      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Verifying..." : "Verify News"}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {summary && (
        <div className="mt-6 w-3/4 max-w-2xl bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}
