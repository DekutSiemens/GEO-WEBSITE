import { useState, useEffect } from 'react';
import { axiosReq } from '../../../utils/axios';
import useDisplayAlert from '../../useDisplayAlert';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios' 

/**
 * Hook to handle editing project data.
 *
 * @typedef useEditProject
 * @kind hook
 *
 * @param {string} id - ID of the project to edit
 * @returns {object} - Handle form submission, loading state, alert banner, and project data.
 */
const useEditProject = (id) => {
    const [isLoading, setIsLoading] = useState(false);
    const [projectData, setProjectData] = useState(null); // To store the fetched project details
    const [message, setMessage] = useState({ code: null, description: null });
    const navigate = useNavigate();

    useEffect(() => {
        if (!id || typeof id !== 'string') {
            console.error('Invalid projectId:', id);
            return; // Early exit if projectId is invalid
        }
    
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                // Retrieve the token from session storage
                const token = sessionStorage.getItem('token'); // Get the JWT token from sessionStorage
    
                // Make the request with the Authorization header
                const response = await axiosReq.get(`/api/data/ProjectById/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to Authorization header
                    }
                });
                
                if (response.status === 200) {
                    setProjectData(response.data); // Store the fetched project data
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchProject(); // Call the async function to fetch the data
    }, [id]); 
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const handleSubmit = async (e, selectedFiles, dataId) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        // Append files if there are any new ones
        if (selectedFiles.length > 0) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('files', selectedFiles[i]);
            }
        }

        // Append all other form fields
        formData.append('title', e.target.elements.projectName.value);
        formData.append('location', e.target.elements.location.value);
        formData.append('sampleType', e.target.elements.sampleType.value);
        formData.append('collectionDate', e.target.elements.collectionDate.value);
        formData.append('depth', e.target.elements.depth.value);
        formData.append('temperature', e.target.elements.temperature.value);
        formData.append('pH', e.target.elements.pH.value);
        formData.append('electricalConductivity', e.target.elements.electricalConductivity.value);
        formData.append('geochemistryComment', e.target.elements.geochemistryComment.value);
        formData.append('lithology', e.target.elements.lithology.value);
        formData.append('alteration', e.target.elements.alteration.value);
        formData.append('mineralogy', e.target.elements.mineralogy.value);
        formData.append('geochimicalAnalysis', e.target.elements.geochimicalAnalysis.value);
        formData.append('texture', e.target.elements.texture.value);
        formData.append('hydrothermalFeatures', e.target.elements.hydrothermalFeatures.value);
        formData.append('structure', e.target.elements.structure.value);
        formData.append('geologyComment', e.target.elements.geologyComment.value);
        formData.append('method', e.target.elements.method.value);
        formData.append('surveyDate', e.target.elements.surveyDate.value);
        formData.append('depthOfPenetrationMeters', e.target.elements.depthOfPenetrationMeters.value);
        formData.append('resolutionsMeters', e.target.elements.resolutionsMeters.value);
        formData.append('measuredParameters', e.target.elements.measuredParameters.value);
        formData.append('recoveredPropertiesOfInterest', e.target.elements.recoveredPropertiesOfInterest.value);
        formData.append('instrumentUsed', e.target.elements.instrumentUsed.value);
        formData.append('potentialTargets', e.target.elements.potentialTargets.value);
        formData.append('geophysicsComment', e.target.elements.geophysicsComment.value);
        formData.append('dataId', dataId);
        formData.append('id', id);


        try {
            // Use PUT method to update the project
            const response = await axiosReq.put(`/api/data/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response) {
                setMessage({ code: response.status, description: response.data.message });
                setIsLoading(false);
                await sleep(2000);
                navigate('/dashboard'); // Navigate back to the dashboard after update
            }
        } catch (error) {
            setMessage({ code: error.response.status, description: error.response.data.message });
            setIsLoading(false);
        }
    };
    

    const { alertBanner } = useDisplayAlert(message);

    return { handleSubmit, isLoading, alertBanner, projectData };
};

export default useEditProject;

