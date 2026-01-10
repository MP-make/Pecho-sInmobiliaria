import PropertyForm from '@/components/admin/PropertyForm'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  return (
    <div>
      <PropertyForm propertyId={id} />
    </div>
  )
}