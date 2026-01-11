'use client'

import { MorphingText } from '@/components/animate-ui/primitives/texts/morphing';
import { Button } from '@/components/ui/button';
import { Globe } from '@/components/ui/globe';
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
        <main className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-50 px-10">
            <div className="mt-10 md:m-0 flex flex-col items-center justify-center w-full md:w-1/2 gap-8">
                <GrMapLocation size={56} />
                <MorphingText
                    className="text-2xl md:text-4xl font-semibold text-center"
                    text={texts}
                    loop
                    holdDelay={2500}
                />
                <Button
                    className='cursor-pointer hover:bg-gray-200'
                    variant="ghost"
                >
                    Explorar
                    <MdOutlineArrowOutward size={15} />
                </Button>
            </div>
            <div className="flex items-center justify-center w-full md:w-1/2">
                <Globe />
            </div>
        </main>
    );
}
