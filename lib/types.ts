export type ToiletImage = {
  src: string;
  alt: string;
  caption?: string;
  photographer?: string;
};

export type Designer = {
  name: string;
  bio?: string;
  portrait?: string;
};

export type VisitorTipIcon =
  | "time"
  | "privacy"
  | "accessibility"
  | "location"
  | "info";

export type VisitorTip = {
  title: string;
  description: string;
  icon?: VisitorTipIcon;
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
  designer?: Designer;
  year?: number;
  tagline?: string;
  description: string;
  images: ToiletImage[];
  styles?: string[];
  features?: string[];
  visitorTips?: VisitorTip[];
  tags?: string[];
};
