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
  // const [copiedLocation, setCopiedLocation] = useState('');

  const [showChecklist, setShowChecklist] = useState<boolean>(() => {
    return localStorage.getItem('showChecklist') === 'true';
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
    localStorage.setItem('queryResponses', JSON.stringify(queryResponses));
  }, [formData, showChecklist, queryResponses]);

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text);
  //   setCopiedLocation(text);
  //   setTimeout(() => setCopiedLocation(''), 2000);
  // };

  const areAllQuestionsAnswered = () => {
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
    return questionKeys.every(key => {
      return Array.isArray(formData[key])
        ? (formData[key] as unknown[]).length > 0
        : formData[key] !== '';
    });
  };

  const getAnsweredQuestionsCount = () => {
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
    return questionKeys.filter(key => {
      return Array.isArray(formData[key])
        ? (formData[key] as unknown[]).length > 0
        : formData[key] !== '';
    }).length;
  };

  // Question type definition
  interface Question {
    key: keyof FormData;
    label: string;
    render: () => React.ReactNode;
  }

  // question
  const questions: Question[] = [
    {
      key: 'transportation',
      label: "What is your mode of transportation?",
      render: () => (
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
      key: 'waterTank',
      label: "Does your mode of transportation have a water supply tank?",
      render: () => (
        <select value={formData.waterTank} onChange={(e) => setFormData({ ...formData, waterTank: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select option</option>
          <option value="Yes, large capacity water tank">Yes, large capacity water tank</option>
          <option value="Yes, small capacity water tank">Yes, small capacity water tank</option>
          <option value="No">No, it does not have a water tank</option>
        </select>
      ),
    },
    {
      key: 'grayWater',
      label: "Do you need to manage gray water (used water from sinks, showers, etc.)?",
      render: () => (
        <select value={formData.grayWater} onChange={(e) => setFormData({ ...formData, grayWater: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      ),
    },
    {
      key: 'bathingWater',
      label: "Will you use the water from the tank for bathing?",
      render: () => (
        <select value={formData.bathingWater} onChange={(e) => setFormData({ ...formData, bathingWater: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Select option</option>
          <option value="Yes">Yes, I will use the water from the tank for bathing</option>
          <option value="No">No, I will bathe elsewhere</option>
        </select>
      ),
    },
    {
      key: 'travelers',
      label: "What is the total number of travelers?",
      render: () => (
        <select value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: e.target.value })} className="w-full p-2 border rounded">
          {[...Array(10).keys()].map((num) => (
            <option key={num} value={num + 1}>{num + 1}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'companions',
      label: "Are there any of the following among your companions?",
      render: () => (
        <div className="space-y-2">
          {['Children', 'Elderly persons', 'Individuals with mobility issues', 'Pets', 'None of the above'].map((option) => (
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
                className="w-4 h-4"
              />
              <label className="cursor-pointer">{option}</label>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'attractions',
      label: "What are your preferences for tourist attractions?",
      render: () => (
        <div className="space-y-2">
          {['Cultural and historical sites', 'Urban exploration', 'Adventure activities', 'Relaxation', 'Water activities'].map((option) => (
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
                className="w-4 h-4"
              />
              <label className="cursor-pointer">{option}</label>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'duration',
      label: "How long do you plan for your trip to last?",
      render: () => (
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // All questions should be answered before submitting
    if (!areAllQuestionsAnswered()) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsLoading(true);
    setShowChecklist(true);
    const structuredPrompt = generateStructuredPrompt(formData);
    console.log('Structured prompt:', structuredPrompt);

    const API_URL = import.meta.env.VITE_API_AI_URL;

      try {
        // Single API call to get all responses at once
        // Lambda function expects queryStringParameters in the event
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            queryStringParameters: { 
              query: structuredPrompt
            } 
          })
        });

        const data = await response.json();
        console.log('API response:', data);
        
        // Parse the response body
        const parsedBody = JSON.parse(data.body);
        
        if (parsedBody.ok && parsedBody.result) {
          // Extract all answers from result object
          const responses: Record<string, string> = {
            packing_list: parsedBody.result.packing_list || '',
            water_usage: parsedBody.result.water_usage || '',
            gray_water: parsedBody.result.gray_water || '',
            attractions: parsedBody.result.attractions || '',
            road_trip_tips: parsedBody.result.road_trip_tips || '',
          };
          
          setQueryResponses(responses);
          console.log("All responses:", responses);
        } else {
          console.error('API returned error:', parsedBody.error);
          setQueryResponses({
            packing_list: 'Failed to get the answer. Please retry.',
            water_usage: 'Failed to get the answer. Please retry.',
            gray_water: 'Failed to get the answer. Please retry.',
            attractions: 'Failed to get the answer. Please retry.',
            road_trip_tips: 'Failed to get the answer. Please retry.',
          });
        }
      } catch (error) {
        console.error('API request failed:', error);
        setQueryResponses({
          packing_list: 'Failed to get the answer. Please retry.',
          water_usage: 'Failed to get the answer. Please retry.',
          gray_water: 'Failed to get the answer. Please retry.',
          attractions: 'Failed to get the answer. Please retry.',
          road_trip_tips: 'Failed to get the answer. Please retry.',
        });
      } finally {
        setIsLoading(false);
      }
  };
  
  const handleRetry = () => {
    setShowChecklist(false);
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
      gray_water: '',
      attractions: '',
      road_trip_tips: '',
    });
    localStorage.removeItem('caravanFormData');
    localStorage.removeItem('showChecklist');
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

  const renderQASection = () => {
    const qaItems = [
      { type: 'packing_list', title: 'What should I pack?', icon: '📦' },
      { type: 'water_usage', title: 'How should I manage water?', icon: '💧' },
      { type: 'gray_water', title: 'How should I address greywater?', icon: '🚿' },
      { type: 'attractions', title: 'What attractions should I visit?', icon: '🎯' },
      { type: 'road_trip_tips', title: 'Any road trip tips?', icon: '🛣️' }
    ];

    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Personalized Travel Advice</h2>
        <h3 className="mb-4 text-blue-600">Please note that while AI strives to provide accurate information, it's always better to verify important details.</h3>
        
        <div className="grid grid-cols-1 gap-6">
          {qaItems.map(({ type, title, icon }) => (
            <div key={type} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-blue-500 text-white p-4 flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <div className="p-4 bg-gray-50 break-words prose max-w-none">
                {queryResponses[type] ? (
                  <ReactMarkdown>{cleanMarkdownContent(queryResponses[type])}</ReactMarkdown>
                ) : (
                  <p className="text-gray-500">Loading answer...</p>
                )}
              </div>
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
  };

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
    <div className="container mx-auto md:p-8 lg:p-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Personalized Travel Plan</h1>

      {!showChecklist ? (
        <>
          {/* AI Function Introduction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">🤖 AI-Powered Travel Planning Assistant</h2>
            <p className="text-gray-700 mb-3">
              Our intelligent AI assistant is designed to help you plan the perfect water-conscious travel experience in Victoria, Australia. 
              By answering a few simple questions about your travel preferences, transportation, and water management needs, our AI will provide you with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Personalized packing lists</strong> tailored to your trip type and duration</li>
              <li><strong>Water usage recommendations</strong> based on your tank capacity and group size</li>
              <li><strong>Gray water management guidelines</strong> compliant with Victoria's regulations</li>
              <li><strong>Curated attraction suggestions</strong> matching your interests and preferences</li>
              <li><strong>Practical road trip tips</strong> for safe and enjoyable travel</li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              Please answer all questions below to receive your customized travel advice. The AI will analyze your responses and generate comprehensive recommendations in seconds.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {getAnsweredQuestionsCount()} / {questions.length} questions answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(getAnsweredQuestionsCount() / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Questions Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question, index) => {
              const isAnswered = Array.isArray(formData[question.key])
                ? (formData[question.key] as unknown[]).length > 0
                : formData[question.key] !== '';
              
              return (
                <div key={question.key} className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </span>
                    <label className="block text-lg font-semibold text-gray-800 flex-grow">
                      {question.label}
                      {isAnswered && (
                        <span className="ml-2 text-green-500 text-sm">✓</span>
                      )}
                    </label>
                  </div>
                  <div className="ml-11">
                    {question.render()}
                  </div>
                </div>
              );
            })}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button 
                type="submit" 
                className={`${
                  areAllQuestionsAnswered() 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md`}
                disabled={!areAllQuestionsAnswered()}
              >
                {areAllQuestionsAnswered() 
                  ? 'Submit & Get AI Travel Advice' 
                  : `Please answer all ${questions.length} questions to continue`}
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          {renderChecklist()}
          {/* {renderVisitationsSection()} */}
          {isLoading ? (
            <div className="mt-8 text-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg sm:text-xl font-semibold whitespace-normal px-4">
                Loading your personalized travel advice... This may take a few seconds
              </p>
            </div>
          ) : (
            renderQASection()
          )}
        </>
      )}
    </div>
  );
};

export default CaravanQuestionnaire;