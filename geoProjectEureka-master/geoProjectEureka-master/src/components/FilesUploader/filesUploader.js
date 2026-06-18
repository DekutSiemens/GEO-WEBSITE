import React, { useEffect, useState } from 'react';

const FilesUploader = ({ handleFileSelection, initialFiles = [] }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [totalSize, setTotalSize] = useState(0);

    const MAX_TOTAL_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB max

    useEffect(() => {
        if (initialFiles.length > 0) {
            setSelectedFiles(initialFiles);
            const initialPreviews = initialFiles.map(file => ({
                url: file.url || URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' :
                      file.type.startsWith('image') ? 'image' : 'document'
            }));
            setPreviews(initialPreviews);
            const initialTotalSize = initialFiles.reduce((sum, file) => sum + (file.size || 0), 0);
            setTotalSize(initialTotalSize);
        }
    }, [initialFiles]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        let currentTotalSize = totalSize;

        files.forEach(file => {
            currentTotalSize += file.size;
        });

        if (currentTotalSize > MAX_TOTAL_SIZE) {
            alert('Total file size exceeds the 2 GB limit!');
            return;
        }

        const updatedFiles = [...selectedFiles, ...files];
        setSelectedFiles(updatedFiles);
        setTotalSize(currentTotalSize);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' :
                  file.type.startsWith('image') ? 'image' : 'document'
        }));
        setPreviews([...previews, ...newPreviews]);
        handleFileSelection(updatedFiles);
    };

    const removeFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        const updatedTotalSize = updatedFiles.reduce((sum, file) => sum + file.size, 0);

        setSelectedFiles(updatedFiles);
        setPreviews(updatedPreviews);
        setTotalSize(updatedTotalSize);
        handleFileSelection(updatedFiles);
    };

    return (
        <div>
            <h2>Select Files (Images, Videos, PDFs, DOCs - Max Total Size: 2 GB)</h2>
            <div className="mt-2 mb-2">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    id="filesSelectorButton"
                />
                <label htmlFor="filesSelectorButton" className="cursor-pointer text-white px-2 py-2 rounded bg-light-blue">
                    Select files
                </label>
            </div>

            <p>Total Size: {(totalSize / (1024 * 1024)).toFixed(2)} MB</p>

            <div style={{ marginTop: '20px' }}>
                <h3>Previews</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {previews.map((file, index) => (
                        file.type === 'image' ? (
                            <img
                                key={index}
                                src={file.url}
                                alt={`Preview ${index}`}
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                        ) : file.type === 'video' ? (
                            <video
                                key={index}
                                src={file.url}
                                controls
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                key={index}
                                style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '8px' }}
                            >
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {file.type === 'document' ? 'View Document' : 'Download'}
                                </a>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilesUploader;
