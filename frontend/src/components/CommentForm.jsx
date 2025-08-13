import React, { useState } from 'react';
import api from '../api';

function CommentForm({ articleId, onCommentAdded }) {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Basic validation
    if (!formData.author.trim() || !formData.email.trim() || !formData.content.trim()) {
      setError('All fields are required');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const comment = await api.post(`/articles/${articleId}/comments`, formData);
      
      // Reset form
      setFormData({ author: '', email: '', content: '' });
      
      // Notify parent component
      onCommentAdded(comment);
      
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Add a Comment</h3>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="author">Name *</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-input"
            value={formData.author}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Comment *</label>
        <textarea
          id="content"
          name="content"
          className="form-input form-textarea"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share your thoughts..."
          required
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
      </button>
    </form>
  );
}

export default CommentForm;