import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import bg from '../assets/greywater.jpg';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export default function GreyWater() {
  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: 'ease-in-out',  
    });
  }, []);

  return (
    <div className="section accent-background flex justify-center items-center h-auto bg-white py-12 md:py-20 mx-auto">
      {/* Wrapper to control max width and center content */}
      <div className="flex flex-col md:flex-row items-center justify-center mx-auto max-w-screen-lg w-full gap-10">
        
        {/* Left side for text content */}
        <div className="flex-1" data-aos="fade-right" data-aos-delay="100">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-cover bg-center rounded-lg shadow-lg mx-auto min-w-full" 
               style={{ backgroundImage: `url(${bg})` }}>
            <div className="h-full w-full bg-blue-900 opacity-30 rounded-lg"></div>
          </div>
        </div>


        {/* Right side for background image in a smaller rounded container */}
        <div className="flex-1 text-left text-gray-800 px-10" data-aos="fade-left" data-aos-delay="100">
          <h2 className="text-3xl font-bold mb-4">Why Be Concerned About Greywater?</h2>
          <p>
          Greywater is wastewater generated from everyday activities like bathing, washing dishes, and laundry. 
          People are concerned about greywater because it contains chemicals and organic matter that, if not properly treated, can pollute the environment and contaminate water sources. 
          Proper management of greywater helps protect ecosystems and conserve water resources.
          </p>
          <Link to="/education" className="learn-more-btn">
            <Button className="bg-blue-500 my-4">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
