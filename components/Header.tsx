import React, { useState } from 'react';
import { UtensilsCrossed, Share2, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface HeaderProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isCollapsed = false, onToggle }) => {
  const [shared, setShared] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: 'Sabor de Londres',
      text: 'Find the best authentic Spanish restaurants in London with this AI map!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <header 
      className={`bg-spanish-red text-white shadow-lg relative overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'py-2' : 'py-6'
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {/* Abstract pattern decoration */}
        <div className="absolute right-0 top-0 transform translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-spanish-yellow rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-0 transform -translate-x-1/3 translate-y-1/3 w-64 h-64 bg-black rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-white/10 rounded-lg backdrop-blur-sm transition-all ${isCollapsed ? 'p-1.5' : ''}`}>
            <UtensilsCrossed className={`text-spanish-yellow transition-all ${isCollapsed ? 'w-5 h-5' : 'w-8 h-8'}`} />
          </div>
          <div className={isCollapsed ? 'hidden md:block' : ''}>
            <h1 className={`font-serif font-bold tracking-tight transition-all ${isCollapsed ? 'text-xl' : 'text-3xl'}`}>
              Sabor de Londres
            </h1>
            {!isCollapsed && (
              <p className="text-white/80 text-sm font-medium tracking-wide">THE SPANISH FOOD GUIDE</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm font-medium transition-all active:scale-95 ${
              isCollapsed ? 'px-3 py-1.5' : 'px-4 py-2'
            }`}
            title="Share this map"
          >
            {shared ? <Check className="w-4 h-4 text-spanish-yellow" /> : <Share2 className="w-4 h-4" />}
            {!isCollapsed && <span>{shared ? 'Link Copied!' : 'Share'}</span>}
          </button>
          
          {onToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-all active:scale-95"
              title={isCollapsed ? 'Expand header' : 'Collapse header'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};