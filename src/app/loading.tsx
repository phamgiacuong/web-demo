// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto p-4 pt-10">
      {/* Skeleton Header */}
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
      
      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}