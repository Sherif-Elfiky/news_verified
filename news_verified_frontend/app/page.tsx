"use client";
import { useState } from "react";
import { useSession } from 'next-auth/react';
import axios from "axios";
import AuthButton from './components/AuthButton';

export default function Home() {
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    setClassification(null);
    setScores(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/verify", { url });
      const summaryText = res.data.summary;
      setSummary(summaryText);

      const classifyRes = await axios.post("http://127.0.0.1:8000/classify", {
        content: summaryText
      });
      setClassification(classifyRes.data.label);
      setScores(classifyRes.data.scores);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div style={{ minHeight: '100vh', padding: '20px' }}>
        <div className="container">
          <h1 className="header">News Verified</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        
        {/* Header */}
        <h1 className="header">News Verified</h1>

        {/* Authentication */}
        <AuthButton />

        {/* Only show app content if user is signed in */}
        {session ? (
          <>
            {/* Input Section */}
            <div className="input-section">
              <label className="label">News Article URL:</label>
              <input
                type="text"
                placeholder="Paste news article URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input"
                disabled={loading}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleVerify}
              disabled={!url.trim() || loading}
              className="button"
            >
              {loading ? "Processing..." : "Verify & Analyze News"}
            </button>
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>
              Sign in to use News Verified
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Please sign in with your Google account to analyze news articles for bias and get AI-powered summaries.
            </p>
          </div>
        )}

        {/* Error Message */}
        {session && error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Summary */}
        {session && summary && (
          <div className="result-card">
            <h2 className="result-title">AI Summary</h2>
            <p className="result-text">
              {summary}
            </p>
          </div>
        )}

        {/* Classification */}
        {session && classification && scores && (
          <div className="result-card">
            <h2 className="result-title">Bias Analysis</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#555' }}>Primary Classification: </strong>
              <span className={`classification-badge ${classification}`}>
                {classification.charAt(0).toUpperCase() + classification.slice(1)}
              </span>
            </div>

            <div>
              <strong style={{ color: '#555' }}>Confidence Scores:</strong>
              <ul className="scores-list">
                {Object.entries(scores).map(([label, score]) => (
                  <li key={label}>
                    <strong>{label}:</strong> {(score * 100).toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}