const Article = require('../domain/entities/Article');

class UpdateArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(articleId, articleData) {
    // In a real-world application, you would first fetch the existing article
    // to ensure it exists and to merge the properties.
    const { title, content, author, categoryId, thumbnailUrl } = articleData;

    // This is a simplified approach. A more robust implementation
    // would handle partial updates and validate fields.
    if (!title || !content || !author || !categoryId) {
      throw new Error('Missing required fields: title, content, author, or categoryId');
    }
    
    const article = new Article({
      id: articleId,
      title,
      content,
      author,
      categoryId,
      thumbnailUrl, // Can be updated
      // createdAt is not updated
      updatedAt: new Date()
    });

    return await this.articleRepository.update(articleId, article);
  }
}

module.exports = UpdateArticle;
