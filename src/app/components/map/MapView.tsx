import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import { Map } from 'react-map-gl/mapbox';

export default function MapView() {
  //4.570868, -74.297333
  const [viewport, setViewport] = useState({
    longitude: -74.29,
    latitude: 4.57,
    zoom: 6,
  });

  return (
    <Map
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_API_KEY_MAPBOX}
      onMove={(evt: any) => setViewport(evt.viewState)}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    />
  );
}