// src/components/Breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-red-600 transition flex items-center gap-1">
                <Home className="w-4 h-4" /> Trang chủ
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-red-600 transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-bold line-clamp-1 max-w-[200px]">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}