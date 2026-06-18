import React,{ Fragment }  from "react";
import Header from "../components/Header/header";
import Footer from "../components/Footer/footer";
import MyAccountForm from "../components/MyAccountForm/myAccountForm";
import useAuthentication from "../hooks/useAuthentication";
import Loader from "../components/Loader/loader";

const MyAccountPage = () => {
    const {getUserInfosFromSessionStorage}=useAuthentication();
    const userInfos = getUserInfosFromSessionStorage();
    const isLoadingUserInfos = false
    return (
        <Fragment>
            <Header connected={userInfos ? true : false} role={userInfos?.role}/>
            <div className="sm:w-page m-auto pb-10 pt-10  h-min-screen">
                {isLoadingUserInfos ? (
                    <Loader /> // Display loader while fetching user data
                ) : (
                    <div className="bg-light-grey px-6 py-6 rounded-lg shadow-lg">
                        <MyAccountForm userInfosData={userInfos}/>
                    </div>
                )}
            </div>
            <Footer/>
        </Fragment>
    )
}

export default MyAccountPage;