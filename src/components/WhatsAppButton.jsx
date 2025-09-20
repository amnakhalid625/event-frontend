import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        <div className="animate-float" style={{ animationDuration: '3s' }}>
          
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 group-hover:opacity-100 animate-ping" style={{ animationDuration: '2s' }}></span>
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 group-hover:opacity-100 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></span>
          
          <div className="relative">
            <a 
              href="https://wa.me/+16162743853" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center p-4 text-white bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp size={28} className="transition-transform duration-300 group-hover:rotate-12" />
            </a>
            
            {/* Tooltip */}
            {isHovered && (
              <div className="absolute right-16 bottom-2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap shadow-xl">
                Chat with us!
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;