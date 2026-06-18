const Homecard = () => {
  return (
    <div className="bg-gray-300 p-10 md:p-20">
      <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
        {/* First Card */}
        <div className="w-full md:w-1/2 p-6 bg-white bg-opacity-50 backdrop-blur-lg rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">What we do</h2>
          <p className="text-gray-500 text-center text-2xl">
            Create a robust augmented reality (AR) model integrated with device-to-device (D2D) communication and Internet of Things (IoT) technologies to enhance real-time data sharing and visualization in geothermal exploration.
          </p>
          <p className="text-blue-600 text-center mt-4 mb-3 text-2xl font-semibold">
            Contribute Towards the Course
          </p>
          
        </div>

        {/* Second Card */}
        <div className="w-full md:w-1/2 p-6 bg-white bg-opacity-50 backdrop-blur-lg rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">Impact Goals</h2>
          <ul className="text-gray-500 text-center text-2xl space-y-4">
            <li>Ensure the adoption of the developed technologies in geothermal exploration practices across Africa.</li>
            <li>Strengthen linkages between research and industry to drive innovation in the geothermal sector.</li>
            <li>Contribute to the overall advancement of knowledge and methodologies in geothermal exploration and data analysis.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homecard;