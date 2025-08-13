const ArticleRepository = require('../infra/repositories/ArticleRepository');

class GetArticles {
  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async execute({ page = 1, limit = 10, categoryId, sortBy = 'publishedAt', sortOrder = 'desc' }) {
    // Validate inputs
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.min(50, Math.max(1, parseInt(limit)));
    
    const validSortFields = ['publishedAt', 'likes', 'views', 'title'];
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'publishedAt';
    
    const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

    return await this.articleRepository.findAll({
      page: validPage,
      limit: validLimit,
      categoryId,
      sortBy: validSortBy,
      sortOrder: validSortOrder
    });
  }
}

module.exports = GetArticles;