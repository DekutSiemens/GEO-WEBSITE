import React,{ Fragment }  from "react";
import Header from "../components/Header/headerFake";
import LoginForm from "../components/LoginForm/loginForm";
import { Link } from "react-router-dom";
import logo from "../assets/images/Siemens-logo.png"
import Footer from "../components/Footer/footer";

const LoginPage = () => {
    return (
        <Fragment>
            <Header/>
            <div className="sm:w-page m-auto pb-10">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm pt-12">
                        <Link to="/">
                        <img
                            className="mx-auto w-48"
                            src={logo}
                            alt="Logo"
                            />
                    </Link>
                        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight ">
                        Sign in to your account
                        </h2>
                </div>

                <LoginForm/>
                
                <p className="mt-1 text-center text-sm text-gray-500">
                    No account ?{' '}
                    <Link to="/signup" className="font-semibold leading-6 text-medium-blue hover:text-light-blue">
                    Sign Up
                    </Link>
                </p>
            </div>
            <Footer/>
        </Fragment>
    )
}

export default LoginPage;