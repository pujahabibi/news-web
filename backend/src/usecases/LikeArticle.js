const ArticleRepository = require('../infra/repositories/ArticleRepository');

class LikeArticle {
  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async execute(id) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Valid article ID is required');
    }

    const article = await this.articleRepository.toggleLike(id);
    
    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}

module.exports = LikeArticle;