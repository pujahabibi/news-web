import React, { useState, useEffect } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

function ArticlePage({ articleId, onNavigate }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(`/articles/${articleId}`);
      setArticle(data);
    } catch (err) {
      console.error('Failed to load article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liking) return;
    
    try {
      setLiking(true);
      const response = await api.post(`/articles/${articleId}/like`);
      setArticle(prev => ({ ...prev, likes: response.likes }));
    } catch (err) {
      console.error('Failed to like article:', err);
    } finally {
      setLiking(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setArticle(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Article</h2>
        <div className="error-message">{error}</div>
        <div className="mt-2">
          <button onClick={() => onNavigate('home')} className="btn btn-primary">
            Back to Home
          </button>
          <button onClick={loadArticle} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="error-container">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => onNavigate('home')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="article-page">
      <div className="mb-2">
        <button 
          onClick={() => onNavigate('home')} 
          className="btn btn-outline btn-small"
        >
          ← Back to Articles
        </button>
      </div>

      <article className="article-detail">
        <header className="article-header">
          <div className="article-category">
            {article.category?.name}
          </div>
          
          <h1 className="article-detail-title">{article.title}</h1>
          
          <div className="article-detail-meta">
            <span className="article-author">By {article.author}</span>
            <span>Published {formatDate(article.publishedAt)}</span>
            <span>{article.views} views</span>
          </div>
          
          <div className="article-actions">
            <button 
              onClick={handleLike}
              disabled={liking}
              className="like-button"
            >
              ❤️ {article.likes} {article.likes === 1 ? 'Like' : 'Likes'}
            </button>
            
            <div className="stat-item">
              💬 {article.comments?.length || 0} {article.comments?.length === 1 ? 'Comment' : 'Comments'}
            </div>
          </div>
        </header>

        <div className="article-body">
          {article.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>

        <section className="comments-section">
          <h2 className="comments-header">
            Comments ({article.comments?.length || 0})
          </h2>
          
          <CommentForm 
            articleId={articleId}
            onCommentAdded={handleCommentAdded}
          />
          
          <CommentList comments={article.comments || []} />
        </section>
      </article>
    </div>
  );
}

export default ArticlePage;