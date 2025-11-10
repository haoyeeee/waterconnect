import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import bg from '../assets/tapwater.jpg';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export default function TapWater() {
  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: 'ease-in-out',  
    });
  }, []);

  return (
    <div className="section accent-background flex justify-center items-center h-auto bg-gray-100 py-12 md:py-20 mx-auto">
      {/* Wrapper to control max width and center content */}
      <div className="flex flex-col md:flex-row items-center justify-center mx-auto max-w-screen-lg w-full gap-10">
        
        {/* Left side for text content */}
        <div className="flex-1 text-left text-gray-800 px-10" data-aos="fade-right" data-aos-delay="100">
          <h2 className="text-3xl font-bold mb-4">Why Choose Public Water Sources Over Plastic Bottles?</h2>
          <p>
            Melbourne is proud to have the second-best water in the world, offering clean, safe, and sustainable hydration through public fountains, showers, and restrooms.  
            By choosing public water sources, you reduce plastic waste, minimize your environmental footprint, and support Victoria’s commitment to sustainability.  
            Tap into the extensive network of water stations and enjoy high-quality drinking water without the cost—and environmental impact—of plastic bottles. Let's make a difference together for a greener, cleaner future!
          </p>
          <Link to="/education" className="learn-more-btn">
            <Button className="bg-blue-500 my-4">Learn More</Button>
          </Link>
        </div>

        {/* Right side for background image in a smaller rounded container */}
        <div className="flex-1" data-aos="fade-left" data-aos-delay="100">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-cover bg-center rounded-lg shadow-lg mx-auto min-w-full" 
               style={{ backgroundImage: `url(${bg})` }}>
            <div className="h-full w-full bg-blue-900 opacity-30 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
