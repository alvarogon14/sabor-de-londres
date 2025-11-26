import React, { useState } from 'react';
import { UtensilsCrossed, Share2, Check } from 'lucide-react';

export const Header: React.FC = () => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
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
    <header className="bg-spanish-red text-white py-6 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {/* Abstract pattern decoration */}
        <div className="absolute right-0 top-0 transform translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-spanish-yellow rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-0 transform -translate-x-1/3 translate-y-1/3 w-64 h-64 bg-black rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <UtensilsCrossed className="w-8 h-8 text-spanish-yellow" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Sabor de Londres</h1>
            <p className="text-white/80 text-sm font-medium tracking-wide">THE SPANISH FOOD GUIDE</p>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
          title="Share this map"
        >
          {shared ? <Check className="w-4 h-4 text-spanish-yellow" /> : <Share2 className="w-4 h-4" />}
          <span>{shared ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>
    </header>
  );
};