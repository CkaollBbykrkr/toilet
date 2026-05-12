export type Region =
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Africa"
  | "Oceania";

export type LicenseStatus = "cc" | "commercial" | "pending" | "unknown";

export type ToiletImage = {
  src: string;
  alt: string;
  caption?: string;
  photographer?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  licenseStatus?: LicenseStatus;
};

export type Designer = {
  name: string;
  firm?: string;
  bio?: string;
  portrait?: string;
  portraitCredit?: string;
  portraitSourceUrl?: string;
  portraitLicense?: string;
  portraitLicenseUrl?: string;
};

export type VisitorTipIcon =
  | "time"
  | "privacy"
  | "accessibility"
  | "location"
  | "ticket"
  | "camera"
  | "info";

export type VisitorTip = {
  title: string;
  description: string;
  icon?: VisitorTipIcon;
};

export type PracticalInfo = {
  openingHours?: string;
  fee?: string;
  accessibility?: string;
};

export type Source = {
  title: string;
  url: string;
};

export type StorySection = {
  heading: string;
  body: string;
};

export type Story = {
  slug: string;
  title: string;
  tagline: string;
  heroToiletSlug: string;
  intro: string;
  sections: StorySection[];
  relatedToiletSlugs: string[];
};

export type Toilet = {
  slug: string;
  name: string;
  nameLocal?: string;
  region?: Region;
  location: {
    country: string;
    city: string;
    place?: string;
    address?: string;
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
  practical?: PracticalInfo;
  sources?: Source[];
};
