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
  HeartPulse,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { useAuth } from '@/lib/auth';
import VoiceGuidedElement from '@/components/voice-guidance/VoiceGuidedElement';

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useAccessibility();
  const { userDetails } = useAuth();
  const userRole = userDetails?.role || 'customer';

  const menuItems = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: 'Request', icon: <Calendar className="h-5 w-5" />, path: '/request' },
    { name: 'Hubs', icon: <Map className="h-5 w-5" />, path: '/hub-finder' },
    { name: 'Medications', icon: <Pill className="h-5 w-5" />, path: '/medications' },
    { name: 'Wellness', icon: <HeartPulse className="h-5 w-5" />, path: '/wellness' },
    { name: 'Emergency', icon: <Phone className="h-5 w-5" />, path: '/emergency-contacts' },
    { name: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.name === 'Request' && userRole === 'admin') return false;
    return true;
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 md:hidden">
      <VoiceGuidedElement description="Floating menu button">
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </VoiceGuidedElement>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-0"
          >
            <div className="bg-white rounded-lg shadow-lg p-4 grid grid-cols-4 gap-2 w-[280px]">
              {filteredMenuItems.map((item) => (
                <VoiceGuidedElement 
                  key={item.name}
                  description={`${item.name} menu item`}
                >
                  <Link
                    to={item.path}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="bg-primary/10 p-2 rounded-full mb-1">
                      {item.icon}
                    </div>
                    <span className={`text-xs ${settings.largeText ? 'text-sm' : ''}`}>{item.name}</span>
                  </Link>
                </VoiceGuidedElement>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMenu;