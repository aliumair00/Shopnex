import React from 'react'
import Womens from "./../../assets/womens.jpg"
import Mens from "./../../assets/mens.jpg"
import { Link } from 'react-router-dom'

const Mancollection = () => {
  return (
   <section className='  py-16 px-4 lg:px-0 ' >
    <div className='container mx-auto flex flex-col md:flex-row gap-8 justify-center items-center' >
        {/* Womens collection */}
        <div className='relative w-[500px] h-[500px]'>
            <img src={Womens} alt="Women's Collection" className='w-full h-full object-cover rounded' />
            <div className='absolute bottom-4 left-4 bg-white bg-opacity-90 p-4' >
            <h2 className='text-2xl font-bold text-gray-900 mb-3 ' >
           Women's Collection
            </h2>
            <Link
           to="/collections/all?gender=women" 
           className='text-gray-900 underline' >
           Shop Now 
           </Link>
            </div>
        </div>
        {/* Mens collection */}
        <div className='relative w-[500px] h-[500px]'>
            <img src={Mens} alt="Men's Collection" className='w-full h-full object-cover rounded' />
            <div className='absolute bottom-4 left-4 bg-white bg-opacity-90 p-4' >
            <h2 className='text-2xl font-bold text-gray-900 mb-3 ' >
           Men's Collection
            </h2>
            <Link
           to="/collections/all?gender=men" 
           className='text-gray-900 underline' >
           Shop Now 
           </Link>
            </div>
        </div>

    </div>

   </section>
  )
}

export default Mancollection