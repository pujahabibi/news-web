const prisma = require('../db/prisma');
const Category = require('../../domain/entities/Category');

class CategoryRepository {
  async findAll() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return categories.map(category => new Category(category));
  }

  async findById(id) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!category) return null;

    return new Category(category);
  }
}

module.exports = CategoryRepository;