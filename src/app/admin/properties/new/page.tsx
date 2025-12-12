import PropertyForm from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-sans text-3xl font-bold text-[#2C2621] uppercase tracking-tight mb-8">
        Nueva Propiedad
      </h1>
      <PropertyForm />
    </div>
  )
}