import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import bg from '../assets/team.jpg';

export default function About() {
    useEffect(() => {
        AOS.init({
          duration: 800, 
          easing: 'ease-in-out',  
        });
      }, []);
    
      return (
        <div className="flex flex-col min-h-screen bg-sky-50 justify-center items-center">
            <section id="services" className="services section py-12 md:py-20  ">
            {/* Section Title */}
                <div className="container mx-auto text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4 text-blue-900">Our Team</h2>
                </div>
            
                <div className="container mx-auto text-center mb-12 max-w-3xl" data-aos="fade-up" data-aos-delay="100">
                    <p className="font-light mb-4 text-lg text-blue-950">
                    As part of our commitment to the Sustainable Development Goals, we are dedicated to ensuring people have access to clean water.
                    </p>
                    <div className="flex-1" data-aos="fade-left" data-aos-delay="100">
                      <div className="w-64 h-64 md:w-80 md:h-80 bg-cover bg-center rounded-lg shadow-lg mx-auto min-w-full" 
                          style={{ backgroundImage: `url(${bg})` }}>
                        <div className="h-full w-full bg-blue-900 opacity-30 rounded-lg"></div>
                      </div>
                    </div>
                </div>
            </section>
        </div>
      );
}