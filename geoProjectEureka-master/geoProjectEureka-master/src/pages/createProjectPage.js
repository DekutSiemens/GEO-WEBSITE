import React,{ Fragment }  from "react";
import Header from "../components/Header/header";
import useAuthentication from "../hooks/useAuthentication";
import Footer from "../components/Footer/footer";
import CreateProjectForm from "../components/CreateProjectForm/createProjectForm";

const CreateProjectPage = () => {
    const {getUserInfosFromSessionStorage}=useAuthentication();
    const userInfos = getUserInfosFromSessionStorage();

    return (
        <Fragment>
            <Header connected={userInfos ? true : false} role={userInfos?.role}/>
            
            <div className="w-auto m-auto pb-10 pt-10  h-min-screen">
                <CreateProjectForm/>
            </div>
            
            <Footer/>
        </Fragment>
    )
}

export default CreateProjectPage;