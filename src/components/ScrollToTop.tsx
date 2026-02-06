// src/components/ScrollToTop.tsx
'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed bottom-8 right-8 z-40"
                >
                    <button
                        onClick={scrollToTop}
                        className="group relative flex items-center justify-center w-14 h-14 bg-white text-gray-900 rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* SVG Progress Circle */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="none"
                                stroke="#DC2626" // Màu đỏ
                                strokeWidth="4"
                                strokeDasharray="301.59" // Chu vi hình tròn
                                strokeDashoffset="301.59"
                                style={{ pathLength: scaleX }}
                            />
                        </svg>

                        <ArrowUp className="w-6 h-6 group-hover:animate-bounce relative z-10" />
                    </button>
                </motion.div>
            )}
        </>
    );
}