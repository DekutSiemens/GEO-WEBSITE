// src/components/DocumentList.js

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiServices';
import ViewDocument from './viewDocument';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const fetchedDocuments = await apiService.getDocuments();
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  return (
    <div>
      <h2>Document List</h2>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            {doc.fileName}
            <button onClick={() => ViewDocument(doc._id)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
