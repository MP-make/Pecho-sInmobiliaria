import PropertyForm from '@/components/admin/PropertyForm'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  return (
    <div>
      <h1 className="font-sans text-3xl font-bold text-[#2C2621] uppercase tracking-tight mb-8">
        Editar Propiedad
      </h1>
      <PropertyForm propertyId={id} />
    </div>
  )
}