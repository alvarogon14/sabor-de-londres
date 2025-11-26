// types.ts

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        source: string;
      }[];
    };
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: any;
  webSearchQueries?: string[];
}

export interface SearchState {
  isLoading: boolean;
  query: string;
  responseContent: string;
  groundingMetadata: GroundingMetadata | null;
  error: string | null;
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}

export type PlaceCategory = 'restaurant' | 'bakery' | 'pub';

export interface RestaurantLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  rating?: number;
  category: PlaceCategory;
}