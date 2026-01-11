import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import Map, { FullscreenControl, type MapRef, Marker, NavigationControl, Popup } from 'react-map-gl/mapbox';

export default function MapView({ coordinates }: { coordinates: { place: string; lat: number; lng: number }[] | undefined }) {

  const [viewport, setViewport] = useState({
    latitude: coordinates?.[0]?.lat ?? 0,
    longitude: coordinates?.[0]?.lng ?? 0,
    zoom: coordinates && coordinates.length > 1 ? 4 : 1,
  })
  const [selected, setSelected] = useState<number | null>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    const map = mapRef.current?.getMap();
    if (!map) return;

    if (coordinates.length === 1) {
      map.flyTo({
        center: [coordinates[0].lng, coordinates[0].lat],
        zoom: 8,
        speed: 1.2,
        curve: 1.42,
      });
      return;
    }

    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 100 }
    );
  }, [coordinates]);

  return (
    <Map
      ref={mapRef}
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