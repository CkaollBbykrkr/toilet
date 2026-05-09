export type ToiletImage = {
  src: string;
  alt: string;
  caption?: string;
  photographer?: string;
};

export type Toilet = {
  slug: string;
  name: string;
  region?: string;
  location: {
    country: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  architect?: string;
  year?: number;
  tagline?: string;
  description: string;
  images: ToiletImage[];
  styles?: string[];
  features?: string[];
  tips?: string[];
  tags?: string[];
};
