import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  description?: string | null;
}

interface PropertyCardProps {
  property: Property;
  reverse?: boolean;
  language?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, reverse = false, language = 'es' }) => {
  const translations = {
    es: {
      viewMore: 'Ver más',
      ourHouse: 'En nuestra casa contamos con:',
      bedrooms: 'HABITACIONES',
      bathrooms: 'BAÑOS',
      livingRoom: 'SALA COMEDOR',
      park: 'UBICADO FRENTE A UN PARQUE PARA NIÑOS'
    },
    en: {
      viewMore: 'View more',
      ourHouse: 'Our house features:',
      bedrooms: 'BEDROOMS',
      bathrooms: 'BATHROOMS',
      livingRoom: 'LIVING ROOM',
      park: 'LOCATED IN FRONT OF A CHILDREN\'S PARK'
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[400px] sm:min-h-[450px] md:min-h-[500px] px-4 sm:px-8 md:px-16`}>
      {/* Image Section */}
      <div className="md:w-1/2 h-[300px] sm:h-[350px] md:h-[500px]">
        <img 
          src={property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="md:w-1/2 p-6 sm:p-8 md:p-16 flex flex-col justify-center bg-[#F2EFE9]">
        <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2621] uppercase tracking-tight leading-none mb-6 sm:mb-8 break-words">
          {property.title}
        </h2>
        
        <p className="font-mono text-xs sm:text-sm text-[#2C2621] tracking-wide mb-3 sm:mb-4">
          {t.ourHouse}
        </p>
        
        <ul className="font-mono text-xs sm:text-sm text-[#2C2621] uppercase tracking-wide space-y-2 mb-6 sm:mb-8">
          <li>• 3 {t.bedrooms}</li>
          <li>• 3 {t.bathrooms}</li>
          <li>• 1 {t.livingRoom}</li>
          <li>• {t.park}</li>
        </ul>
        
        <Link href={`/property/${property.id}`} className="inline-block">
          <span className="rounded-none border-2 border-[#3B332B] px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white inline-block">
            {t.viewMore}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;