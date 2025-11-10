
import { Link } from 'react-router-dom';
import logo from '../assets/logo-white.svg'

export default function Footer() {
  return (
    <footer className='bg-sky-600'>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 ">

        {/* Top area: Blocks */}
        <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200">

          {/* 1st block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <img src={logo} alt="WaterConnect Logo" className="h-6" />
          </div>

          {/* 2nd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-white font-bold mb-2">Quick Links</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link to="/" className="text-white hover:text-gray-900 transition duration-150 ease-in-out">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/ai" className="text-white hover:text-gray-900 transition duration-150 ease-in-out">Smart Assistant</Link>
              </li>
              <li className="mb-2">
                <Link to="/map" className="text-white hover:text-gray-900 transition duration-150 ease-in-out">Water Navigation</Link>
              </li>
              <li className="mb-2">
                <Link to="/education" className="text-white hover:text-gray-900 transition duration-150 ease-in-out">Water Information</Link>
              </li>
            </ul>
          </div>

          {/* 3rd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-white font-bold mb-2">Support</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link to="/about" className="text-white hover:text-gray-900 transition duration-150 ease-in-out">About Us</Link>
              </li>
            </ul>
          </div>

       

        </div>

        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
        </div>

      </div>
    </footer>
  );
}
