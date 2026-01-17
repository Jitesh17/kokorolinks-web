export interface WeddingData {
  templateId: 'petal' | 'royal' | 'story' | 'vogue';
  coupleNames: string;
  tagline?: string;
  cityLine?: string;
  theme?: {
    mode?: 'light' | 'dark' | 'dynamic';
    palette?: {
      primary?: string;
      secondary?: string;
      text?: string;
    };
    typography?: {
      heading?: 'serif' | 'sans' | 'script';
    };
    features?: {
      cinematicHeader?: boolean;
      floatingCorners?: boolean;
      showCountdown?: boolean;
    };
  };
  media?: {
    couplePhoto?: {
      src: string | string[];
      enabled?: boolean;
      size?: 'hero' | 'circle' | 'full';
      position?: string;
      style?: 'cinematic' | 'standard';
    };
  };
  primaryEvent?: {
    title?: string;
    start: string;
    end?: string;
    displayDate?: string;
  };
  primaryVenue?: {
    name?: string;
    address?: string;
    mapUrl?: string;
  };
  schedule?: Array<{
    id?: string;
    title: string;
    start: string;
    locationName?: string;
    address?: string;
    wardrobe?: string;
    wardrobeIcon?: string;
    notes?: string;
    mapUrl?: string;
  }>;
  contacts?: Array<{
    name: string;
    phone?: string;
    role?: string;
    icon?: string;
  }>;
  rsvp?: {
    enabled: boolean;
    mode?: 'link' | 'embed';
    formUrl?: string;
    embedUrl?: string;
    buttonText?: string;
    deadline?: string;
  };
}