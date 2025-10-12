import { useState, useEffect } from 'react';

export const useArticleHistory = () => {
  const [articles, setArticles] = useState([]);

  // retrieve my saved articles
    useEffect(() => {
    const savedArticles = localStorage.getItem('articleHistory');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
  }, []);
  
  const saveArticle = (article) => {
    const newArticle = {
        id: Date.now,
        url: articleData.url,
        summary: articleData.summary,
        classification: articleData.classification,
        scores: articleData.scores,
    }
    const updatedArticles = [newArticle, ...articles]; 
    setArticles(updatedArticles);
    localStorage.setItem('articleHistory', JSON.stringify(updatedArticles));
    
  };
  

  
  return { articles, saveArticle};
};