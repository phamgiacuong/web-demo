// src/components/SearchForm.tsx
'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // QUAN TRỌNG: Chặn reload trang

        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }

        // scroll: false -> Giữ nguyên vị trí cuộn
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full md:w-auto gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-red-100 transition"
        >
            <input
                name="q" // Tên này quan trọng
                placeholder="Tìm tên sản phẩm..."
                className="pl-5 py-2.5 bg-transparent outline-none text-sm w-full md:w-64 text-gray-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit" // Type submit kích hoạt onSubmit
                className="bg-gray-900 text-white w-10 h-10 md:w-auto md:px-6 md:h-auto rounded-full text-sm font-bold hover:bg-red-600 transition flex items-center justify-center shadow-md cursor-pointer"
            >
                <Search className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Tìm kiếm</span>
            </button>
        </form>
    );
}