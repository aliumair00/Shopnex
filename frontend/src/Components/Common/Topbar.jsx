import React from 'react'
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { TiSocialFacebookCircular } from "react-icons/ti";

const Topbar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className='container mx-auto flex justify-between items-center py-4 px-4  ' >
            <div className='hidden md:flex items-center space-x-4' >
                <a href="#" className="hover:text-gray-300">< TbBrandMeta className='h-6 w-6' /></a>
                <a href="#" className="hover:text-gray-300">< IoLogoInstagram  className='h-6 w-6' /></a>
       <a href="#" className="hover:text-gray-300">< TiSocialFacebookCircular  className='h-6 w-6' /></a>
            </div>
            <div className='text-sm text-center  flex-grow' >
               <span>we deliver all over in pakistan.</span> 
            </div>
            <div className='text-sm  hidden md:block ' >
                <a href="tel:1234567890" className='hover:text-green-300' >+923106532531</a>
            </div>

               
        </div>

    </div>
  )
}

export default Topbar