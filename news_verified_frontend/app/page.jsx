"use client";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import axios from "axios";
import AuthButton from './components/AuthButton.jsx';
import { useArticleHistory } from '../hooks/useArticleHistory';
import Link from 'next/link';



export default function Home() {
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState(null);
  const [classification, setClassification] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sample, setSample] = useState(null);
  const { articles, saveArticle } = useArticleHistory();

  const samples = ["https://www.theguardian.com/environment/2025/oct/04/pfas-pollution-data-centers-ai?utm_source=chatgpt.com",
    "https://www.techradar.com/pro/your-workplace-tech-may-be-affecting-your-health-and-not-in-a-good-way?utm_source=chatgpt.com",
    "https://www.discoverboating.com/resources/dry-bags-boating",
    "https://www.cnn.com/world/live-news/israel-hamas-gaza-war-10-08-25"
  ]

  const handleRandArticle = () => {
    let current_sample = samples[Math.floor(Math.random() * samples.length)]
    setSample(current_sample)
  };

  useEffect(() => {
    handleRandArticle();
  }, []);






  const handleVerify = async (urlToVerify = null) => {
    const urlToUse = urlToVerify || url;
    setLoading(true);
    setError(null);
    setSummary(null);
    setClassification(null);
    setScores(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/verify", { url: urlToUse });
      const summaryText = res.data.summary;
      setSummary(summaryText);

      const classifyRes = await axios.post("http://127.0.0.1:8000/classify", {
        content: summaryText
      });
      setClassification(classifyRes.data.label);
      setScores(classifyRes.data.scores);

      saveArticle({
        url: urlToUse,
        summary: summaryText,
        classification: classifyRes.data.label,
        scores: classifyRes.data.scores
      });
    } catch (err) {
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
        <Link href="/dashboard" style={{
          display: 'inline-block',
          marginBottom: '20px',
          color: '#007bff',
          textDecoration: 'none'
        }}>
          View Saved Articles →
        </Link>

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
              onClick={() => handleVerify(url)}
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

      {/* Quick Test Section */}
      {session && sample && (
        <div className="quick-test-section" style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>Quick Test</h3>
          <button
            onClick={() => {
              const newSample = samples[Math.floor(Math.random() * samples.length)];
              setUrl(newSample);
              handleVerify(newSample);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test with random article
          </button>
        </div>
      )}
    </div>
  );
}
