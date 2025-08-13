class Comment {
  constructor({ id, content, author, email, articleId, createdAt }) {
    this.id = id;
    this.content = content;
    this.author = author;
    this.email = email;
    this.articleId = articleId;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      author: this.author,
      email: this.email,
      articleId: this.articleId,
      createdAt: this.createdAt
    };
  }
}

module.exports = Comment;