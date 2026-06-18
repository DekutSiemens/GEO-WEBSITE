import {useState} from "react";
import {axiosReq} from "../../../utils/axios";
import useDisplayAlert from "../../useDisplayAlert";
import useAuthentication from "../../useAuthentication";
import { useNavigate } from "react-router-dom";

/**
 * Hook useLogIn post data.
 * 
 * @typedef useLogIn
 * @kind hook
 * 
 * @returns {object}
 */
const useLogIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ code: null, description: null });
    const {saveUserDataToSessionStorage} = useAuthentication();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loginData ={
          email: e.target.elements.email.value,
          password: e.target.elements.password.value,
        };
        try {
            const response = await axiosReq.post('/api/auth/login',loginData);
           
            if (response.status === 200) {
              setMessage({ code: response.status, description: "Authentication successful!" });
              setIsLoading(false);
              const { token, user } = response.data;
              saveUserDataToSessionStorage(token, user, response.data.refreshToken);
              navigate('/dashboard');
          } else {
              setMessage({ code: response.status, description: response.data.message });
              setIsLoading(false);
          }
      } catch (error) {
          setMessage({ code: error.response.status, description: error.response.data.message });
          setIsLoading(false);
      }
    };


    const {alertBanner}= useDisplayAlert(message);

    return { handleSubmit, isLoading, alertBanner};
};

export default useLogIn;