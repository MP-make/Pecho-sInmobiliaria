import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyDetailClient from '@/components/PropertyDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProperty(id: string) {
  return await prisma.property.findUnique({
    where: { id },
    include: { amenities: true, propertyImages: true },
  });
}

export default async function PropertyDetail({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}