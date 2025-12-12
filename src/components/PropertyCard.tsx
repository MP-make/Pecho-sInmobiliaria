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
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, reverse = false }) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[500px]`}>
      {/* Image Section */}
      <div className="md:w-1/2 h-[300px] md:h-auto">
        <img 
          src={property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#F2EFE9]">
        <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2621] uppercase tracking-tight leading-none mb-8">
          {property.title}
        </h2>
        
        <p className="font-mono text-sm text-[#2C2621] tracking-wide mb-4">
          En nuestra casa contamos con:
        </p>
        
        <ul className="font-mono text-sm text-[#2C2621] uppercase tracking-wide space-y-2 mb-8">
          <li>• 3 HABITACIONES</li>
          <li>• 3 BAÑOS</li>
          <li>• 1 SALA COMEDOR</li>
          <li>• UBICADO FRENTE A UN PARQUE PARA NIÑOS</li>
        </ul>
        
        <Link href={`/property/${property.id}`} className="inline-block">
          <span className="rounded-full px-8 py-3 bg-[#3B332B] text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-[#5A4D41] inline-block">
            Ver más
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;