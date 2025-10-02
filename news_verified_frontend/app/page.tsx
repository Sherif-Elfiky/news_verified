"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    setClassification(null);
    setScores(null);
    setImageGenerated(false);

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

  const handleGenerateImage = async () => {
    if (!summary) return;

    setImageLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/pic", {
        content: summary
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setImageGenerated(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Image generation failed.");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        
        {/* Header */}
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333', 
          marginBottom: '30px',
          fontSize: '32px'
        }}>
          News Verified
        </h1>

        {/* Input Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            News Article URL:
          </label>
          <input
            type="text"
            placeholder="Paste news article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            disabled={loading}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleVerify}
          disabled={!url.trim() || loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? "Processing..." : "Verify & Analyze News"}
        </button>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h2 style={{ 
              color: '#333', 
              marginBottom: '15px',
              fontSize: '20px'
            }}>
              AI Summary
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px'
            }}>
              {summary}
            </p>
            
            <button
              onClick={handleGenerateImage}
              disabled={imageLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: imageLoading ? '#ccc' : '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: imageLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {imageLoading ? "Generating Image..." : "Generate Image"}
            </button>
            
            {imageGenerated && (
              <div style={{ marginTop: '15px' }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Generated Image:
                </h3>
                <img
                  src="http://127.0.0.1:8000/image"
                  alt="Generated from summary"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none'}} className="text-center py-8">
                  <p style={{ color: '#dc3545' }}>Image not available</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Classification */}
        {classification && scores && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <h2 style={{ 
              color: '#333', 
              marginBottom: '15px',
              fontSize: '20px'
            }}>
              Bias Analysis
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#555' }}>Primary Classification: </strong>
              <span style={{
                backgroundColor: classification === 'neutral' ? '#d4edda' : 
                                classification === 'biased' ? '#fff3cd' : '#f8d7da',
                color: classification === 'neutral' ? '#155724' : 
                       classification === 'biased' ? '#856404' : '#721c24',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {classification.charAt(0).toUpperCase() + classification.slice(1)}
              </span>
            </div>

            <div>
              <strong style={{ color: '#555' }}>Confidence Scores:</strong>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                {Object.entries(scores).map(([label, score]) => (
                  <li key={label} style={{ 
                    marginBottom: '5px',
                    color: '#555'
                  }}>
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