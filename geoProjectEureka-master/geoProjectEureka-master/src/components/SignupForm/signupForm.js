import React,{useState} from 'react'
import Password from '../Password/password';
import useSignUp from '../../hooks/data/post/useSignUp';
import Input from '../Input/input';
import ButtonValidationForm from '../ButtonValidationForm/buttonValidationForm';
import signUpFormData from '../../formData/signUpFormData';
import { Link } from 'react-router-dom';

const SignupForm = () => {

    const [isPasswordValid,setIsPasswordValid] = useState(false);

    const handlesetIsPasswordValid = (value) => {
        setIsPasswordValid(value)
    } 

    const {handleSubmit, isLoading, alertBanner} = useSignUp();

    const inputs = signUpFormData.map((input, index)=>{
    if (input.type === "password") {
        return  <Password
        title={input.title}
        id={input.id}
        type={input.type}
        size={input.size}
        isRequired={input.isRequired}
        handlesetIsPasswordValid={handlesetIsPasswordValid}
        key={index}
        />
    }else{
    return <Input
        title={input.title}
        id={input.id}
        type={input.type}
        size={input.size}
        isRequired={input.isRequired}
        options={input.type === "select" && input.options}
        key={index}
    />
}}
    )
    
  return (            
      <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)}>
        {alertBanner && alertBanner}
            <div className="border-b border-gray-900/10 pb-2">
            <h2 className="text-xl text-center text-blue-600 font-semibold leading-2 pb-2 pt-2">Personal informations :</h2>
                {inputs}
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6 pb-2">
                <Link to="/login" className="text-sm font-semibold leading-6 ">
                    back
                </Link>
                <ButtonValidationForm
                    isLoading={isLoading} 
                    isPasswordValid={isPasswordValid}   
                    title={"Continue"}  
                />
            </div>
    </form>
  )
}

export default SignupForm;