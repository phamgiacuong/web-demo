// src/app/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50/30 pt-32 pb-20">
            <div className="container mx-auto px-6">

                {/* Skeleton cho Banner Hero */}
                <div className="w-full h-[400px] bg-gray-200 rounded-3xl animate-pulse mb-12"></div>

                {/* Skeleton cho Danh mục */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>

                {/* Skeleton cho Lưới sản phẩm */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[400px]">
                            <div className="h-[60%] bg-gray-200 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}