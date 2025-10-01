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
    <main className="flex flex-col items-center p-24 max-w-6xl mx-auto">
      <h1 className="text-6xl font-bold mb-24 text-blue-700">News Verified</h1>

      <div className="w-full space-y-16">
        <input
          type="text"
          placeholder="Paste news article URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-16 py-8 text-2xl focus:ring-4 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />

        <button
          onClick={handleVerify}
          disabled={!url.trim() || loading}
          className="w-full bg-blue-600 text-white px-16 py-8 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-2xl font-bold"
        >
          {loading ? "Verifying..." : "Verify News"}
        </button>
      </div>

      {error && (
        <div className="w-full mt-16 p-12 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      )}

      {summary && (
        <div className="w-full mt-24 bg-white p-16 rounded-xl shadow-lg border">
          <h2 className="font-bold mb-8 text-gray-800 text-3xl">Summary:</h2>
          <p className="text-gray-700 leading-relaxed text-2xl">{summary}</p>
        </div>
      )}
    </main>
  );
}
