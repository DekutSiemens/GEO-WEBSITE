import React, { useState } from 'react'
import { Link } from "react-router-dom"
import SiemensLogo from '../assets/images/Siemens-logo.png'
import EurekaImage from '../assets/images/Eureka.png'
import useAuthentication from '../hooks/useAuthentication'
import Header from '../components/Header/header'

const Card = ({ className, children }) => (
  <div className={`bg-grey-300 rounded-lg shadow-md text-black text-3xl ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }) => (
  <div className="px-8 py-6 border-b border-grey-900 text-black">
    {children}
  </div>
)

const CardContent = ({ children }) => (
  <div className="px-8 py-6 text-black">
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <h3 className="text-4xl font-semibold text-black">
    {children}
  </h3>
)

const CardDescription = ({ children }) => (
  <p className="text-3xl text-black">
    {children}
  </p>
)

const Footer = () => {
  return (
    <footer className="footer p-10 bg-sky-700 mt-5">
      <aside> 
        <img src={SiemensLogo} className="w-72 max-w-96" alt="logo" />
      </aside> 
      <nav>
        <h6 className="footer-title text-2xl text-gray-300">Company</h6> 
        <a className="link link-hover text-2xl text-gray-300 hover:text-gray-100" href="https://vmlab.dkut.ac.ke">Home site</a>
        <Link className="link link-hover text-2xl text-gray-300 hover:text-gray-100" to="/about-us">About us</Link>
        <Link className="link link-hover text-2xl text-gray-300 hover:text-gray-100" to="/contact">Contact</Link>
      </nav> 
      <nav>
        <h6 className="footer-title text-2xl text-gray-300">Legal</h6> 
        <Link className="link link-hover text-2xl text-gray-300 hover:text-gray-100" to="/term-of-use">Terms of use</Link>
        <Link className="link link-hover text-2xl text-gray-300 hover:text-gray-100" to="/privacy-policy">Privacy policy</Link>
        <Link className="link link-hover text-2xl text-gray-300 hover:text-gray-100" to="/cookie-policy">Cookie policy</Link>
      </nav>
    </footer>
  )
}


  export default function AboutUsPage() {
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [expandedCard, setExpandedCard] = useState(null)
    const { getUserInfosFromSessionStorage } = useAuthentication()
    const userInfos = getUserInfosFromSessionStorage()
  
    const cardData = [
      {
        title: "What We Do",
        shortDesc: "We develop AR-D2D-IOT-based platforms for capturing, modeling, and sharing geothermal site data in near real-time.",
        fullDesc: "Locating geothermal resources is both an Art and a Science. We propose to develop a model that hybridize Augmented Reality, Internet of Things and Device-to-Device(D2D) data sharing infrastructure technologies to capture, model and share the site data in near real time. Visualizing data in 3D will allow users to uncover trends and patterns that may not be immediately visible with 2D visualizations. While the bulk of the data manipulation and analysis will still be manual, the AR-3D data visualizations will enable the user to make observations in near real time. The product will involve direct communications between users for content distribution to their mobile devices."
      },
      {
        title: "Our Goal",
        shortDesc: "To enhance geothermal exploration efficiency and reduce the time needed for data analysis and decision-making.",
        fullDesc: "Geothermal energy has proven to be reliable, clean and safe, and therefore, its use for power production, heating and cooling is increasing. It is a power source that produces electricity with minimal environmental impact. Exploration activities are going on in different parts of Africa including the Great Rift Valley. With geothermal contributing only 30.87% of the total installed capacity in Kenya, to reduce the overdependence on fossil fuel and hydropower plants, by 2030 Kenya aims to have 5,530 MW of geothermal power or 51% of total capacity. This will make it Kenya's largest source of clean energy by 2030. We propose to use AR and IoT technologies to develop an AR-D2D-IOT-based platform for capturing, modeling and sharing of site data in near real time. Visualizing data in 3D allows users to uncover trends."
      },
      {
        title: "Our Innovation",
        shortDesc: "We combine AR, D2D, and IoT techniques to develop a process that more accurately identifies sites for geothermal exploration.",
        fullDesc: "The future of research and development in the geothermal sector will be driven by data informed decisions and research built upon the quantifiable outcomes of previous endeavors. The existing content distribution networks of geothermal data are cloud-based and highly-centralized. Our product will enable direct communications between users, distributing content to their mobile phones, tablets or personal computers reducing the time for data/content analysis by stakeholders in the geothermal exploration. The geothermal data will be transmitted to other users with or without the internet, hence the terminals will communicate directly exchanging content. Our product uses Augmented Reality (AR), Device to Device (D2D) and Internet of Things (IoT) techniques in analyzing geospatial data to develop a process to more accurately identify sites for geothermal exploration while reducing cost and time. The AR, D2D and IoT methods are expected to be efficient and reliable during modeling, analysis and presentation. The automatic data modeling approach requires an understanding of indicator parameters that indicate the existence and nonexistence of a geothermal site."
      },
      {
        title: "Market Position",
        shortDesc: "We complement existing technologies, enhancing decision-makers' experience in geothermal exploration projects.",
        fullDesc: "The global geothermal energy market size was valued at 6.6 billion US dollars in 2021, and the geothermal energy industry is projected to reach 9.4 billion US dollar by 2027, growing at a compound annual rate of 5.9% from 2022 to 2027. Increasing demand for constant power supply among residential, commercial, and industrial sectors, and growing demand for electricity generation through sustainable means in industries are the major driving factors for the geothermal energy market. The leading players in the global geothermal energy market include Ormat (US), Mitsubishi Heavy Industries (Japan), Baker Hughes Company (US), NIBE Group (Sweden), and SLB (US). Various financial partners have played a key role in the development of geothermal resources in Kenya. Kenya Electricity Generating Company and Geothermal Development Company, together with the Independent Power Producers, aim at raising the country's geothermal output from the current installed capacity of about 1000 MW to 5000 MW by 2030. Our product will complement the existing technologies to enhance the decision makers' experience before investing or abandoning the project. We foresee less competition and more collaboration with the leading players."
      }
    ]
  
    const projectData = [
      {
        title: "Project Duration",
        content: "Start Date: 01/11/2023\nEnd Date: 30/11/2026\nDuration: 36 months"
      },
      {
        title: "WP1: 3D Modeling in Augmented Reality",
        content: "Start date: 01/11/2023\nDuration: 36 months\nWP Leader: Prof Jean Bosco Byiringiro"
      },
      {
        title: "WP3: Geothermal Data Analysis & Interpretation",
        content: "Start date: 01/11/2023\nDuration: 36 months\nWP Leader: Prof Nicholas Obuya Mariita\nDescription: Project Lead and Analysis & Interpretation of Geophysical, Geochemical and Geological Site Data"
      },
      {
        title: "WP4: Development of Data Security Systems",
        content: "Start date: 01/11/2023\nDuration: 36 months\nWP Leader: Dr. George Musumba\nDescription: Development of Systems and Data Security"
      },
    ]
  return (
    <div className="flex flex-col min-h-screen bg-grey-900">
      <Header connected={userInfos ? true : false} role={userInfos?.role}/>
      <main className="flex-grow">
        <div className="min-h-screen bg-white text-black p-8">
          <div className="max-w-7xl mx-auto"> {/* Increased max-width to accommodate larger text */}
            <h1 className="text-7xl font-bold mb-8 text-black">About Our Project</h1>
            <p className="mb-8 text-3xl text-black leading-relaxed">
              We aim to revolutionize geothermal exploration using cutting-edge technologies. Our project focuses on harnessing the vast geothermal potential in Africa.
            </p>
            <button 
              className="text-3xl text-black hover:text-blue-300 flex items-center mb-10"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show Less' : 'Learn More'} <span className="ml-2">→</span>
            </button>
            
            {showFullDescription && (
              <div className="mt-6 text-3xl mb-10 text-black space-y-6 leading-relaxed">
                <p>There is a vast and untapped geothermal potential in Africa. The Kenyan Rift valley forms part of the larger East Africa Rift system (EARS) which runs from Afar triple junction in Djibouti to Beira in Mozambique. In South Africa, the presence of over 87 hot springs are surface manifestations of accessible underground hydrothermal reservoirs in the Cape Fold Belt, across the Karoo, and in the Limpopo Belt.</p>
                <p>The need to meet world energy demands while preserving a sustainable environment has resulted in a shift of focus to renewable energy sources. In Kenya, the total installed capacity as of June 2022 stood at 3,074.34 MW with geothermal contributing 949.13MW, accounting for 30.87% of the total installed capacity.</p>
                <p>Our project aims to use Augmented Reality (AR), Device to Device (D2D) communication, Internet of Things (IoT), and User Data Visualization technologies to extend the human senses in capturing and modeling geothermal sites for surface and subsurface exploration in near real-time.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {cardData.map((card, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {card.shortDesc}
                    </CardDescription>
                    <button 
                      className="text-2xl text-blue-600 hover:text-blue-800 mt-6"
                      onClick={() => setExpandedCard(expandedCard === card.title ? null : card.title)}
                    >
                      {expandedCard === card.title ? 'Show Less' : 'Learn More'}
                    </button>
                    {expandedCard === card.title && (
                      <div className="mt-6 text-3xl text-black leading-relaxed">
                        {card.fullDesc}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-6xl font-bold mt-20 mb-10 text-black">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projectData.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <pre className="whitespace-pre-line font-sans text-3xl leading-relaxed">{item.content}</pre>
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Our Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={EurekaImage} alt="Eureka - Revolutionizing Geothermal Exploration" className="w-full mb-8" />
                  <CardDescription>
                    Revolutionizing Geothermal Exploration
                  </CardDescription>
                  <p className="mt-6 text-3xl text-black leading-relaxed">
                    Our technology aims to significantly reduce exploration costs and time, making geothermal energy more accessible and viable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}