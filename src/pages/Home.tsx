import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FeaturesBlocks from "@/components/FeaturesBlocks";
import { Button } from "@/components/ui/button";
import bgVideo from '@/assets/bg.mp4';
import CleanWater from "@/components/CleanWater";
// import img1 from '@/assets/1.jpg'
// import img2 from '@/assets/2.jpg'
import TapWater from "@/components/TapWater";
import WaterMap from "./WaterMap";
import GreyWater from '@/components/GreyWater';

export default function Home() {
    const location = useLocation();
    const waterMapRef = useRef(null);
    const featuresBlocksRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.scrollTo === 'water-map') {
            (waterMapRef.current as unknown as HTMLElement)?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);
    // const scrollToFeatures = () => {
    //     (featuresBlocksRef.current as unknown as HTMLElement)?.scrollIntoView({ behavior: 'smooth' });
    // };

    // const firstSectionCards = [
    //     { title: "Why Melbourne's drinking water is so good", description: "Find out where your water comes from and what we’re doing to make sure Melbourne’s water supply is secure and efficient for future generations.", image: img1, link: "https://youtu.be/a22qUABaGbU?si=OyntKswEPQ8Qez0E " },
    //     { title: "How to Use a Waste Disposal Point at a Caravan Park", description: "Using a dump point keeps our environment healthy. It will keep you, other campers and Australia green and clean.", image: img2, link: "https://www.youtube.com/watch?v=dxVnVthKhH8" },
    //     { title: "Caravanners on the move – managing wastewater", description: "Appropriate wastewater management is an important part of caravanning to ensure that public and environmental health is not compromised.", image: "https://www.econetworkps.org/wp-content/uploads/2021/10/greywater7-768x398.jpg.webp", link: "https://www.econetworkps.org/sustainable-living/eco-homes-and-communities/caravan-wastewater/" },
    // ];

    return (
        <div>
            <div className="relative bg-fixed bg-cover bg-center overflow-hidden min-h-s">
                <video autoPlay muted loop className="absolute w-full h-full left-0 top-0 object-cover z-[-1]">
                    <source src={bgVideo} type="video/mp4" />
                </video>
                <div className="flex flex-col w-full items-center justify-center bg-opacity-50 p-8 md:p-12 text-sm text-center max-w-3xl mx-auto min-h-screen">
                        <h1 className="text-2xl sm:text-4xl md:text-lg lg:text-6xl font-bold mb-4 text-white text-shadow-lg">
                            Looking for clean water in Victoria?
                        </h1>
                        <p className="p-2 text-lg sm:text-lg md:text-2xl text-white  text-shadow">
                        We're here to help you find accessible clean water on your journey, and learn more about water protection.
                        </p>
                        <div className="flex justify-center pt-4 space-x-4">
                            <Link to="/education">
                                <Button 
                                    className="bg-blue-300 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 mx-2"
                                >
                                    Learn More
                                </Button>
                            </Link>
                            <Link to="/travel">
                                <Button 
                                    className="bg-blue-500 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 mx-2"
                                >
                                    Plan a Trip
                                </Button>
                            </Link>
                        </div>
                </div>
            </div>

            <div ref={featuresBlocksRef}>
                <FeaturesBlocks />
            </div>
            
            <CleanWater />
            
                {/* 2
                <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto text-center mb-12" data-aos="fade-up">
                        <h2 className="text-3xl font-bold mb-4 text-blue-900">Water Tips</h2>
                    </div>
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {firstSectionCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
                                <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                                    <p className="text-gray-600 mb-4">{card.description}</p>
                                    <a href={card.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn More</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section> */}
            <TapWater />
            <GreyWater />
            <div ref={waterMapRef}>
                <WaterMap />
            </div>
            
            <div className="flex justify-center items-center flex-col mx-auto my-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">Planning a trip? Get some advice from our Smart Assistant!</h2>
                <Link to="/ai" className="learn-more-btn">
                    <Button className="bg-blue-500 my-4">Smart Assistant</Button>
                </Link>
            </div>
        </div>
    );
}
