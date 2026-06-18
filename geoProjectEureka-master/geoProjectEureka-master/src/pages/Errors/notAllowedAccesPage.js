import React,{ Fragment }  from "react";
import Header from "../../components/Header/headerFake";
import Footer from "../../components/Footer/footer";
import TitleFade from "../../components/TitleFade/titleFade";


const NotAllowedAccessPage = () => {


    return (
        <Fragment>
            <Header/>
            <div className="min-h-screen">
                <TitleFade title={"Access denied !"}/>
            </div>
            <Footer/>
        </Fragment>
    )
}

export default NotAllowedAccessPage;