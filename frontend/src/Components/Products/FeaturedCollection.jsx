
import React from 'react'
import { Link } from 'react-router-dom'
import Feature from './../../assets/Featured.jpg'

const FeaturedCollection = () => {
  return (
    <section className="mx-auto container flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 p-8 text-center lg:text-left">
        <h2 className='text-lg font-bold mb-2 text-gray-700'>Comfort and Style</h2>
        <h2 className='text-4xl lg:text-5xl font-bold mb-6'>Apparel made for your everyday life.</h2>
        <p className="text-lg text-gray-600 mb-6">
          Discover high-quality, comfortable clothing that effortlessly blends
          fashion and function. Designed to make you look and feel great every
          day.
        </p>
        <Link to='/collection/all' className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-colors'>
          Shop Now
        </Link>
      </div>
      {/* Right Content */}
      <div className="w-full lg:w-1/2">
        <img src={Feature} alt="featured" className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl" />
      </div>
    </section>
  )
}

export default FeaturedCollection