import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../Carousel/carousel";
import ButtonWithVerification from "../ButtonWithVerification/buttonWithVerification";
import useDeleteProject from "../../hooks/data/post/useDeleteProject";
import useAuthentication from "../../hooks/useAuthentication";


const Card = ({ mediaFiles, date, title, geology, geochemistry, geophysics, autor, id, datas, role, userId}) => {
    const { handleDeleteProject, isLoadingDeleteProject, alertBannerDeleteProject } = useDeleteProject();
    const { getUserInfosFromSessionStorage } = useAuthentication();
    const userInfos = getUserInfosFromSessionStorage();
    const navigate = useNavigate()
    
    const handleEditProject = (id) => {
        navigate(`/edit-project/${id}`);
      }; 

    const isPossibleDelete = role === "admin" ? true : userId === userInfos.id;
    
    const handleSeeMoreDetails = (id, mediaFiles) => {
    
        navigate(`/details`, { state : {itemId: id , mediaFiles:mediaFiles}});
    };

    return (
        <div>
            {alertBannerDeleteProject && alertBannerDeleteProject}
            <div className="bg-light-grey max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded shadow-xl m-4">
                <Carousel mediaFiles={mediaFiles} />

                <div className={`px-6 py-4`}>
                    <div className="font-bold text-black text-xl mb-2 truncate">{title} - {date}</div>
                    <p className="text-gray-700 text-base line-clamp-3">
                        <span className="font-bold underline">Geology :</span><br />
                        {geology}
                    </p>
                    <p className="text-gray-700 text-base line-clamp-3">
                        <span className="font-bold underline">Geochemistry :</span><br />
                        {geochemistry}
                    </p>
                    <p className="text-gray-700 text-base line-clamp-3">
                        <span className="font-bold underline">Geophysics :</span><br />
                        {geophysics}
                    </p>
                </div>

                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{autor}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 pb-2">
                    <div className="col-span-1"></div>                    
                    <div className="col-span-1 flex justify-center space-x-4">
                    <button 
                        className="btn bg-medium-green hover:bg-light-green text-white border-none px-4 py-2 rounded-md"
                        onClick={() => handleEditProject(id)}>
                        Edit Details
                    </button>
                    
                    <button 
                        className="btn bg-medium-blue hover:bg-light-blue text-white border-none px-4 py-2 rounded-md"
                        onClick={() => handleSeeMoreDetails(id, mediaFiles)}>
                        See more details
                    </button>
                    
                    {isPossibleDelete && (
                        <div className="col-span-1 flex items-center justify-end pr-2">
                            <ButtonWithVerification 
                                query={() => handleDeleteProject(id)}
                                isLoading={isLoadingDeleteProject} 
                                id={id} 
                            />
                        </div>
                    )}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Card;