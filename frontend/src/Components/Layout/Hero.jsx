import React from 'react'
import heroimg from '../../assets/ecommerce3.jpg'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='relative' >
        <img src={heroimg} alt="E-commerce Hero" className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover  object-top '  />
        <div  className='absolute inset-0  bg-opacity-20  flex items-center justify-center ' >
            <div className='text-center text-white p-6'>
                <h1 className='text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-4 hover:text-black transition-all ' >
                Shop Smart.<br /> Shop Nex.
                </h1>
                <div className='mt-8' >
                <Link className='bg-white px-4 py-2 rounded-sm text-black hover:bg-black  hover:text-white transition-all  ' >Shop Now</Link>
                </div>
                
                </div> 
        </div>
    </section>
  )
}

export default Hero