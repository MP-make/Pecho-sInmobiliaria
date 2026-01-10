import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyDetailClient from '@/components/PropertyDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProperty(slug: string) {
  // Primero intentar buscar por slug
  let property = await prisma.property.findUnique({
    where: { slug },
    include: { amenities: true, propertyImages: true },
  });

  // Si no encuentra por slug, intentar por ID (para compatibilidad con URLs antiguas)
  if (!property) {
    property = await prisma.property.findUnique({
      where: { id: slug },
      include: { amenities: true, propertyImages: true },
    });
  }

  return property;
}

export default async function PropertyDetail({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}