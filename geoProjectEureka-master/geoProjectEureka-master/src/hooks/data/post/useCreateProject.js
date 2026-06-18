import {useState} from "react";
import {axiosReq} from "../../../utils/axios";
import useDisplayAlert from "../../useDisplayAlert";
import { useNavigate } from "react-router-dom";

/**
 * Hook sign up post data.
 * 
 * @typedef useSignUp
 * @kind hook
 * 
 * @returns {object} - 
 */
const useCreateProject = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ code: null, description: null });
    const navigate = useNavigate()
    
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSubmit = async (e, selectedFiles) => {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData();
    
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

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

        try {
            const response = await axiosReq.post('/api/data/add', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response) {
                setMessage({code : response.status, description : response.data.message});
                setIsLoading(false);
                await sleep(2000);
                navigate('/Dashboard');  
            }
          } catch (error) {
            setMessage({code : error.response.status, description : error.response.data.message});
            setIsLoading(false);
          }
    };

    const {alertBanner}= useDisplayAlert(message);

    return { handleSubmit, isLoading, alertBanner };
};

export default useCreateProject;