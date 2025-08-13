const prisma = require('../db/prisma');
const Article = require('../../domain/entities/Article');

class ArticleRepository {
  async findAll({ page = 1, limit = 10, categoryId, sortBy = 'publishedAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;
    
    const where = categoryId ? { categoryId: parseInt(categoryId) } : {};
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          comments: {
            select: { id: true },
          },
        },
      }),
      prisma.article.count({ where })
    ]);

    return {
      articles: articles.map(article => new Article({
        ...article,
        comments: article.comments
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id) {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        comments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!article) return null;

    return new Article(article);
  }

  async incrementViews(id) {
    return await prisma.article.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });
  }

  async toggleLike(id) {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) }
    });

    if (!article) return null;

    // For simplicity, we'll just increment likes (in a real app, you'd track user likes)
    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } }
    });

    return updated;
  }

  async search(query, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    
    // Note: Using $queryRaw for full-text search
    const searchQuery = `%${query}%`;
    
    const articles = await prisma.$queryRaw`
      SELECT a.*, c.name as categoryName, c.description as categoryDescription
      FROM articles a
      LEFT JOIN categories c ON a.categoryId = c.id
      WHERE a.title LIKE ${searchQuery} OR a.content LIKE ${searchQuery} OR a.summary LIKE ${searchQuery}
      ORDER BY a.publishedAt DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const countResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total
      FROM articles a
      WHERE a.title LIKE ${searchQuery} OR a.content LIKE ${searchQuery} OR a.summary LIKE ${searchQuery}
    `;

    const total = Number(countResult[0].total);

    return {
      articles: articles.map(article => new Article({
        ...article,
        category: {
          id: article.categoryId,
          name: article.categoryName,
          description: article.categoryDescription
        },
        comments: []
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = ArticleRepository;