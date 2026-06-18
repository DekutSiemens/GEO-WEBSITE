import { useEffect, useState } from "react";
import { axiosReq } from "../../../utils/axios";

const useGetProject = (id) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProject = async () => {
            setIsLoading(true);
            try {
                const response = await axiosReq.get(`/api/data/project`, { params: { itemId: id } });
                if (response && response.data) {
                    setData(response.data);
                }
            } catch (err) {
                setError(err.message || "Error fetching project data");
            } finally {
                setIsLoading(false);
            }
        };
        getProject();
    }, [id]);

    return { data, isLoading, error };
};

export default useGetProject;
