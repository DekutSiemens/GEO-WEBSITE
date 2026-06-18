'use client'

import React, { useState, useEffect, useRef } from 'react'
import useAuthentication from '../hooks/useAuthentication'
import Footer from './Footer/footer'
import Header from './Header/header'

const BookPage = ({ content, pageNumber, totalPages }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full h-[600px] flex flex-col">
    <div className="flex-grow overflow-y-auto">
      <p className="text-gray-800 leading-relaxed">{content}</p>
    </div>
    <div className="text-center text-gray-500 mt-4">
      Page {pageNumber} of {totalPages}
    </div>
  </div>
);

export default function ArticleAndDocumentManager() {
  const { getUserInfosFromSessionStorage } = useAuthentication();
  const userInfos = getUserInfosFromSessionStorage();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [articleImage, setArticleImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [articles, setArticles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const bookRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleArticleImageChange = (e) => {
    setArticleImage(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5100/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('File upload response:', data);
      setMessage(data.message);
      setError('');
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Error uploading file: ${err.message}`);
      setMessage('');
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !author) {
      setError('Title, content, and author are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    if (articleImage) {
      formData.append('articleImage', articleImage);
    }

    try {
      let url = 'http://localhost:5100/api/create-article';
      let method = 'POST';

      if (editingArticle) {
        url = `http://localhost:5100/api/update-article/${editingArticle.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Article operation response:', data);
      setMessage(data.message);
      setError('');
      resetForm();
      fetchArticles();
    } catch (err) {
      console.error('Error with article operation:', err);
      setError(`Error ${editingArticle ? 'updating' : 'creating'} article: ${err.message}`);
      setMessage('');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setArticleImage(null);
    setEditingArticle(null);
  };

  const handleDeleteArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5100/api/delete-article/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Article deletion response:', data);
      setMessage(data.message);
      fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      setError(`Error deleting article: ${err.message}`);
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
    setAuthor(article.author);
    setArticleImage(null);
  };

  const handleDeleteDocument = async (id) => {
    try {
      const response = await fetch(`http://localhost:5100/api/delete-document/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Document deletion response:', data);
      setMessage(data.message);
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(`Error deleting document: ${err.message}`);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:5100/api/articles');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched articles:', data);
      setArticles(data.articles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(`Error fetching articles: ${err.message}`);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5100/api/documents');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched documents:', data);
      setDocuments(data.documents);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(`Error fetching documents: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchDocuments();
  }, []);

  const openArticle = (article) => {
    setSelectedContent(article.content);
    setSelectedTitle(article.title);
    setSelectedAuthor(article.author);
    setSelectedImage(article.image);
    setCurrentPage(1);
    setTotalPages(Math.ceil(article.content.split(' ').length / 300));
  };

  const getPageContent = (content, page) => {
    const words = content.split(' ');
    const startIndex = (page - 1) * 300;
    const endIndex = startIndex + 300;
    return words.slice(startIndex, endIndex).join(' ');
  };

  const handlePageTurn = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const viewDocument = async (doc) => {
    try {
      const response = await fetch(`http://localhost:5100${doc.url}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setSelectedDocument({ ...doc, content: text });
    } catch (err) {
      console.error('Error fetching document:', err);
      setError(`Error fetching document: ${err.message}`);
    }
  };

  return (
    <>
      <Header connected={!!userInfos} role={userInfos?.role} />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-blue-500">Upload PDF Document</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Upload PDF
              </button>
            </form>
          </div>

          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              {editingArticle ? 'Edit Article' : 'Create Article'}
            </h2>
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Article Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-32"
              />
              <input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="file"
                onChange={handleArticleImageChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {editingArticle ? 'Update Article' : 'Create Article'}
              </button>
              {editingArticle && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-500">Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold text-blue-500">{article.title}</h3>
                  <p className="text-gray-600 mb-2">By: {article.author}</p>
                  {article.image && (
                    <img
                      src={`http://localhost:5100${article.image}`}
                      alt={article.title}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                  )}
                  <p className="text-gray-600 mb-2">
                    {article.content.slice(0, 100)}...
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => openArticle(article)}
                    >
                      Read More
                    </button>
                    <div>
                      <button
                        className="text-yellow-500 hover:underline mr-2"
                        onClick={() => handleEditArticle(article)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No articles found.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-500">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold text-blue-500">{doc.name}</h3>
                  <div className="flex justify-between mt-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => viewDocument(doc)}
                    >
                      View Document
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No documents found.</p>
            )}
          </div>
        </div>

        {selectedContent && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div ref={bookRef} className="bg-[#f1e7c0] p-8 rounded-lg shadow-2xl max-w-4xl w-full h-[700px] flex flex-col items-center relative">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{selectedTitle}</h2>
              <p className="text-gray-600 mb-4">By: {selectedAuthor}</p>
              {selectedImage && (
                <img
                  src={`http://localhost:5100${selectedImage}`}
                  alt={selectedTitle}
                  className="w-1/2 h-40 object-cover mb-4 rounded"
                />
              )}
              <div className="flex justify-between w-full">
                <button
                  className="text-gray-800 font-bold text-3xl"
                  onClick={() => handlePageTurn('prev')}
                  disabled={currentPage === 1}
                >
                  &#8249;
                </button>
                <BookPage
                  content={getPageContent(selectedContent, currentPage)}
                  pageNumber={currentPage}
                  totalPages={totalPages}
                />
                <button
                  className="text-gray-800 font-bold text-3xl"
                  onClick={() => handlePageTurn('next')}
                  disabled={currentPage === totalPages}
                >
                  &#8250;
                </button>
              </div>
              <button
                className="absolute top-4 right-4 text-gray-800 font-bold"
                onClick={() => {
                  setSelectedContent(null);
                  setSelectedTitle('');
                  setSelectedAuthor('');
                  setSelectedImage('');
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {selectedDocument && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full h-[700px] flex flex-col relative">
              <h2 className="text-2xl font-bold mb-4">{selectedDocument.name}</h2>
              <div className="flex-grow overflow-y-auto">
                <pre className="whitespace-pre-wrap">{selectedDocument.content}</pre>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={() => setSelectedDocument(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mt-4">
            <strong>Success:</strong> {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}