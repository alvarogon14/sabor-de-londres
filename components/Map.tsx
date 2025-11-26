import React, { useEffect, useRef } from 'react';
import { RestaurantLocation } from '../types';

interface MapProps {
  locations: RestaurantLocation[];
  className?: string;
}

export const Map: React.FC<MapProps> = ({ locations, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !(window as any).L) return;

    if (!mapInstance.current) {
      const L = (window as any).L;
      // Initialize map focused on London with better quality settings
      const map = L.map(mapRef.current, {
        center: [51.509865, -0.118092], 
        zoom: 13,
        scrollWheelZoom: true,
        zoomControl: false,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        preferCanvas: false // Use DOM rendering for better quality
      });
      
      L.control.zoom({
        position: 'topright'
      }).addTo(map);
      
      // Improve map rendering quality - use high-quality rendering
      map.on('tileload', function(e: any) {
        // Force hardware acceleration and crisp rendering
        e.tile.style.transform = 'translateZ(0)';
        e.tile.style.imageRendering = 'auto';
        e.tile.style.backfaceVisibility = 'hidden';
      });
      
      // Use high-quality OpenStreetMap tiles with retina support for maximum clarity
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19,
        zoomOffset: 0,
        tileSize: 256,
        detectRetina: true
      }).addTo(map);
      
      // Force a refresh when tiles are loaded to ensure clarity
      map.whenReady(() => {
        map.invalidateSize();
      });

      mapInstance.current = map;
    }

    const map = mapInstance.current;
    const L = (window as any).L;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);
    let hasLocations = false;

    locations.forEach(loc => {
      hasLocations = true;
      
      // Determine CSS class based on category
      let categoryClass = '';
      if (loc.category === 'bakery') categoryClass = 'bakery';
      else if (loc.category === 'pub') categoryClass = 'pub';

      // Custom Icon Definition with dynamic class
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="custom-marker-pin ${categoryClass}"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="font-sans text-center min-w-[150px]">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">${loc.category}</span>
            <h3 class="font-bold text-lg text-gray-900 mb-1">${loc.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${loc.description}</p>
            ${loc.rating ? `<span class="text-amber-500 font-bold">★ ${loc.rating}</span>` : ''}
          </div>
        `);
      
      markersRef.current.push(marker);
      bounds.extend([loc.lat, loc.lng]);
    });

    // Fit bounds if we have locations, otherwise stay on London center
    if (hasLocations) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 17 });
    } else {
        map.setView([51.509865, -0.118092], 13);
    }
    
    // Force map to refresh and ensure tiles are sharp
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  }, [locations]);

  return <div ref={mapRef} className={`z-0 ${className}`} />;
};