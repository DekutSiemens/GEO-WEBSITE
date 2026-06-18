import React from 'react'
import geothermalImage1 from '../../assets/images/geothermal1.png'


export default function GeothermalHeroSection() {
  const features = [
    {
      title: 'NETWORK',
      description: 'Become a part of the Global Geothermal Community and join the network of passionate geothermal lovers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'COLLABORATE',
      description: 'Become acquainted and collaborate with geothermal experts from around the world',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'EDUCATE AND LEARN',
      description: 'Educate yourself about Geothermal Energy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
    },
    {
      title: 'PARTICIPATE',
      description: 'Take the opportunity to shape the global renewable agenda',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={geothermalImage1}
          alt="Geothermal energy concept"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-2/3 space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="bg-white bg-opacity-20 p-3 rounded-full transition-all duration-300 group-hover:bg-opacity-30">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
                {index < features.length - 1 && (
                  <div className="absolute left-6 mt-16 w-0.5 h-12 bg-white bg-opacity-20"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 text-right">
            <div className="space-y-4">
              <div>
                <h2 className="text-5xl font-bold">~5000</h2>
                <p className="text-sm text-gray-300">Members Worldwide</p>
              </div>
              <div>
                <h2 className="text-5xl font-bold">31</h2>
                <p className="text-sm text-gray-300">Affiliated Organizations</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded hover:bg-opacity-90 transition-colors duration-300">
                Join us!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}