import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Header } from './components/Header';
import { SearchBox } from './components/SearchBox';
import { PlaceCard } from './components/PlaceCard';
import { Map } from './components/Map';
import { searchRestaurants } from './services/geminiService';
import { SearchState, GroundingChunk, RestaurantLocation } from './types';
import { AlertCircle } from 'lucide-react';

// Curated list of top Spanish places for the landing page map
const LANDING_LOCATIONS: RestaurantLocation[] = [
  // Restaurants - Central / High End / Classics
  { id: '1', name: 'Barrafina Dean St', lat: 51.5123, lng: -0.1311, description: 'Michelin-starred tapas counter', rating: 4.7, category: 'restaurant' },
  { id: '2', name: 'Sabor', lat: 51.5110, lng: -0.1396, description: 'Authentic regional Spanish cuisine', rating: 4.6, category: 'restaurant' },
  { id: '15', name: 'Arròs QD', lat: 51.5160, lng: -0.1385, description: 'Quique Dacosta’s paella & wood-fired rice masterpiece', rating: 4.6, category: 'restaurant' },
  { id: '16', name: 'Hispania', lat: 51.5126, lng: -0.0884, description: 'Grand two-floor gastronomy in a historic bank', rating: 4.5, category: 'restaurant' },
  { id: '17', name: 'Lurra', lat: 51.5156, lng: -0.1607, description: 'Basque grill specializing in beef & fish', rating: 4.7, category: 'restaurant' },
  { id: '18', name: 'Parrillan', lat: 51.5345, lng: -0.1255, description: 'Outdoor DIY grilling terrace at Coal Drops Yard', rating: 4.4, category: 'restaurant' },
  { id: '19', name: 'Ibérica Farringdon', lat: 51.5207, lng: -0.1042, description: 'Asturian cuisine in a stunning interior', rating: 4.4, category: 'restaurant' },
  { id: '20', name: 'Jamon Jamon Soho', lat: 51.5135, lng: -0.1332, description: 'Bustling, fun, and authentic tapas spot', rating: 4.3, category: 'restaurant' },

  // Restaurants - Neighbourhood / Tapas / Gems
  { id: '3', name: 'José Tapas Bar', lat: 51.5011, lng: -0.0813, description: 'Intimate, authentic tapas in Bermondsey', rating: 4.8, category: 'restaurant' },
  { id: '4', name: 'Pizarro', lat: 51.5020, lng: -0.0838, description: 'Formal dining by José Pizarro', rating: 4.5, category: 'restaurant' },
  { id: '5', name: 'Moro', lat: 51.5262, lng: -0.1068, description: 'Moorish-influenced Spanish cooking', rating: 4.6, category: 'restaurant' },
  { id: '6', name: 'Tapas Brindisa', lat: 51.5052, lng: -0.0903, description: 'Famous chorizo roll and classic tapas', rating: 4.4, category: 'restaurant' },
  { id: '7', name: 'El Pirata', lat: 51.5060, lng: -0.1466, description: 'Classic tapas in Mayfair', rating: 4.5, category: 'restaurant' },
  { id: '21', name: 'Lobos Meat & Tapas', lat: 51.5034, lng: -0.0911, description: 'Meat-lovers paradise under the arches', rating: 4.7, category: 'restaurant' },
  { id: '22', name: 'Boqueria', lat: 51.4632, lng: -0.1147, description: 'Lively tapas bar in Brixton', rating: 4.5, category: 'restaurant' },
  
  // Bakeries / Cafes / Delis
  { id: '13', name: 'R. Garcia And Sons', lat: 51.5176, lng: -0.2064, description: 'The institution: Iconic Spanish deli & supermarket on Portobello', rating: 4.8, category: 'bakery' },
  { id: '8', name: 'La Maritxu', lat: 51.5136, lng: -0.1654, description: 'Famous Basque Cheesecakes (Connaught Village)', rating: 4.9, category: 'bakery' },
  { id: '9', name: 'Churros Garcia', lat: 51.5173, lng: -0.2056, description: 'Legendary churros at Portobello Market', rating: 4.8, category: 'bakery' },
  { id: '23', name: 'Casa Manolo Strand', lat: 51.5103, lng: -0.1221, description: 'Famous for top-tier Jamón Ibérico and deli goods', rating: 4.5, category: 'bakery' },
  
  // Pubs / Bars
  { id: '10', name: "Bradley's Spanish Bar", lat: 51.5165, lng: -0.1305, description: 'London\'s oldest Spanish bar, legendary jukebox', rating: 4.5, category: 'pub' },
  { id: '11', name: 'Camino King\'s Cross', lat: 51.5309, lng: -0.1232, description: 'Lively bar with late night vibes', rating: 4.3, category: 'pub' },
  { id: '12', name: 'Bar Kroketa', lat: 51.5144, lng: -0.1347, description: 'Dedicated croqueta bar', rating: 4.4, category: 'pub' },
  { id: '14', name: 'Centro Galego de Londres', lat: 51.5204, lng: -0.2185, description: 'Authentic Galician social club & bar', rating: 4.4, category: 'pub' },
  { id: '24', name: 'Chiringuito', lat: 51.5283, lng: -0.0556, description: 'Bethnal Green beach bar vibes with rooftop', rating: 4.3, category: 'pub' },
];

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    query: '',
    responseContent: '',
    groundingMetadata: null,
    error: null
  });
  
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapLocations, setMapLocations] = useState<RestaurantLocation[]>(LANDING_LOCATIONS);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position.coords),
        (err) => console.log("Location access denied or error", err)
      );
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, query }));
    setHasSearched(true);

    try {
      const result = await searchRestaurants(query, userLocation);
      setState(prev => ({
        ...prev,
        isLoading: false,
        responseContent: result.text,
        groundingMetadata: result.groundingMetadata
      }));

      // Update map if we got location results
      if (result.locations && result.locations.length > 0) {
        setMapLocations(result.locations);
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9F7F2]">
      <Header />
      
      <main className="flex-1 relative flex flex-col">
        {/* Hero Section with Map */}
        <div className={`relative transition-all duration-500 ease-in-out ${hasSearched ? 'h-[40vh]' : 'h-[60vh] md:h-[70vh]'}`}>
           <Map locations={mapLocations} className="w-full h-full" />
           
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F9F7F2] pointer-events-none z-10" />

           {/* Search Container */}
           <div className="absolute top-8 left-0 right-0 z-20 flex flex-col items-center">
              {!hasSearched && (
                 <div className="text-center mb-6 animate-fade-in px-4">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 drop-shadow-md">
                      Find Authentic Spanish Flavors
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 font-medium">
                      From rustic tapas to hidden gems
                    </p>
                 </div>
              )}
              <SearchBox 
                onSearch={handleSearch} 
                isLoading={state.isLoading} 
                className="w-full max-w-2xl px-4"
              />
              
              {/* Legend */}
              <div className="mt-4 flex gap-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-900">
                 <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-spanish-red"></span> Restaurant</div>
                 <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-spanish-yellow"></span> Bakery/Deli</div>
                 <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#1F1F1F]"></span> Pub/Bar</div>
              </div>
           </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto px-4 pb-12 relative z-20 -mt-10">
          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center shadow-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              {state.error}
            </div>
          )}

          {(state.responseContent || state.groundingMetadata) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
              {/* Left Column: Text Response */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="markdown-content text-gray-700">
                    <ReactMarkdown>{state.responseContent}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Right Column: Place Cards */}
              <div className="lg:col-span-2">
                {state.groundingMetadata?.groundingChunks && (
                  <>
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center">
                      <span className="bg-spanish-red w-2 h-8 mr-3 rounded-full"></span>
                      Recommended Places
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {state.groundingMetadata.groundingChunks.map((chunk, index) => (
                        chunk.maps && <PlaceCard key={index} chunk={chunk} index={index} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;