// src/app/loading.tsx
export default function Loading() {
    return (
        <div className="container mx-auto px-6 py-12">
            {/* Skeleton Hero */}
            <div className="w-full h-[400px] bg-gray-200 rounded-3xl animate-pulse mb-12"></div>

            {/* Skeleton Title */}
            <div className="flex justify-between mb-8">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-64 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Skeleton Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="aspect-[4/5] bg-gray-200 animate-pulse"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}