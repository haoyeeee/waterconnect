import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WaterMap from './pages/WaterMap';
import About from './pages/About';
import Education from './pages/Education';
import CaravanQuestionnaire from './pages/Ai';
import Travel from './pages/Travel';
import Notfound from './pages/Notfound';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';

// import { useState } from 'react';

function App() {
  // const [password, setPassword] = useState(''); 
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const correctPassword = 'tp33'; // Set your correct password here

  // const handleSubmit = (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
  //   if (password === correctPassword) {
  //     setIsAuthenticated(true);
  //   } else {
  //     alert('Incorrect password');
  //   }
  // };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen p-4">
  //       <h2 className="mb-5 text-center text-2xl sm:text-lg">Please enter password</h2>
  //       <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
  //         <input
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           placeholder="Enter password"
  //           className="p-2 mb-4 text-base bg-blue-100 w-full"
  //           autoComplete="off"
  //         />
  //         <button type="submit" className="p-2 w-full bg-blue-500 text-white">
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   );
  // }
  

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<WaterMap />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/education" element={<Education />} />
          <Route path="/ai" element={<CaravanQuestionnaire />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
        <Footer />
        <Toaster />
      </Router>
    </>
  );
}

export default App;
