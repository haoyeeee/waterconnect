import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import logo from '../assets/logo.svg';

export default function Navbar() {
  // stick navbar
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/ai", label: "Smart Assistant" },
    // { href: "/map", label: "Water Map" },
    { href: "/travel", label: "Water Navigation" },
    { href: "/education", label: "Water Information" },
    { href: "/about", label: "About" },
  ]

  // scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 64) { 
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${isSticky ? 'fixed top-0 left-0 z-50 w-full backdrop-blur-md bg-background/60 shadow-lg' : 'relative bg-white'} transition-all duration-300 `}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <NavLink to="/">
          <img src={logo} alt="WaterConnect Logo" className="h-6" />
        </NavLink>

        {/* hamburger button */}
        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="hamburger-icon">
            {isOpen ? '✕' : '☰'} 
          </span>
        </button>

        <NavigationMenu className="hidden space-x-8 md:flex">
          {menuItems.map((item) => (
            <NavigationMenuItem key={item.href} className="list-none">
              <NavLink
                to={item.href}
                className={({ isActive }) => 
                  isActive 
                    ? "text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                    : "text-gray-800 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                }
              >
                {item.label}
              </NavLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenu>
      </div>

      {/* hamburger menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.href} className="list-none">
                <NavLink
                  to={item.href}
                  className={({ isActive }) => 
                    isActive 
                      ? "text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                      : "text-gray-800 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  {item.label}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
