import { tool } from '@openai/agents';
import { z } from 'zod';

export const getCoordinateTool = tool({
    name: 'get_coordinates',
    description: 'Obtiene la latitud y longitud de un lugar específico a partir de un texto geocodificable como una ciudad, dirección o punto de interés',
    parameters: z.object({
        place: z.string().describe('El texto geocodificable del lugar'),
    }),
    async execute({ place }) {
        console.log("Ejecutando get_coordinates tool para:", place);

        const token = process.env.NEXT_PUBLIC_API_KEY_MAPBOX;
        if (!token) {
            return { error: "Token de Mapbox no configurado" };
        }
        if (!place.trim()) {
            return { error: "Lugar no válido" };
        }

        try {
            const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(place)}&access_token=${token}`;
            const mapboxRes = await fetch(url);
            const data = await mapboxRes.json();

            console.log("Respuesta completa de Mapbox:", data);

            if (!data.features || data.features.length === 0) {
                return { error: "Location not found" };
            }

            const [lng, lat] = data.features[0].geometry.coordinates;
            console.log("Coordenadas extraídas:", lat, lng);

            return { place, lat, lng };
        } catch (e) {
            return new Error(`Error al llamar api de mapbox | Message: ${(e as Error).message} | Cause: ${(e as Error).cause}`)
        }
    }
});