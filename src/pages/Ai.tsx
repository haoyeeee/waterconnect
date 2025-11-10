import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import Visitation from '../components/Visitation';

interface FormData {
  transportation: string;
  waterTank: string;
  grayWater: string;
  bathingWater: string;
  travelers: string;
  companions: string[];
  attractions: string[];
  duration: string;
}

// const locationCards = [
//   { title: "Barkers Creek Reservoir", description: "It's a beautiful place to visit for family picnics, fishing, kayaks, canoes and small portable craft (car toppers). ", image: "https://lh5.googleusercontent.com/p/AF1QipNjesCqsEkYMSENfXkWm3dms8g657QNmr3wNboS=w408-h306-k-no", coordinates: "-36.965462, 144.278488" },
//   { title: "Torrumbarry Weir", description: "Torrumbarry Weir also provides water for the Kerang Lakes, an internationally recognised wetland, and is a significant regional tourism and recreational facility.", image: "https://lh5.googleusercontent.com/p/AF1QipPZwSSeURfm-ox7j9WVq-Dv5iUDCgFNnRdDpLQc=w408-h306-k-no", coordinates: "-37.8140, 144.9633" },
//   { title: "Pykes Creek Reservoir", description: "Pykes Creek Reservoir, located west of Melbourne near Ballan, is a very popular recreational area offering opportunities for boating, kayaking, fishing, swimming and picnicking.", image: "https://lh5.googleusercontent.com/p/AF1QipNiD1qHysSh8rlmGC2-VoxTGHABQA--LVT7xury=w408-h272-k-no", coordinates: "-37.8145, 144.9634" },
//   { title: "Lake Boga", description: "Lake Boga is one of the four Victorian mid Murray storages. It is located approximately 40 km north of Kerang and only 16 km southeast of Swan Hill.", image: "https://lh5.googleusercontent.com/p/AF1QipM4XkmZ7S5nHOjYhZ1g4bwvw7b4KWjHAK1-T4FH=w426-h240-k-no", coordinates: "-37.8150, 144.9636" },
//   { title: "Moora Moora Reservoir", description: "Moora Moora Reservoir is a small reservoir in the heart of the Grampians National Park. Recreationally, Moora Moora is especially popular for bush camping, fishing and boating.", image: "https://lh5.googleusercontent.com/p/AF1QipOC3mOdLWVViQfvvpw8W5SaK0fShBC33jCMTrZ0=w408-h306-k-no", coordinates: "-37.8155, 144.9638" },
//   { title: "Lake Fyans", description: "The lake is one of the most important recreational lakes in the region. It hosts a number of activities including sailing, jet skiing, hunting and caravanning.", image: "https://lh5.googleusercontent.com/p/AF1QipMD5AZUUF3iLn6ubJLsNgbwgOESg0T851-iP6W6=w408-h306-k-no", coordinates: "-37.8160, 144.9640" },
// ];

