import React, { useState } from 'react';
import useAuthentication from "../hooks/useAuthentication";
import Footer from '../components/Footer/footer';
import Header from '../components/Header/header';

const GoogleDriveViewer = () => {
  const [documentUrl, setDocumentUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {getUserInfosFromSessionStorage}=useAuthentication();
  const userInfos = getUserInfosFromSessionStorage();

  const getEmbedUrl = (url) => {
    try {
      let fileId = '';
      
      if (url.includes('drive.google.com/file/d/')) {
        fileId = url.split('/file/d/')[1].split('/')[0];
      } else if (url.includes('drive.google.com/open?id=')) {
        fileId = url.split('open?id=')[1];
      } else if (url.includes('docs.google.com')) {
        fileId = url.split('/d/')[1].split('/')[0];
      } else {
        throw new Error('Invalid Google Drive URL format');
      }

      return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch (err) {
      setError('Invalid Google Drive URL. Please check the URL and try again.');
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSubmitted(true);

    const newEmbedUrl = getEmbedUrl(documentUrl);
    if (newEmbedUrl) {
      setEmbedUrl(newEmbedUrl);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setDocumentUrl('');
    setEmbedUrl('');
    setError(null);
    setIsSubmitted(false);
  };

  return (
    <>
      <Header connected={userInfos ? true : false} role={userInfos?.role}/>
    <div className="max-w-4xl mx-auto p-10 mt-10 mb-20">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Viewer</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Google Drive Document URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="documentUrl"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="Paste Google Drive URL here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View
                </button>
                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {embedUrl && !error && (
          <div className="relative w-full" style={{ paddingTop: '75%' }}>
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay"
              title="Google Drive Document"
            />
          </div>
        )}

        {!embedUrl && !error && !isLoading && isSubmitted && (
          <div className="p-12 text-center text-gray-500">
            No document to display. Please enter a valid Google Drive URL.
          </div>
        )}
      </div>
    </div><Footer/></>
  );
};

export default GoogleDriveViewer;