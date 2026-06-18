import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/homePage";
import Error404 from "../pages/Errors/error404";
import MyAccountPage from "../pages/myAccountPage";
import SignupPage from "../pages/signupPage";
import LoginPage from "../pages/loginPage";
import DashboardPage from "../pages/dashboardPage";
import CreateProjectPage from "../pages/createProjectPage";
import EditProjectPage from "../pages/editProjectPage";
import DetailsPage from "../pages/Detailspage";
import ContactPage from "../pages/ContactPage";
import AboutUsPage from "../pages/AboutUsPage";
import TermsOfUsePage from "../pages/TermsOfUsePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import CookiePolicyPage from "../pages/CookiePolicyPage";

// import Team from "../team/teamCard";
// import AddTeamMember from "../team/teamMemberPage";
// import Profile from "../team/teamProfile";
import Milestones from "../milestones/mileStone";
import GoogleDriveViewer from "../milestones/milestoneViewer";
import DocumentList from "../components/DocumentList";
import Doc from "../components/doc";
// import AddDocument from "../components/addDocument";
import ViewDocument from '../components/viewDocument';
import ImageAnalyzer from "../pages/test";
import ArticleUploadAndRetrieve from "../components/addDocument";
import TeamMemberPage from "../pages/teams";
import GeothermalPredictor from "../pages/GeothermalPredictor/geothermalPredictor";
import PredictionHistory from "../pages/PredictionHistory/predictionHistory";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* GENERAL ROUTES */}

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/edit-project/:id" element={<EditProjectPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/milestoneviewer" element={<GoogleDriveViewer />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
        <Route path="/cookie-policy" element={<CookiePolicyPage/>}/>
        

        
        {/*document routes */}
        {/* <Route path="/document-list" element={<Doc/>}/>
        <Route path="/doc-list" element={<DocumentList/>}/>
        <Route path="/view-doc" element={<ViewDocument/>}/>
        <Route path="/add-doc" element={<AddDocument/>}/> */}
        <Route path="/documents" element={<ArticleUploadAndRetrieve/>}/>

        {/* teams */}
        <Route path="/teams" element={<TeamMemberPage/>}/>

      {/* image analyzer */}
        <Route path="/analyzer" element={<ImageAnalyzer/>}/>
        {/* geothermal prediction */}
          <Route path="/predict" element={<GeothermalPredictor/>}/>
        {/* prediction history */}
          <Route path="/history" element={<PredictionHistory/>}/>



      

        {/* 404 Error Route */}
        <Route path="*" element={<Error404 />} />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;