const CaravanQuestionnaire: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    transportation: '',
    waterTank: '',
    grayWater: '',
    bathingWater: '',
    travelers: '1',
    companions: [],
    attractions: [],
    duration: ''
  });
  const [apiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  // const [copiedLocation, setCopiedLocation] = useState('');

  const [showChecklist, setShowChecklist] = useState<boolean>(() => {
    return localStorage.getItem('showChecklist') === 'true';
  });

  const [currentQuestion, setCurrentQuestion] = useState<number>(() => {
    return parseInt(localStorage.getItem('currentQuestion') || '0');
  });

  const [queryResponses, setQueryResponses] = useState<Record<string, string>>(() => {
    const savedResponses = localStorage.getItem('queryResponses');
    return savedResponses ? JSON.parse(savedResponses) : {
      packing_list: '',
      water_usage: '',
      gray_water: '',
      attractions: '',
      road_trip_tips: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('caravanFormData', JSON.stringify(formData));
    localStorage.setItem('showChecklist', showChecklist.toString());
    localStorage.setItem('currentQuestion', currentQuestion.toString());
    localStorage.setItem('queryResponses', JSON.stringify(queryResponses));
  }, [formData, showChecklist, currentQuestion, queryResponses]);

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text);
  //   setCopiedLocation(text);
  //   setTimeout(() => setCopiedLocation(''), 2000);
  // };

  const isOptionSelected = () => {
    const questionKeys: (keyof FormData)[] = [
      'transportation',
      'waterTank',
      'grayWater',
      'bathingWater',
      'travelers',
      'companions',
      'attractions',
      'duration'
    ];
    const currentQuestionKey = questionKeys[currentQuestion];
    return Array.isArray(formData[currentQuestionKey])
      ? (formData[currentQuestionKey] as unknown[]).length > 0
      : formData[currentQuestionKey] !== '';
  };

  // question
  const questions = [
    {
      label: "What is your mode of transportation?",
      component: (
        <select value={formData.transportation} onChange={(e) => setFormData({ ...formData, transportation: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select transportation</option>
          <option value="Recreational vehicle">Recreational vehicle</option>
          <option value="Private car">Private car</option>
          <option value="Walking">Walking</option>
          <option value="Public transportation">Public transportation</option>
          <option value="Bicycle or motorcycle">Bicycle or motorcycle</option>
        </select>
      ),
    },
    {
      label: "Does your mode of transportation have a water supply tank?",
      component: (
        <select value={formData.waterTank} onChange={(e) => setFormData({ ...formData, waterTank: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select option</option>
          <option value="Yes, large capacity water tank">Yes, large capacity water tank</option>
          <option value="Yes, small capacity water tank">Yes, small capacity water tank</option>
          <option value="No">No, it does not have a water tank</option>
        </select>
      ),
    },
    {
      label: "Do you need to manage gray water (used water from sinks, showers, etc.)?",
      component: (
        <select value={formData.grayWater} onChange={(e) => setFormData({ ...formData, grayWater: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      ),
    },
    {
      label: "Will you use the water from the tank for bathing?",
      component: (
        <select value={formData.bathingWater} onChange={(e) => setFormData({ ...formData, bathingWater: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select option</option>
          <option value="Yes">Yes, I will use the water from the tank for bathing</option>
          <option value="No">No, I will bathe elsewhere</option>
        </select>
      ),
    },
    {
      label: "What is the total number of travelers?",
      component: (
        <select value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: e.target.value })} className="w-full p-2 border rounded">
          {[...Array(10).keys()].map((num) => (
            <option key={num} value={num + 1}>{num + 1}</option>
          ))}
        </select>
      ),
    },
    {
      label: "Are there any of the following among your companions?",
      component: (
        ['Children', 'Elderly persons', 'Individuals with mobility issues', 'Pets', 'None of the above'].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.companions.includes(option)}
              onChange={(e) => {
                const selected = e.target.checked
                  ? [...formData.companions, option]
                  : formData.companions.filter((item) => item !== option);
                setFormData({ ...formData, companions: selected });
              }}
            />
            <label>{option}</label>
          </div>
        ))
      ),
    },
    {
      label: "What are your preferences for tourist attractions?",
      component: (
        ['Cultural and historical sites', 'Urban exploration', 'Adventure activities', 'Relaxation', 'Water activities'].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.attractions.includes(option)}
              onChange={(e) => {
                const selected = e.target.checked
                  ? [...formData.attractions, option]
                  : formData.attractions.filter((item) => item !== option);
                setFormData({ ...formData, attractions: selected });
              }}
            />
            <label>{option}</label>
          </div>
        ))
      ),
    },
    {
      label: "How long do you plan for your trip to last?",
      component: (
        <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select duration</option>
          <option value="1 day">1 day</option>
          <option value="2 to 3 days">2 to 3 days</option>
          <option value="4 to 7 days">4 to 7 days</option>
          <option value="More than 7 days">More than 7 days</option>
        </select>
      ),
    },
  ];

  const generateStructuredPrompt = (data: FormData) => {
    let waterManagement = "";
    if (data.waterTank.includes("Yes")) {
      waterManagement = `They have a ${data.waterTank.includes("large") ? "large" : "small"} water tank`;
      if (data.bathingWater.includes("Yes")) {
        waterManagement += " and will use it for bathing";
      }
      if (data.grayWater === "Yes") {
        waterManagement += ". They need to manage gray water";
      }
    }

    const companionInfo = data.companions.length > 0 && !data.companions.includes("None of the above")
      ? `They are traveling with ${data.companions.join(", ").replace(/,([^,]*)$/, ' and$1')}.`
      : "They are traveling alone or with regular adults.";

    const attractionsInfo = data.attractions.length > 0
      ? `They are interested in ${data.attractions.join(", ").replace(/,([^,]*)$/, ' and$1')}.`
      : "";

    return `A group of ${data.travelers} traveler(s) will be traveling by ${data.transportation.toLowerCase()} for ${data.duration.toLowerCase()}. ${companionInfo}

${waterManagement ? `Water management considerations: ${waterManagement}.` : ""}

${attractionsInfo}`;
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => {
      if (prev < questions.length - 1) {
        return prev + 1;
      } else {
        return prev;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentQuestion === questions.length - 1) {
      setIsLoading(true);
      setShowChecklist(true);
      const structuredPrompt = generateStructuredPrompt(formData);
      console.log('Structured prompt:', structuredPrompt);

      const queryTypes = ['packing_list', 'water_usage', 'gray_water', 'attractions', 'road_trip_tips'];
      const responses: Record<string, string> = {};

      for (const queryType of queryTypes) {
        try {
          const response = await fetch('https://9uko9u6qg3.execute-api.us-west-2.amazonaws.com/prod/ask-ai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'aXD6u1pakr8qyIQ8hTEzgaAqwrpX8KgB54MjrGVN'
            },
            body: JSON.stringify({ 
              queryStringParameters: { 
                query: structuredPrompt,
                type: queryType
              } 
            })
          });
    
          const data = await response.json();
          console.log(`API response for ${queryType}:`, data);
          const parsedBody = JSON.parse(data.body);
          responses[queryType] = parsedBody[queryType];
          console.log(parsedBody[queryType]);
          console.log(responses[queryType]);
        } catch (error) {
          console.error(`API request failed for ${queryType}:`, error);
          responses[queryType] = 'Failed to get the answer. Please retry.';
        }
      }

      setQueryResponses(responses);
      console.log("response:", responses);
      console.log("set response:", queryResponses);
      setIsLoading(false);
    } else {
      handleNext();
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleRetry = () => {
    setShowChecklist(false);
    setCurrentQuestion(0);
    setFormData({
      transportation: '',
      waterTank: '',
      grayWater: '',
      bathingWater: '',
      travelers: '1',
      companions: [],
      attractions: [],
      duration: ''
    });
    setQueryResponses({
      packing_list: '',
      water_usage: '',
      attractions: '',
      road_trip_tips: '',
    });
    localStorage.removeItem('caravanFormData');
    localStorage.removeItem('showChecklist');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('queryResponses');
  };

  const renderChecklist = () => (
    <div className="mt-6 p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Your Trip Plan</h2>
      <ul className="list-disc pl-5">
        <li>{`Mode of transportation: ${formData.transportation}`}</li>
        <li>{`Water Tank: ${formData.waterTank}`}</li>
        <li>{`Gray Water Management: ${formData.grayWater}`}</li>
        <li>{`Bathing Plan: ${formData.bathingWater}`}</li>
        <li>{`Number of travelers: ${formData.travelers}`}</li>
        <li>{`Companions: ${formData.companions.join(", ")}`}</li>
        <li>{`Attractions: ${formData.attractions.join(", ")}`}</li>
        <li>{`Duration: ${formData.duration}`}</li>
      </ul>

      {apiResponse && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="text-lg font-bold">API Response</h3>
          <p>{apiResponse}</p>
        </div>
      )}

      <button onClick={handleRetry} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded mx-2">
        Retry
      </button>
    </div>
  );

  const cleanMarkdownContent = (content: string) => {
    return content
      .replace(/\*\*/g, '') 
      .replace(/\*\//g, '') 
      .replace(/^ {4}/gm, ''); 
  };

  const renderQASection = () => (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Ask for Personalized Travel Advice</h2>
      <h3 className=" mb-4 text-blue-600">Please note that while AI strives to provide accurate information, it's always better to verify important details.</h3>
      <div className="grid grid-cols-1 gap-4">
        {[
          { type: 'packing_list', text: 'What should I pack?' },
          { type: 'water_usage', text: 'How should I manage water?' },
          { type: 'gray_water', text: 'How should I address greywater?' },
          { type: 'attractions', text: 'What attractions should I visit?' },
          { type: 'road_trip_tips', text: 'Any road trip tips?' }
        ].map(({ type, text }) => (
          <div key={type} className="mb-4">
            <button
              onClick={() => setActiveQuery(activeQuery === type ? null : type)}
              className="w-full bg-blue-500 text-white p-3 rounded-lg text-left"
            >
              {text}
            </button>
            {activeQuery === type && (
              <div className="mt-2 p-4 bg-gray-100 rounded-lg break-words prose">
                <ReactMarkdown>{cleanMarkdownContent(queryResponses[type])}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      <Visitation />
        <div className="flex justify-center items-center flex-col mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">Ready for a trip? Get Customized Route on Map!</h2>
            <Link to="/travel" className="learn-more-btn">
                <Button className="bg-blue-500 my-4">Water Navigation</Button>
            </Link>
        </div>

        <div className="flex justify-center items-center flex-col mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">Or you want to know more about water?</h2>
            <Link to="/education" className="learn-more-btn">
                <Button className="bg-blue-500 my-4">Water Information</Button>
            </Link>
        </div>
    </div>
  );

  // const renderVisitationsSection = () => {
  //   console.log('Rendering Visitations Section');
  //   console.log('Location Cards:', locationCards);
  
  //   if (!locationCards || locationCards.length === 0) {
  //     return (
  //       <section id="visitations" className="py-12 md:py-20 bg-sky-50">
  //         <div className="container mx-auto text-center mb-12">
  //           <h2 className="text-3xl font-bold mb-4 text-blue-900">No Visitations Available</h2>
  //         </div>
  //       </section>
  //     );
  //   }
  

  

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
  //         <p className="text-xl font-semibold">Loading your personalized travel plan...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto md:p-60">
       
      <h1 className="text-2xl font-bold mb-4">Personalized Travel Plan</h1>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {!showChecklist ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-lg mb-2">{questions[currentQuestion].label}</label>
            {questions[currentQuestion].component}

            {/* Navigation Buttons */}
           <div className="flex justify-between mt-4">
              {currentQuestion > 0 && (
                <button type="button" onClick={handlePrevious} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                  Previous
                </button>
              )}
              <button 
                type="submit" 
                className={`${currentQuestion === questions.length - 1 ? 'bg-green-500' : 'bg-blue-500'} text-white px-4 py-2 rounded ${!isOptionSelected() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isOptionSelected()}
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </form>
          <p className="mt-4 text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
      ) : (
        <>
          {renderChecklist()}
          {/* {renderVisitationsSection()} */}
          {isLoading ? (
            <div className="mt-8 text-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg sm:text-xl font-semibold whitespace-normal px-4">
                Loading your personalized travel advice...This may take about 50 seconds
              </p>
            </div>
          ) : (
            renderQASection()
          )}
        </>
      )}
{/* 
      {copiedLocation && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded">
          Address copied: {copiedLocation}
        </div>
      )} */}
    </div>
  );
};

export default CaravanQuestionnaire;