import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import bg from '../assets/scroll.jpg'

export default function CleanWater() {
  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: 'ease-in-out',  
    });
  }, []);

  return (
    <div className=" section accent-background relative bg-fixed bg-center bg-cover h-96" style={{ backgroundImage: `url(${bg})` }}>

        <div className="container relative z-10 py-12 md:py-20 text-center">
            <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="100">

                <div className="text-center text-white max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4 ">Why Clean Water is Important?</h2>
                    <p>
                    One in three people live without sanitation. 
                    This is causing unnecessary disease and death. 
                    Although huge strides have been made with access to clean drinking water, lack of sanitation is undermining these advances. 
                    If we provide affordable equipment and education in hygiene practices, we can stop this senseless suffering and loss of life.
                    </p>
                </div>
            </div>
        </div>
        <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
    </div>
  );
}

