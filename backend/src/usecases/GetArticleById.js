const ArticleRepository = require('../infra/repositories/ArticleRepository');

class GetArticleById {
  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async execute(id) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Valid article ID is required');
    }

    // Increment views when fetching article
    await this.articleRepository.incrementViews(id);
    
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}

module.exports = GetArticleById;