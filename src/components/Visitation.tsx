import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Visitation() {
    const [copiedLocation, setCopiedLocation] = useState('');
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        window.scrollTo(0, 0);

        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
        });
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLocation(text);
        setTimeout(() => setCopiedLocation(''), 2000);
    };

    const handleImageError = (index: number) => {
        setImageErrors(prev => new Set(prev).add(index));
    };

    const locationCards = [
      { title: "Barkers Creek Reservoir", description: "It’s a beautiful place to visit for family picnics, fishing, kayaks, canoes and small portable craft (car toppers). ", image: "https://lh5.googleusercontent.com/p/AF1QipNjesCqsEkYMSENfXkWm3dms8g657QNmr3wNboS=w408-h306-k-no", coordinates: "-36.965462, 144.278488" },
      { title: "Torrumbarry Weir", description: "Torrumbarry Weir also provides water for the Kerang Lakes, an internationally recognised wetland, and is a significant regional tourism and recreational facility.", image: "https://lh5.googleusercontent.com/p/AF1QipPZwSSeURfm-ox7j9WVq-Dv5iUDCgFNnRdDpLQc=w408-h306-k-no", coordinates: "-37.8140, 144.9633" },
      { title: "Pykes Creek Reservoir", description: "Pykes Creek Reservoir, located west of Melbourne near Ballan, is a very popular recreational area offering opportunities for boating, kayaking, fishing, swimming and picnicking.", image: "https://lh5.googleusercontent.com/p/AF1QipNiD1qHysSh8rlmGC2-VoxTGHABQA--LVT7xury=w408-h272-k-no", coordinates: "-37.8145, 144.9634" },
      { title: "Lake Boga", description: "Lake Boga is one of the four Victorian mid Murray storages. It is located approximately 40 km north of Kerang and only 16 km southeast of Swan Hill.", image: "https://lh5.googleusercontent.com/p/AF1QipM4XkmZ7S5nHOjYhZ1g4bwvw7b4KWjHAK1-T4FH=w426-h240-k-no", coordinates: "-37.8150, 144.9636" },
      { title: "Moora Moora Reservoir", description: "Moora Moora Reservoir is a small reservoir in the heart of the Grampians National Park. Recreationally, Moora Moora is especially popular for bush camping, fishing and boating.", image: "https://lh5.googleusercontent.com/p/AF1QipOC3mOdLWVViQfvvpw8W5SaK0fShBC33jCMTrZ0=w408-h306-k-no", coordinates: "-37.8155, 144.9638" },
      { title: "Lake Fyans", description: "The lake is one of the most important recreational lakes in the region. It hosts a number of activities including sailing, jet skiing, hunting and caravanning.", image: "https://lh5.googleusercontent.com/p/AF1QipMD5AZUUF3iLn6ubJLsNgbwgOESg0T851-iP6W6=w408-h306-k-no", coordinates: "-37.8160, 144.9640" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <section id="visitations" className="py-12 md:py-20 bg-sky-50">
                <div className="container mx-auto text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4 text-blue-900">Visitations with Clean Water</h2>
                </div>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {locationCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" data-aos="fade-up" data-aos-delay={index * 100}>
                        {imageErrors.has(index) ? (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Image unavailable</p>
                                </div>
                            </div>
                        ) : (
                            <img 
                                src={card.image} 
                                alt={card.title} 
                                width={400} 
                                height={300} 
                                className="w-full h-48 object-cover"
                                onError={() => handleImageError(index)}
                                loading="lazy"
                            />
                        )}
                        <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-600 mb-4 flex-grow">{card.description}</p>
                        <button
                            onClick={() => copyToClipboard(card.title)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-auto"
                        >
                            Copy Address
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </section>
            </main>
            {copiedLocation && (
                <div className="fixed left-4 bottom-4 bg-green-500 text-white p-2 rounded">
                    Address copied: {copiedLocation}. Now you can go to map and use it as a destination.
                </div>
            )}
        </div>
    );
}