import React,{ Fragment }  from "react";
import SignupForm from "../components/SignupForm/signupForm";
import TitleFade from "../components/TitleFade/titleFade";
import Header from "../components/Header/headerFake";
import Footer from "../components/Footer/footer";
import img from "../assets/images/1.jpg"

const SignupPage = () => {
    return (
        <Fragment>
            <Header/>
                 <div className="flex justify-between mx-10 my-10 pb-3 pt-4 ">
                {/* First div with form */}
                <div className="w-full lg:w-1/2 bg-white  p-6 rounded-lg">
                    <h1 className="text-4xl text-center text-blue-600 font-semibold mb-4" >Create your account</h1>
                    <SignupForm />
                </div>

                {/* Second div with image */}
                <div className="hidden lg:block w-full lg:w-1/2 bg-white  p-6 rounded-lg ml-6">
                    <h1 className="text-4xl text-center text-blue-600 font-semibold mb-4">Geothermal Survey Portal</h1>
                    <h1 className="text-2xl text-center text-blue-600 font-semibold mb-4">create your account</h1>
                    <img
                    src={img}
                    alt="Account Image"
                    className="h-[60vh] w-full object-cover rounded-lg "
                    />
                </div>
                </div>

            <Footer/>
        </Fragment>
    )
}

export default SignupPage;