import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import useAuthentication from '../hooks/useAuthentication';

export default function ImageAnalyzer() {
  const { getUserInfosFromSessionStorage } = useAuthentication();
  const userInfos = getUserInfosFromSessionStorage();

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewUrls).then((urls) => setPreviews(urls));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one image to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    const formData = new FormData();
    files.forEach((file, index) => formData.append(`file${index}`, file));

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error during image analysis:', error);
      setError('Failed to analyze the images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header connected={userInfos ? true : false} role={userInfos?.role} />
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Image Analyzer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images: (preferably jpg files)
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {previews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="max-w-full max-h-48 object-contain mx-auto"
                  />
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={files.length === 0 || isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Images'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Analysis Results:</h3>
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 shadow-md rounded-lg p-4 mb-4">
                  <p><strong>Prediction:</strong> {result.prediction}</p>
                  <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
                  <div className="mt-2">
                    <strong>Explanations:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      {result.explanations.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-xl max-w-md">
              <h3 className="text-2xl font-semibold mb-4 font-bold">Disclaimer</h3>
              <p className="text-gray-600 text-xl mb-6">
                This image analysis model is designed for demonstration purposes and may
                have limitations due to the dataset size used in its training.
                The results provided should not be interpreted as professional or conclusive advice.
                For critical decisions or precise analysis, please note you have to consult a qualified professional or specialist in the field.
              </p>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                I Understand
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
