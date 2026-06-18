// src/components/ViewDocument.js

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiServices';

const ViewDocument = ({ documentId }) => {
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      const fetchedDocument = await apiService.getDocument(documentId);
      setDocumentContent(fetchedDocument.content);
    } catch (error) {
      console.error('Error loading document:', error);
    }
  };

  return (
    <div>
      <h2>View Document</h2>
      {documentContent && <pre>{documentContent}</pre>}
    </div>
  );
};

export default ViewDocument;
