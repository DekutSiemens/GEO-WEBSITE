import React, { useState } from 'react';
import axios from 'axios';
import { Upload, File, Trash2, X } from 'lucide-react';
import { axiosReq } from '../utils/axios';
import useAuthentication from '../hooks/useAuthentication';
import Header from './Header/header';
import Footer from './Footer/footer';
import { useNavigate } from 'react-router-dom';


const DocumentUpload = ({ onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate =useNavigate();

    const {getUserInfosFromSessionStorage}=useAuthentication();
    const userInfos = getUserInfosFromSessionStorage();

    const handleHome =()=>{
      navigate("/")
    }
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(files => files.filter((_, i) => i !== index));
    };

    const handleUpload = async (e) => {
      e.preventDefault();
      
      if (!title.trim()) {
          setError('Title is required');
          return;
      }
  
      if (selectedFiles.length === 0) {
          setError('Please select at least one file');
          return;
      }
  
      try {
          setIsUploading(true);
          setError('');
  
          const formData = new FormData();
          formData.append('title', title);
          formData.append('description', description);
          selectedFiles.forEach(file => {
              formData.append('files', file);
          });
  
          const response = await axiosReq.post('/api/documents/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
  
          if (response.data.success) {
              setSelectedFiles([]);
              setTitle('');
              setDescription('');
              onUploadComplete && onUploadComplete(response.data.document);
          }
      } catch (error) {
          console.error('Upload error:', error);
          setError(error.response?.data?.message || 'Error uploading files');
      } finally {
          setIsUploading(false);
      }
  };
    return (<>
      <Header connected={userInfos ? true : false} role={userInfos?.role}/>
        <div className="bg-white rounded-lg shadow p-6 mb-10 mt-15">
            <form onSubmit={handleUpload} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block w-full cursor-pointer">
                        <div className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500">
                            <Upload className="h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                                Click to select files or drag and drop
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileSelect}
                        />
                    </label>

                    {selectedFiles.length > 0 && (
                        <div className="space-y-3">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <File className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isUploading || selectedFiles.length === 0}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                            ${isUploading || selectedFiles.length === 0
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            </form>
        </div>
        <button className='rounded-lg bg-blue-600 text-white-600 p-3 my-8 mx-8' onClick={handleHome}>Home</button><Footer/></>
    );
};

export default DocumentUpload;