import HomeClient from '@/components/HomeClient';
import { prisma } from '@/lib/prisma';

// Deshabilitar caché para obtener datos frescos siempre
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProperties() {
  return await prisma.property.findMany({
    include: {
      amenities: true,
      propertyImages: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getHeroImages() {
  const images = await prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  
  if (images.length === 0) {
    return [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
    ];
  }
  
  return images.map((img: any) => img.url);
}

export default async function Home() {
  const properties = await getProperties();
  const heroImages = await getHeroImages();

  return <HomeClient properties={properties} heroImages={heroImages} />;
}
