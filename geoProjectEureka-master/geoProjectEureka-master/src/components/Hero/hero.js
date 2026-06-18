import React from 'react';
import CustomCarousel from './CustomCarousel';
import heroContent from './heroContent';


const Hero = ({ className }) => {
  return (
    <div className={`hero ${className} bg-light-grey flex flex-col items-center relative`}>
      <CustomCarousel
        images={heroContent.images}
        title={heroContent.title}
        subtitle={heroContent.subtitle}
      />

      <div className="absolute bottom-0 left-0 right-0 flex justify-center mt-20">
        {/* Uncomment the following line if you have implemented Homecard and userInfos */}
        {/* {userInfos && <Homecard />} */}
      </div>


    </div>
  );
}

export default Hero;