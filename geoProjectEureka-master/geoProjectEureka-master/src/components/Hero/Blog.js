import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import Profblog from '../../assets/images/Profblog.png'
import Maritablog from '../../assets/images/Maritablog.png'
import Musumbablog from '../../assets/images/Musumbablog.png'
import Motlasiblog from '../../assets/images/Motlasiblog.png'
import Faridblog from '../../assets/images/Faridblog.png' 

const testimonials = [
  {
    id: 1,
    content: "Prof. Jean Bosco, is a groundbreaking initiative aimed at harnessing geothermal energy in Africa using advanced technologies such as Virtual Augmented Reality (VAR) and Machine Learning. Prof. Bosco, a key figure in this endeavor, is at the forefront of integrating cutting-edge innovations to improve energy efficiency and sustainability.",
    name: "Prof. Jean Bosco",
    title: "3D Modeling in Augmented Reality",
    image: Profblog
  },
  {
    id: 2,
    content: "Dr. Nicholas Obuya Mariita, a geologist, professor at Dedan Kimathi University, and director of the Geothermal Energy Training and Research Institute (GeTRI), has been a prominent figure in advancing geothermal energy in Africa. His work aligns closely with the Eureka Geothermal Project, which aims to leverage geothermal's reliability, cleanliness, and minimal environmental impact to address Kenya's energy needs.",
    name: "Dr. Nicholas Obuya Mariita",
    title: "Director, Geothermal Energy Training and Research Institute (GeTRI)",
    image: Maritablog
  },
  {
    id: 3,
    content: "Dr. George Musumba, Dean at Dedan Kimathi University of Technology, is a leader in Ambience Intelligence, AI, and Machine Learning. With a Ph.D. in Computer Science and advanced degrees from University of Nairobi and Kenyatta University, Dr. Musumba drives geothermal innovation through the Eureka Project. His expertise in AR, D2D communication, and IoT enables rapid, offline geothermal site assessments, providing decision-makers with accurate, low-cost solutions that advance sustainable energy in Africa.",
    name: "Dr. George Musumba",
    title: "Development of Systems and Data Security",
    image: Musumbablog
  },
  {
    id: 4,
    content: "Ms. Motlatsi Tolo is a key contributor to the Geothermal Eureka Project, where she utilizes her expertise and extensive network to advance socio-economic progress in sustainable energy. As the Managing Director of Raseto, a South African agribusiness, she leads projects in broiler production, livestock, and horticulture. Her impactful presence on global platforms has been instrumental in driving change.",
    name: "Ms. Motlatsi Tolo",
    title: "Managing Director, Raseto",
    image: Motlasiblog
  },
  {
    id: 5,
    content: "Dr. Benbadis Farid, co-founder of Hopcast, has made significant strides in enabling seamless data sharing for geophysical, geochemical, and geological research in remote areas. His work on the TEFIS project—a platform that provides a unified access point for conducting complex experiments across diverse test facilities—has transformed how researchers conduct multifaceted studies. Featured in the Computer Networks special issue on Future Internet Testbeds, TEFIS allows scientists to share site-specific data in near real-time, facilitating collaboration and insights crucial for advancing research in challenging environments. Through these initiatives, Dr. Farid is helping to push the boundaries of data accessibility and integration in the field of earth sciences.",
    name: "Dr. Benbadis Farid",
    title: "Co-Founder, Hopcast",
    image: Faridblog
  }
]

export default function GeothermalBlogCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <div className="overflow-hidden px-6">
        <div 
          className="flex transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 59}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-[59%] flex-shrink-0 px-4">
              <div className="bg-[#1a2642] rounded-lg p-10 text-white h-full">
                <p className="text-2xl leading-relaxed mb-8 h-56 overflow-y-auto">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-28 h-28 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-orange-500 text-3xl">{testimonial.name}</p>
                    <p className="text-gray-300 text-lg">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={goToPrevious} 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/40 rounded-full p-3 hover:bg-white/60 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button 
        onClick={goToNext} 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/40 rounded-full p-3 hover:bg-white/60 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
      <div className="flex justify-center gap-3 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-4 w-4 rounded-full ${index === currentIndex ? 'bg-orange-500' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
