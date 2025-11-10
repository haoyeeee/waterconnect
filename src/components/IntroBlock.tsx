import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

export default function IntroBlock() {
  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: 'ease-in-out',  
    });
  }, []);

  return (
    <section id="services" className="services section py-12 md:py-20 bg-sky-50">
      {/* Section Title */}
      <div className="container mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">Our Objectives</h2>
      </div>

      <div className="container mx-auto text-center mb-12 max-w-3xl" data-aos="fade-up" data-aos-delay="100">
        <p className="font-light mb-4 text-lg text-blue-950">
        As part of our commitment to the Sustainable Development Goals, we are dedicated to ensuring people have access to clean water.
        </p>
        <p className="font-light text-lg text-blue-950">
        Our website serves as a reliable navigaion tool, pinpointing drinking fountains and refill stations for travelers on their move. Whether you're exploring bustling city streets or serene parklands, WaterConnect makes staying hydrated easy and convenient.
        </p>
      </div>
    </section>
  );
}

