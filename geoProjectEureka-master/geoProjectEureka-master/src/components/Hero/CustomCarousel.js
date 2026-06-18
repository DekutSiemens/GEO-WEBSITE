import React, { useState, useEffect } from 'react'

const CustomCarousel = ({ images, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">{title}</h1>
        <p className="text-xl md:text-2xl">{subtitle}</p>
      </div>

      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-black p-2 rounded-full transition-colors duration-300"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-black p-2 rounded-full transition-colors duration-300"
        onClick={goToNext}
        aria-label="Next slide"
      >
        &#10095;
      </button>

    </div>
  )
}

export default CustomCarousel