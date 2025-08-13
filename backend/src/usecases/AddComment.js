const CommentRepository = require('../infra/repositories/CommentRepository');
const ArticleRepository = require('../infra/repositories/ArticleRepository');

class AddComment {
  constructor() {
    this.commentRepository = new CommentRepository();
    this.articleRepository = new ArticleRepository();
  }

  async execute({ content, author, email, articleId }) {
    // Validate inputs
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content is required');
    }

    if (!author || author.trim().length === 0) {
      throw new Error('Author name is required');
    }

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Valid email is required');
    }

    if (!articleId || isNaN(parseInt(articleId))) {
      throw new Error('Valid article ID is required');
    }

    // Check if article exists
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    // Create comment
    return await this.commentRepository.create({
      content: content.trim(),
      author: author.trim(),
      email: email.trim().toLowerCase(),
      articleId
    });
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = AddComment;