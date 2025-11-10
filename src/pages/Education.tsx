import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import img1 from '@/assets/1.jpg'
import img2 from '@/assets/2.jpg'

export default function Education() {
    // const [copiedLocation, setCopiedLocation] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
        });
    }, []);

    // const copyToClipboard = (text: string) => {
    //     navigator.clipboard.writeText(text);
    //     setCopiedLocation(text);
    //     setTimeout(() => setCopiedLocation(''), 2000);
    // };

    const firstSectionCards = [
        { title: "Why Melbourne's drinking water is so good", description: "Find out where your water comes from and what we’re doing to make sure Melbourne’s water supply is secure and efficient for future generations.", image: img1, link: "https://youtu.be/a22qUABaGbU?si=OyntKswEPQ8Qez0E " },
        { title: "10 Benefits of Drinking Tap Water vs Bottled Water", description: "Let’s look at 10 benefits of drinking tap water and you’ll never want to buy bottled water again – no question about it!", image: "https://www.implasticfree.com/wp-content/uploads/2022/05/10-Benefits-of-Drinking-Tap-Water-vs-Bottled-Water-1024x614.jpg", link: "https://www.implasticfree.com/tap-water-vs-bottled-water/" },
        { title: "Three Reasons and Fourteen Proof Points to Drink Tap Water", description: "When compared to market options, tap water lacks carbonated zing, flavor, and variety. It’s boring and plain....at first taste.", image: "https://campuslifeserviceshome.ucsf.edu/sites/campuslifeservices.ucsf.edu/files/inline-images/kathleen-alfred-sotu.jpg", link: "https://campuslifeserviceshome.ucsf.edu/sustainability/news/three-reasons-and-fourteen-proof-points-drink-tap-water" },
    ];

    const secondSectionCards = [
      { title: "Caravanners on the move – managing wastewater", description: "Appropriate wastewater management is an important part of caravanning to ensure that public and environmental health is not compromised.", image: "https://www.econetworkps.org/wp-content/uploads/2021/10/greywater7-768x398.jpg.webp", link: "https://www.econetworkps.org/sustainable-living/eco-homes-and-communities/caravan-wastewater/" },
      { title: "How to Use a Waste Disposal Point at a Caravan Park", description: "Using a dump point keeps our environment healthy. It will keep you, other campers and Australia green and clean.", image: img2, link: "https://www.youtube.com/watch?v=dxVnVthKhH8" },
      { title: "Our Guide To Caravan Waste Management", description: "With great adventures comes great responsibility, especially when it comes to minimising our impact on the Aussie landscape we cherish. ", image: "https://www.caravanrvcamping.com.au/assets/webshop/cms/31/4231-1.jpg?1719809404", link: "https://www.caravanrvcamping.com.au/caravan-waste-management?srsltid=AfmBOorJu_31nN8UN6xaGWOAhkIU2mCJJlH_oKWKCB7NeXwBdRn58WsW" },
    ];

    // const locationCards = [
    //   { title: "Barkers Creek Reservoir", description: "It’s a beautiful place to visit for family picnics, fishing, kayaks, canoes and small portable craft (car toppers). ", image: "https://lh5.googleusercontent.com/p/AF1QipNjesCqsEkYMSENfXkWm3dms8g657QNmr3wNboS=w408-h306-k-no", coordinates: "-36.965462, 144.278488" },
    //   { title: "Torrumbarry Weir", description: "Torrumbarry Weir also provides water for the Kerang Lakes, an internationally recognised wetland, and is a significant regional tourism and recreational facility.", image: "https://lh5.googleusercontent.com/p/AF1QipPZwSSeURfm-ox7j9WVq-Dv5iUDCgFNnRdDpLQc=w408-h306-k-no", coordinates: "-37.8140, 144.9633" },
    //   { title: "Pykes Creek Reservoir", description: "Pykes Creek Reservoir, located west of Melbourne near Ballan, is a very popular recreational area offering opportunities for boating, kayaking, fishing, swimming and picnicking.", image: "https://lh5.googleusercontent.com/p/AF1QipNiD1qHysSh8rlmGC2-VoxTGHABQA--LVT7xury=w408-h272-k-no", coordinates: "-37.8145, 144.9634" },
    //   { title: "Lake Boga", description: "Lake Boga is one of the four Victorian mid Murray storages. It is located approximately 40 km north of Kerang and only 16 km southeast of Swan Hill.", image: "https://lh5.googleusercontent.com/p/AF1QipM4XkmZ7S5nHOjYhZ1g4bwvw7b4KWjHAK1-T4FH=w426-h240-k-no", coordinates: "-37.8150, 144.9636" },
    //   { title: "Moora Moora Reservoir", description: "Moora Moora Reservoir is a small reservoir in the heart of the Grampians National Park. Recreationally, Moora Moora is especially popular for bush camping, fishing and boating.", image: "https://lh5.googleusercontent.com/p/AF1QipOC3mOdLWVViQfvvpw8W5SaK0fShBC33jCMTrZ0=w408-h306-k-no", coordinates: "-37.8155, 144.9638" },
    //   { title: "Lake Fyans", description: "The lake is one of the most important recreational lakes in the region. It hosts a number of activities including sailing, jet skiing, hunting and caravanning.", image: "https://lh5.googleusercontent.com/p/AF1QipMD5AZUUF3iLn6ubJLsNgbwgOESg0T851-iP6W6=w408-h306-k-no", coordinates: "-37.8160, 144.9640" },
    // ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                
                {/* 3 */}
                {/* <section id="visitations" className="py-12 md:py-20 bg-sky-50">
                <div className="container mx-auto text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4 text-blue-900">Visitations with Clean Water</h2>
                </div>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {locationCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
                        <img src={card.image} alt={card.title} width={400} height={300} className="w-full h-48 object-cover" />
                        <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-600 mb-4">{card.description}</p>
                        <button
                            onClick={() => copyToClipboard(card.title)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Copy Address
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </section> */}

                {/* 1 */}
                <section className="py-12 md:py-20 bg-white">
                    <div className="container mx-auto text-center mb-12" data-aos="fade-up">
                        <h2 className="text-3xl font-bold mb-4 text-blue-900">Drinking Water</h2>
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
                </section>

                {/* 2 */}
                <section className="py-12 md:py-20 bg-sky-50">
                <div className="container mx-auto text-center mb-12" data-aos="fade-up">
                        <h2 className="text-3xl font-bold mb-4 text-blue-900">Grey Water</h2>
                    </div>
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {secondSectionCards.map((card, index) => (
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
                </section>

            </main>
            {/* {copiedLocation && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded">
                    Adress copied: {copiedLocation}
                </div>
            )} */}
        </div>
    );
}