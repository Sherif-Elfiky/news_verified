// useArticleHistory.js
import { useState, useEffect } from 'react';

export const useArticleHistory = () => {
  const [articles, setArticles] = useState([]);

  // Load articles from localStorage when component mounts
  useEffect(() => {
    const savedArticles = localStorage.getItem('articleHistory');
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (error) {
        console.error('Error loading articles from localStorage:', error);
        setArticles([]);
      }
    }
  }, []);

  // Save a new article
  const saveArticle = (articleData) => {
    const newArticle = {
      id: Date.now(), // Simple ID using timestamp
      url: articleData.url,
      summary: articleData.summary,
      classification: articleData.classification,
      scores: articleData.scores,
      timestamp: new Date().toISOString()
    };

    const updatedArticles = [newArticle, ...articles]; // Add new article to beginning
    setArticles(updatedArticles);
    
    // Save to localStorage
    try {
      localStorage.setItem('articleHistory', JSON.stringify(updatedArticles));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return { articles, saveArticle };
};