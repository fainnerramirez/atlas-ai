'use client'

import { MorphingText } from '@/components/animate-ui/primitives/texts/morphing';
import { Button } from '@/components/ui/button';
import { Globe } from '@/components/ui/globe';
import Link from 'next/link';
import { GrMapLocation } from 'react-icons/gr';
import { MdOutlineArrowOutward } from 'react-icons/md';

const texts = [
    'Atlas AI: Explora el mundo 🌍',
    'Dime dónde quieres ir ✈️',
    'Descubre destinos increíbles 🌟',
    'Viaje con con un prompt 🗺️',
    'Sugiere lugares únicos ✨',
    'Ruta personalizada para ti 🚀',
    'Inspírate, viaja, repite 🔄'
];

export default function Welcome() {
    return (
        <main className="flex flex-col overflow-hidden md:flex-row items-center justify-center h-screen bg-gray-50 px-10">
            <div className="mt-10 md:m-0 flex flex-col items-center justify-center w-full md:w-1/2 gap-8">
                <GrMapLocation size={56} />
                <div className='flex flex-col justify-center gap-1'>
                    <h1 className='text-4xl md:text-6xl'>Atlas AI</h1>
                    <h6 className='text-gray-600 flex justify-center'>
                        <a href='https://faidev.vercel.app/' target='_blank' className='flex gap-1 items-center'>
                            By FaiDev
                            <MdOutlineArrowOutward size={15} />
                        </a>

                    </h6>
                </div>
                <MorphingText
                    className="text-2xl md:text-4xl font-semibold text-center"
                    text={texts}
                    loop
                    holdDelay={2500}
                />
                <Button
                    className="cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                    variant="ghost"
                >
                    <Link href="/explore" className='flex items-center gap-1'>
                        Descubrir
                        <MdOutlineArrowOutward size={15} />
                    </Link>
                </Button>
            </div>
            <div className="flex items-center justify-center w-full md:w-1/2">
                <Globe />
            </div>
        </main>
    );
}
