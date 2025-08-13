import React from 'react';

function CommentList({ comments }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center mt-3">
        <p className="text-muted">No comments yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="comments-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;