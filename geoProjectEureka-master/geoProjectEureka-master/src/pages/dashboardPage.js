import React, { Fragment } from "react";
import Header from "../components/Header/header";
import useAuthentication from "../hooks/useAuthentication";
import Footer from "../components/Footer/footer";
import Dashboard from "../components/Dashboard/dashboard";
import useGetAllProjects from "../hooks/data/get/useGetAllProjects";
import Loader from "../components/Loader/loader";

const DashboardPage = () => {
    const { getUserInfosFromSessionStorage } = useAuthentication();
    const userInfos = getUserInfosFromSessionStorage();
    const { Data, isLoading } = useGetAllProjects();

    return (
        <Fragment>
            <Header connected={userInfos ? true : false} role={userInfos?.role} />
            <div className="w-auto m-auto pb-10 pt-10 h-min-screen">
                {isLoading ? (
                    <Loader size="xl" />
                ) : (
                    <Dashboard Data={Data} role={userInfos?.role} />
                )}
            </div>
            <Footer />
        </Fragment>
    );
};

export default DashboardPage;