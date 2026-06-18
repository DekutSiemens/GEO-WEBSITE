const HomeContent2 = () => {
    return (
        <div className="flex flex-col p-5 space-y-10">
            {/* <!-- First Div --> */}
            <div className="w-full p-6 bg-opacity-50 backdrop-blur-lg rounded-lg flex flex-col justify-center items-center hover:shadow-lg shadow-cyan-500">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">How we Do it</h2>
                <p className="text-gray text-center">
                    
                This project aims to use Augmented Reality (AR), Device to Device (D2D) communication, Internet of Things ( IoT), and User Data Visualization technologies to extend the human senses in capturing and modeling the geothermal site for surface and subsurface exploration in near real time. We propose a 4 part solution; 1) 3D Modeling in AR for geothermal energy reservoir during surface and subsurface geothermal exploration, 2) Develop device to device (D2D) direct exchange of data without the need of an intermediary network in the remote areas for real time Geophysical, Geochemical and Geological site information, 3) Collection and Interpretation of geological, hydro-geochemical and geophysical data from geothermal sites, and 4) Develop security system for geothermal data transmission and communication among explorers and scientists.

                </p>
                <p className="text-blue-600 text-center mt-2 mb-3 shadow-inherit">Contribute Towards the Course</p>
            </div>

            {/* <!-- Second Div --> */}
            <div className="w-full p-6 bg-opacity-50 backdrop-blur-lg rounded-lg flex flex-col justify-center items-center hover:shadow-lg shadow-cyan-500">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Why Do we want to Do It</h2>
                <p className="text-gray text-center">
                Geothermal energy has proven to be reliable, clean and safe, and therefore, its use for power production, heating and cooling is increasing. It is a power source that produces electricity with minimal environmental impact. Exploration activities are going on in different parts of Africa including the Great Rift Valley. With geothermal contributing only 30.87% of the total installed capacity in Kenya, to reduce the overdependence on fossil fuel and hydropower plants, by 2030 Kenya aims to have 5,530 MW of geothermal power or 51% of total capacity. This will make it Kenya's largest source of clean energy by 2030.
                </p>
            </div>
        </div>
    );
};

export default HomeContent2;
