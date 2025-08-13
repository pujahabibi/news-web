const prisma = require('../db/prisma');
const Comment = require('../../domain/entities/Comment');

class CommentRepository {
  async create({ content, author, email, articleId }) {
    const comment = await prisma.comment.create({
      data: {
        content,
        author,
        email,
        articleId: parseInt(articleId)
      }
    });

    return new Comment(comment);
  }

  async findByArticleId(articleId) {
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      orderBy: { createdAt: 'desc' }
    });

    return comments.map(comment => new Comment(comment));
  }
}

module.exports = CommentRepository;