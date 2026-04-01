import { Outlet } from "react-router-dom"
import Footer from "../Common/Footer"
import Header from "../Common/Header"
import { FaWhatsapp } from "react-icons/fa";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Userlayout = () => {
  const handleWhatsAppClick = () => {
      const whatsappNumber = "+923106532531";
      const whatsappLink = `https://wa.me/${whatsappNumber}`;
      window.open(whatsappLink, "_blank");
    };

    // useEffect(() => {
    //   const handleScroll = () => {
    //     const scrollThreshold = 200;
    //     if (window.scrollY > scrollThreshold) {
    //       setShowWhatsAppButton(true);
    //     } else {
    //       setShowWhatsAppButton(false);
    //     }
    //   };
  
    //   window.addEventListener("scroll", handleScroll);
  
    //   return () => {
    //     window.removeEventListener("scroll", handleScroll);
    //   };
    // }, []);
  return (
    <>
    <Header/>
    {/* Main content */}
    <main>
      <Outlet/>
      
    </main>
    
        <div
          onClick={handleWhatsAppClick}
          className="bg-green-600 rounded-full animate-bounce w-12 md:w-16 h-12 md:h-16 cursor-pointer flex items-center justify-center fixed bottom-10 right-7 md:right-14"
        >
          <FaWhatsapp className="text-2xl md:text-5xl text-white fa-brands fa-whatsapp"/>
        </div>
      
    {/* Footer */}
    <Footer/>
    </>
  )
}

export default Userlayout