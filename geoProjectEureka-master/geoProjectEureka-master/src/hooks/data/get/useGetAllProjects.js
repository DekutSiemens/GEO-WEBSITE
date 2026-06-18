import { useEffect, useState } from "react";
import {axiosReq} from "../../../utils/axios";

const useGetAllProjects = () => {
    const [Data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);    
      
    useEffect(()=>{
        const getAllProjects = async () => {
            setIsLoading(true);
            try {
                const response = await axiosReq.get(`/api/data/all`);
                if (response) {
                    setData(response.data);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        };
        getAllProjects();
    },[])
    return { Data, isLoading };
}

export default useGetAllProjects;