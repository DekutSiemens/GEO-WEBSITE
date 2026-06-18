// src/services/apiService.js

import axios from 'axios';

const apiService = {
  getDocuments: async () => {
    const response = await axios.get('http://localhost:5102/api/files');
    return response.data;
  },

  addDocument: async (document) => {
    const response = await axios.post('http://localhost:5102/api/files', document);
    return response.data;
  }
};

export default apiService;
