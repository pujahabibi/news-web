import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageArticlePage = ({ articleToEdit, onArticleManaged }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch categories
    api.get('/categories')
      .then(response => setCategories(response.data))
      .catch(err => setError('Failed to load categories.'));

    // If an article is passed for editing, populate the form
    if (articleToEdit) {
      setIsEditing(true);
      setTitle(articleToEdit.title);
      setContent(articleToEdit.content);
      setAuthor(articleToEdit.author);
      setCategoryId(articleToEdit.categoryId);
      setThumbnailUrl(articleToEdit.thumbnailUrl);
      if (articleToEdit.thumbnailUrl) {
        setThumbnailPreview(`http://localhost:4000${articleToEdit.thumbnailUrl}`);
      }
    }
  }, [articleToEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadThumbnail = async () => {
    if (!thumbnailFile) return null;

    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);

    try {
      const response = await api.post('/uploads/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.thumbnailUrl;
    } catch (err) {
      setError('Failed to upload thumbnail.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let finalThumbnailUrl = thumbnailUrl;

    // Upload a new thumbnail if one is selected
    if (thumbnailFile) {
      const uploadedUrl = await handleUploadThumbnail();
      if (uploadedUrl) {
        finalThumbnailUrl = uploadedUrl;
      } else {
        return; // Stop submission if upload fails
      }
    }

    const articleData = {
      title,
      content,
      author,
      categoryId: parseInt(categoryId),
      thumbnailUrl: finalThumbnailUrl,
    };

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/articles/${articleToEdit.id}`, articleData);
      } else {
        response = await api.post('/articles', articleData);
      }
      onArticleManaged(response.data); // Callback to notify parent component
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} article. Please check the fields.`);
    }
  };

  return (
    <div className="manage-article-page">
      <h2>{isEditing ? 'Edit Article' : 'Create Article'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail</label>
          <input
            type="file"
            id="thumbnail"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
          />
        </div>
        {thumbnailPreview && (
          <div className="thumbnail-preview">
            <img src={thumbnailPreview} alt="Thumbnail preview" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}
        <button type="submit" className="submit-btn">
          {isEditing ? 'Update Article' : 'Create Article'}
        </button>
      </form>
    </div>
  );
};

export default ManageArticlePage;
