import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import Map, { FullscreenControl, Marker, NavigationControl, Popup } from 'react-map-gl/mapbox';
import { WebMercatorViewport } from "viewport-mercator-project";

export default function MapView({ coordinates }: { coordinates: { place: string; lat: number; lng: number }[] | undefined }) {

  const [viewport, setViewport] = useState({
    latitude: coordinates?.[0]?.lat ?? 0,
    longitude: coordinates?.[0]?.lng ?? 0,
    zoom: coordinates && coordinates.length > 1 ? 4 : 1,
  })

  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    if (coordinates.length === 1) {
      setViewport(v => ({
        ...v,
        latitude: coordinates[0].lat,
        longitude: coordinates[0].lng,
        zoom: 8,
      }));
      return;
    }

    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const bounds: [[number, number], [number, number]] = [
      [minLng, minLat],
      [maxLng, maxLat],
    ];

    const { longitude, latitude, zoom } = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    }).fitBounds(bounds, { padding: 100 });

    setViewport({ longitude, latitude, zoom });
  }, [coordinates]);


  return (
    <Map
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_API_KEY_MAPBOX}
      onMove={(evt: any) => setViewport(evt.viewState)}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <NavigationControl position='top-left' />
      <FullscreenControl position='top-right' />

      {coordinates?.map((coord, index) => (
        <Marker
          key={index}
          latitude={coord.lat}
          longitude={coord.lng}
          anchor="bottom"
          onClick={() => setSelected(index)}
        >
          <div style={{ color: 'red', fontSize: '24px', cursor: "pointer" }}>
            🚩
          </div>
        </Marker>
      ))}

      {selected !== null && (
        <Popup
          latitude={coordinates ? coordinates[selected].lat : 0}
          longitude={coordinates ? coordinates[selected].lng : 0}
          onClose={() => setSelected(null)}
          closeOnClick={false}
        >
          <strong>{coordinates ? coordinates[selected].place : "Nombre no proporcionado"}</strong>
        </Popup>
      )}
    </Map>
  );
}