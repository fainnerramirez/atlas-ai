import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import Map, { FullscreenControl, Marker, NavigationControl } from 'react-map-gl/mapbox';

export default function MapView({ coordinates }: { coordinates: { place: string; lat: number; lng: number }[] | undefined }) {

  const [viewport, setViewport] = useState({
    latitude: coordinates?.[0]?.lat ?? 0,
    longitude: coordinates?.[0]?.lng ?? 0,
    zoom: coordinates && coordinates.length > 1 ? 4 : 1,
  })

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      setViewport({
        latitude: coordinates[0].lat,
        longitude: coordinates[0].lng,
        zoom: coordinates.length > 1 ? 4 : 6,
      });
    } else {
      setViewport({
        latitude: 0,
        longitude: 0,
        zoom: 1,
      });
    }
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
        >
          <div style={{ color: 'red', fontSize: '24px' }}>
            📍
          </div>
        </Marker>
      ))}
    </Map>
  );
}