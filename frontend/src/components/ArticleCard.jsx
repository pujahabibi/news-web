import React from 'react';

function ArticleCard({ article, onClick, highlightQuery }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const highlightText = (text, query) => {
    if (!query || !highlightQuery) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="article-card" onClick={onClick}>
      <div className="article-card-content">
        <div className="article-category">
          {article.category?.name || 'Uncategorized'}
        </div>
        
        <h3 className="article-title">
          {highlightText(article.title, highlightQuery)}
        </h3>
        
        <p className="article-summary">
          {highlightText(article.summary, highlightQuery)}
        </p>
        
        <div className="article-meta">
          <div>
            <div className="article-author">By {article.author}</div>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
              {formatDate(article.publishedAt)}
            </div>
          </div>
          
          <div className="article-stats">
            <div className="stat-item">
              <span>❤️</span>
              <span>{article.likes}</span>
            </div>
            <div className="stat-item">
              <span>👁️</span>
              <span>{article.views}</span>
            </div>
            <div className="stat-item">
              <span>💬</span>
              <span>{article.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;