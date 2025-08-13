class Category {
  constructor({ id, name, description, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt
    };
  }
}

module.exports = Category;