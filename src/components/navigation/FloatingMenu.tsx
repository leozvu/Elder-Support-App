import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Map, 
  Settings, 
  User, 
  Menu, 
  X, 
  Pill, 
  Heart, 
  Phone
} from 'lucide-react';

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: 'Request', icon: <Calendar className="h-5 w-5" />, path: '/request' },
    { name: 'Hubs', icon: <Map className="h-5 w-5" />, path: '/hub-finder' },
    { name: 'Medications', icon: <Pill className="h-5 w-5" />, path: '/medications' },
    { name: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 md:hidden">
      <Button
        variant="default"
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute bottom-20 left-0">
          <div className="bg-white rounded-lg shadow-lg p-4 grid grid-cols-3 gap-2 w-[220px]">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <div className="bg-primary/10 p-2 rounded-full mb-1">
                  {item.icon}
                </div>
                <span className="text-xs">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;