const ArticleRepository = require('../infra/repositories/ArticleRepository');

class SearchArticles {
  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async execute({ query, page = 1, limit = 10 }) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    // Validate inputs
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.min(50, Math.max(1, parseInt(limit)));
    const cleanQuery = query.trim();

    return await this.articleRepository.search(cleanQuery, {
      page: validPage,
      limit: validLimit
    });
  }
}

module.exports = SearchArticles;