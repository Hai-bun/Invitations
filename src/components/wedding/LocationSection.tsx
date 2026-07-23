import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface LocationSectionProps {
  eventTitle: string;
  eventAddress: string;
  eventMapUrl: string;
  language?: Language;
}

// Extract embed URL from Google Maps URL
const getEmbedUrl = (url: string, address: string): string => {
  if (!url) {
    // Fallback to address-based embed
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }
  
  // If already an embed URL, use as-is
  if (url.includes('/embed')) {
    return url;
  }
  
  // Try to extract place/coordinates from Google Maps URL
  try {
    // Handle various Google Maps URL formats
    if (url.includes('place/')) {
      // Extract place name from URL like maps/place/PlaceName/...
      const placeMatch = url.match(/place\/([^/]+)/);
      if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
      }
    }
    
    // Handle @lat,lng format
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
    }
    
    // Handle ?q= parameter
    const urlObj = new URL(url);
    const query = urlObj.searchParams.get('q');
    if (query) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }
  } catch {
    // URL parsing failed
  }
  
  // Fallback to address
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
};

export const LocationSection = ({ eventTitle, eventAddress, eventMapUrl, language }: LocationSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);
  const embedUrl = getEmbedUrl(eventMapUrl, eventAddress);
  
  // Use the Google Maps URL directly for directions (not address-based)
  const directionsUrl = eventMapUrl && !eventMapUrl.includes('/embed') 
    ? eventMapUrl 
    : `https://maps.google.com/maps?q=${encodeURIComponent(eventAddress)}`;

  return (
    <section className="py-16 px-4 bg-card">
      <div className="max-w-4xl mx-auto text-center">
        <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
        
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-2">
          {eventTitle}
        </h2>
        
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {eventAddress}
        </p>
        
        {/* Embedded Map */}
        <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden shadow-card mb-6 bg-muted">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Wedding Location Map"
          />
        </div>
        
        <Button
          onClick={() => window.open(directionsUrl, '_blank')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {t.getDirections}
        </Button>
      </div>
    </section>
  );
};
