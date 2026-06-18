import { useEffect, useState } from "react";
import {axiosReq} from "../../../utils/axios";

const useGetRole = () => {
    const [Role, setRole] = useState();
    const [isLoading, setIsLoading] = useState(true);    
      
    useEffect(()=>{
        const getRole = async () => {
            setIsLoading(true);
            try {
                const response = await axiosReq.get(`/api/auth/role`);
                if (response) {
                    setRole(response.data);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        };
        getRole();
    },[])
    return { Role, isLoading };
}

export default useGetRole;