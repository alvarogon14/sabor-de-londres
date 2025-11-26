import React from 'react';
import { GroundingChunk } from '../types';
import { MapPin, ExternalLink, Star } from 'lucide-react';

interface PlaceCardProps {
  chunk: GroundingChunk;
  index: number;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ chunk, index }) => {
  if (!chunk.maps) return null;

  const { title, uri, placeAnswerSources } = chunk.maps;
  
  // Extract snippet if available
  const reviewSnippet = placeAnswerSources?.reviewSnippets?.[0]?.content;
  
  // Create a placeholder image URL that is deterministic based on the index to prevent flicker
  const imageUrl = `https://picsum.photos/400/300?random=${index}`;

  return (
    <a 
      href={uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm text-spanish-red group-hover:bg-spanish-red group-hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
           <h3 className="font-serif font-bold text-xl text-gray-900 group-hover:text-spanish-red transition-colors line-clamp-1">{title}</h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-3 h-3 mr-1" />
          <span>View on Google Maps</span>
        </div>

        {reviewSnippet && (
            <div className="mt-auto bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-600 italic line-clamp-3">"{reviewSnippet}"</p>
            </div>
        )}
      </div>
    </a>
  );
};