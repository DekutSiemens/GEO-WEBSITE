import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useEditProject from "../hooks/data/post/useEditProject";
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import useAuthentication from "../hooks/useAuthentication";


const EditProjectPage = () => {
    const { id } = useParams();
    const { handleSubmit, isLoading, alertBanner, projectData } = useEditProject(id);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const navigate = useNavigate();
    const {getUserInfosFromSessionStorage}=useAuthentication();
    const userInfos = getUserInfosFromSessionStorage();

    const handleFileSelection = (e) => {
        const filesArray = Array.from(e.target.files); // Convert FileList to array
        setSelectedFiles(filesArray);
    };

    const handleCancel = () =>{
        navigate('/dashboard')
    }

    const formatFileSize = (size)=>{
        if (size <1024) return `${size} bytes`;
        else if(size < 1048576) return `${(size/1024).toFixed(2)} kb`;
        else return `${(size / 1048576).toFixed(2)} MB`;
    };

    if (!projectData) {
        return <div className="flex items-center justify-center h-screen">
            Project data is loading ...</div>; // Loading indicator until project data is fetched
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        return [year, month, day].join('-');
    };    

    return (
       
        <div className='min-h-screen flex flex-col'>
            <Header connected={userInfos ? true : false} role={userInfos?.role}/>
            <main className='flex-grow max-w-7xl mx-auto p-6 space-y-8'>
        <form onSubmit={(e) => handleSubmit(e, selectedFiles, projectData.dataId)}
        className='max-w-7xl mx-auto p-6 space-y-8 bg-white shadow-lg rounded-md'>
            {alertBanner && alertBanner}

            <h1 className='text-2xl font-bold mb-4'>Edit Project Page</h1>
            <div className='border p-4 rounded-md sahdow-sm'>
                <h2 className='grid grid-cols-1 md:grid-cols-3 gap-4'>General</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

                                {/* File upload input */}
            <div className='mt-4'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-blue-600 font-semibold">Select Images or Videos (Max Total Size: 2 GB)</span>
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelection}
                    className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </label>
            {/* Display selected file names */}
                {selectedFiles.length > 0 && (
                    <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Selected Files:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-500">
                            {Array.from(selectedFiles).map((file, index) => (
                                <li key={index}>
                                    {file.name} : {formatFileSize(file.size)}
                                    </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>

            {/* Project Name */}
            <input
                type="text"
                name="projectName"
                defaultValue={projectData.title}
                
                className='border p-2 rounded-md'
                placeholder='ProjectName'
            />

            {/* Location */}
            <input
                type="text"
                name="location"
                defaultValue={projectData.location}
                className='border p-2 rounded-md'
                placeholder='location'

            />
            {/* Sample Type */}
            <input
                type="text"
                name="sampleType"
                defaultValue={projectData.sampleType}
                className='border p-2 rounded-md'
                placeholder='sampleType'
            />

            {/* Collection Date */}
            <input
                type="date"
                name="collectionDate"
                defaultValue={formatDate(projectData.collectionDate)}
                className='border p-2 rounded-md'
                placeholder='collectionDate'
            />
            </div>
        </div>
        <div className="border p-4 rounded-md shadow-sm">
         <h2 className="text-xl font-semibold mb-2">Geochemistry</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Depth */}
            <input
                type="number"
                name="depth"
                defaultValue={projectData.depth}
                className='border p-2 rounded-md'
                placeholder='Depth '
            />

            {/* Temperature */}
            <input
                type="number"
                name="temperature"
                defaultValue={projectData.temperature}
                
                className='border p-2 rounded-md'
                placeholder='temperature'
            />

            {/* pH */}
            <input
                type="number"
                name="pH"
                defaultValue={projectData.pH}
                
                className='border p-2 rounded-md'
                placeholder='pH value'
            />

            {/* Electrical Conductivity */}
            <input
                type="number"
                name="electricalConductivity"
                defaultValue={projectData.electricalConductivity}
                
                className='border p-2 rounded-md'
                placeholder='Electrical Conductivity'
            />

            {/* Geochemistry Comment */}
            <textarea
                name="geochemistryComment"
                defaultValue={projectData.geochemistryComment}
                
                className='border p-2 rounded-md'
                placeholder='Geochemistry comment'
            />

        </div>
        </div>
        <div className="border p-4 rounded-md shadow-sm">
         <h2 className="text-xl font-semibold mb-2">Geology</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lithology */}
            <textarea
                name="lithology"
                defaultValue={projectData.lithology}
                
                className='border p-2 rounded-md'
                placeholder='lithology'
            />

            {/* Alteration */}
            <textarea
                name="alteration"
                defaultValue={projectData.alteration}
                
                className='border p-2 rounded-md'
                placeholder='alteration'
            />

            {/* Mineralogy */}
            <textarea
                name="mineralogy"
                defaultValue={projectData.mineralogy}
                
                className='border p-2 rounded-md'
                placeholder='mineralogy'
            />

            {/* Geochimical Analysis */}
            <textarea
                name="geochimicalAnalysis"
                defaultValue={projectData.geochimicalAnalysis}
                
                className='border p-2 rounded-md'
                placeholder='geochemical analysis'
            />

            {/* Texture */}
            <textarea
                name="texture"
                defaultValue={projectData.texture}
                
                className='border p-2 rounded-md'
                placeholder='texture'
            />

            {/* Hydrothermal Features */}
            <textarea
                name="hydrothermalFeatures"
                defaultValue={projectData.hydrothermalFeatures}
                
                className='border p-2 rounded-md'
                placeholder='hydrothermal Features'
            />

            {/* Structure */}
            <textarea
                name="structure"
                defaultValue={projectData.structure}
                
                className='border p-2 rounded-md'
                placeholder='structure'
            />

            {/* Geology Comment */}
            <textarea
                name="geologyComment"
                defaultValue={projectData.geologyComment}
                
                className='border p-2 rounded-md'
                placeholder='Geology comment'
            />
        </div>
        </div>

            <div className="border p-4 rounded-md shadow-sm">
                 <h2 className="text-xl font-semibold mb-2">Geophysics</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Method */}
            <input
                type="text"
                name="method"
                defaultValue={projectData.method}
                
                className='border p-2 rounded-md'
                placeholder='Method'
            />

            {/* Survey Date */}
            <input
                type="date"
                name="surveyDate"
                defaultValue={formatDate(projectData.surveyDate)}
                className='border p-2 rounded-md'
                placeholder='Survey date'
            />

            {/* Depth Of Penetration Meters */}
            <input
                type="number"
                name="depthOfPenetrationMeters"
                defaultValue={projectData.depthOfPenetrationMeters}
                className='border p-2 rounded-md'
                placeholder='Depth of Penetration in metres'
            />

            {/* Resolutions Meters */}
            <input
                type="number"
                name="resolutionsMeters"
                defaultValue={projectData.resolutionsMeters}
                className='border p-2 rounded-md'
                placeholder='Resolution meters'
            />

            {/* Measured Parameters */}
            <textarea
                name="measuredParameters"
                defaultValue={projectData.measuredParameters}
                
                className='border p-2 rounded-md'
                placeholder='measured Parameters'
            />

            {/* Recovered Properties Of Interest */}
            <textarea
                name="recoveredPropertiesOfInterest"
                defaultValue={projectData.recoveredPropertiesOfInterest}
                
                className='border p-2 rounded-md'
                placeholder='recovered Properties of Interest'
            />

            {/* Instrument Used */}
            <input
                type="text"
                name="instrumentUsed"
                defaultValue={projectData.instrumentUsed}
                
                className='border p-2 rounded-md'
                placeholder='instrument Used'
            />

            {/* Potential Targets */}
            <textarea
                name="potentialTargets"
                defaultValue={projectData.potentialTargets}
                
                className='border p-2 rounded-md'
                placeholder='potential Targets'
            />

            {/* Geophysics Comment */}
            <textarea
                name="geophysicsComment"
                defaultValue={projectData.geophysicsComment}
                
                className='border p-2 rounded-md'
                placeholder='Geophysics comment'
            />
            </div>
            </div>

            
            <div className='flex justify-end at-6'>
            <button 
            type="button"
            onClick={handleCancel}
             className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 mr-2">
              Cancel/back
            </button>
            <button 
            type="submit" 
            disabled={isLoading}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2'>
                Update Project
            </button>
            
            </div>
        </form>
        </main>
        <Footer />
        </div>
    );
};

export default EditProjectPage;
