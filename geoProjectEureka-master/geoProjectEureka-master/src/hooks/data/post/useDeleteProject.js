import {useState} from "react";
import {axiosReq} from "../../../utils/axios";
import useDisplayAlert from "../../useDisplayAlert";
import { useNavigate } from "react-router-dom";

const useDeleteProject = () => {
    const [isLoadingDeleteProject, setIsLoadingDeleteProject] = useState(false);
    const [message, setMessage] = useState({ code: null, description: null });
    const navigate = useNavigate();
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    const handleDeleteProject = async (id) => {
        setIsLoadingDeleteProject(true);
        try {
            const response = await axiosReq.delete('/api/data/delete',  { data: { id } });
            if (response) {
                setMessage({code : response.status, description : response.data.message});
                window.location.reload();
              }
          } catch (error) {
            if (error.response.status === 403){
                setMessage({code : error.response.status, description : "Action not allowed"});
                await sleep(2000)
                navigate('/login');
            }else{
                setMessage({code : error.response.status, description : error.response.data.message});
            }
          }finally{
            setIsLoadingDeleteProject(false);
          }
    };

    const {alertBanner}= useDisplayAlert(message);

    return { handleDeleteProject, isLoadingDeleteProject, alertBannerDeleteProject : alertBanner };
};

export default useDeleteProject;