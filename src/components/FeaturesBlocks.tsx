import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

export default function FeaturesBlocks() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: 'ease-in-out',  
    });
  }, []);

  const handleWaterMapClick = () => {
    navigate('/', { state: { scrollTo: 'water-map' } });
  };

  const featureCards = [
    {
      title: "Nearby Water",
      description: "Find available water amenities",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="80" height="80">
          <path fill="#74C0FC" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/>
        </svg>
      ),
      onClick: handleWaterMapClick
    },
    {
      title: "Smart Assistant",
      description: "Help you plan a trip",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="80" height="80">
          <path fill="#74C0FC" d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"/>
        </svg>
      ),
      link: "/ai"
    },
    {
      title: "Water Navigation",
      description: "Customize your trip route",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="80" height="80">
          <path fill="#74C0FC" d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
        </svg>
      ),
      link: "/travel"
    },
    {
      title: "Water Information",
      description: "Learn more about water conservation",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="80" height="80">
          <path fill="#74C0FC" d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
        </svg>
      ),
      link: "/education"
    },
  ];

  return (
    <section id="services" className="services section py-12 md:py-20 bg-sky-50">
      {/* Section Title */}
      {/* <div className="container mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">Our Features</h2>
      </div> */}

      <div className="container mx-auto pt-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* IntroBlock content */}
          <div className="lg:w-1/3" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Our Objectives</h2>
            <p className="font-light mb-4 text-lg text-blue-950">
              As part of our commitment to the Sustainable Development Goals, we are dedicated to ensuring people have access to clean water.
            </p>
            <p className="font-light text-lg text-blue-950">
              Our website serves as a reliable navigation tool, pinpointing drinking fountains and refill stations for travelers on their move. Whether you're exploring bustling city streets or serene parklands, WaterConnect makes staying hydrated easy and convenient.
            </p>
          </div>

          {/* Feature cards */}
          <div className="lg:w-2/3">
            <div className="grid gap-6 md:grid-cols-2 items-start">
              {featureCards.map((card, index) => (
                <div key={index} onClick={card.onClick || (() => navigate(card.link))} className="block">
                  <div className="relative group bg-white p-6 rounded-lg shadow-lg overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                    <div className="absolute inset-0 bg-blue-500 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="icon mb-8">
                        {card.icon}
                      </div>
                      <h4 className="text-xl font-semibold mb-2 text-black group-hover:text-white transition-colors duration-500">{card.title}</h4>
                      <p className="text-gray-600 group-hover:text-white transition-colors duration-500">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}