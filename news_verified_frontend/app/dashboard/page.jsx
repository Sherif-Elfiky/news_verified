"use client";
import { useArticleHistory } from '../../hooks/useArticleHistory';
import Link from 'next/link';

export default function Dashboard() {
  const { articles } = useArticleHistory();

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1>Article History Dashboard</h1>
        
        <Link href="/" style={{ 
          display: 'inline-block', 
          marginBottom: '20px',
          color: '#007bff',
          textDecoration: 'none'
        }}>
          ← Back to Home
        </Link>

        {articles.length === 0 ? (
          <p>No articles saved yet. Go analyze some articles!</p>
        ) : (
          <div>
            <p>You have {articles.length} saved articles:</p>
            {articles.map((article) => (
              <div key={article.id} style={{
                border: '1px solid #ddd',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '5px'
              }}>
                <h3>{article.url}</h3>
                <p><strong>Classification:</strong> {article.classification}</p>
                <p><strong>Summary:</strong> {article.summary}</p>
                <p><strong>Date:</strong> {new Date(article.timestamp).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}