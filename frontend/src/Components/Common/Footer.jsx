import React from 'react'
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className='border-t border-gray-200  py-12' >
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0 ' >
        <div>
            <h3 className='text-lg text-gray-800 mb-4' >Newsletter </h3>
            <p className='text-gray-500 mb-4' >
                be the first to hear about new products, exclusive events and online orders. 
            </p>
            <p className='font-medium text-gray-600  text-sm mb-6 ' >
                sign up and get 10% off your first order.
            </p>
            {/* Newsletter form */}
            <form  className='flex items-center' action="">
                <input 
                type="email"
                 placeholder='Enter your email' 
                 name=""
                  id=""
                  className='p-2 w-64 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
                  required
                   />
                   <button type='submit' className='bg-black text-white px-6 py-2 rounded-r-md font-medium hover:bg-gray-800 transition-all'  >
                    Subscribe
                   </button>

            </form>
        </div>
        <div className=' ml-7 ' >
            <h3 className='text-lg text-gray-800 mb-4 ' >Shop</h3>
            <ul className='space-y-2 text-gray-600  '>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >Men's top Wear</Link>
                </li>
          
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >Women's top Wear</Link>
                </li>
            
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >Men's bottom Wear</Link>
                </li>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >Women's bottom Wear</Link>
                </li>
                </ul>
            
        </div>
        {/* support links */}
        <div className='  ' >
            <h3 className='text-lg text-gray-800 mb-4 ' >Support</h3>
            <ul className='space-y-2 text-gray-600  '>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >Contact Us</Link>
                </li>
          
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >About Us</Link>
                </li>
            
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >FAQs</Link>
                </li>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors " >Features</Link>
                </li>
                </ul>

        </div>
        {/* Follow links */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4' >Follow Us</h3>
            <div className='flex items-center space-x-4 mb-6 '>
                <a href="https://www.facebook.com" 
                target='blank'
                rel='noopener noreferrer'
                 className='hover:text-gray-500' >
      <TbBrandMeta  className='h-5 w-5' />
                </a>
                <a href="https://www.instagram.com" 
                target='blank'
                rel='noopener noreferrer'
                 className='hover:text-gray-500' >
      <IoLogoInstagram  className='h-5 w-5' />
                </a>
                <a href="https://www.twitter.com" 
                target='blank'
                rel='noopener noreferrer'
                 className='hover:text-gray-500' >
      <RiTwitterXLine  className='h-5 w-5' />
                </a>
                </div>
                <p>Call Us</p>
                <p className='mt-2 font-medium ' >   
                    <FiPhoneCall className='inline-block mr-2 w-5 h-5  hover:text-gray-800 ' />
                    +923106532531

                </p>
        </div>
       
    </div>
    {/* footer bottom */}
    <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6 ' >
        <p className='text-gray-500 text-sm tracking-tight text-center' >2025 All Right Reserved.  </p>
    </div>
    </footer>
  )
}

export default Footer