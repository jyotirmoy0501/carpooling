import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { fetchOSRMRoute } from '../utils/osrmRouting';
import { Navigation, Clock, MapPin, Zap } from 'lucide-react';

export default function LiveMap({ 
  pickupCoords = [18.5912, 73.7389], // Hinjawadi Pune
  dropCoords = [18.5362, 73.8940],   // Koregaon Park Pune
  height = "320px",
  mapTheme = "voyager",
  interactive = true,
  isTrackingActive = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);

  const [osrmData, setOsrmData] = useState({
    distanceKm: 16.5,
    durationMins: 32,
    loading: true,
    isFallback: false
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean existing map instance if re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const startLat = pickupCoords[0];
    const startLng = pickupCoords[1];
    const endLat = dropCoords[0];
    const endLng = dropCoords[1];

    const centerLat = (startLat + endLat) / 2;
    const centerLng = (startLng + endLng) / 2;

    // Initialize MapLibre GL JS Engine with OpenStreetMap / CartoDB Vector/Raster Style
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              mapTheme === 'dark'
                ? 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [centerLng, centerLat],
      zoom: 12,
      interactive
    });

    mapInstanceRef.current = map;

    // Add Navigation Controls (Zoom / Rotate)
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', async () => {
      // 1. Add Pickup Marker (Green)
      const pickupEl = document.createElement('div');
      pickupEl.className = 'w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold ring-4 ring-emerald-500/30';
      pickupEl.innerText = 'P';
      new maplibregl.Marker({ element: pickupEl })
        .setLngLat([startLng, startLat])
        .addTo(map);

      // 2. Add Destination Marker (Red)
      const dropEl = document.createElement('div');
      dropEl.className = 'w-7 h-7 rounded-full bg-red-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold ring-4 ring-red-500/30';
      dropEl.innerText = 'D';
      new maplibregl.Marker({ element: dropEl })
        .setLngLat([endLng, endLat])
        .addTo(map);

      // 3. Fetch Real Driving Route via OSRM Engine
      setOsrmData(prev => ({ ...prev, loading: true }));
      const osrmResult = await fetchOSRMRoute(pickupCoords, dropCoords);

      setOsrmData({
        distanceKm: osrmResult.distanceKm,
        durationMins: osrmResult.durationMins,
        loading: false,
        isFallback: osrmResult.isFallback
      });

      // Format polyline for MapLibre GeoJSON [lng, lat]
      const geojsonCoordinates = osrmResult.polyline.map(p => [p[1], p[0]]);

      // 4. Render OSRM Driving Route Line on MapLibre Engine
      if (map.getSource('osrm-route')) {
        map.getSource('osrm-route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: geojsonCoordinates
          }
        });
      } else {
        map.addSource('osrm-route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: geojsonCoordinates
            }
          }
        });

        // Glow Outer Line
        map.addLayer({
          id: 'osrm-route-glow',
          type: 'line',
          source: 'osrm-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#a855f7',
            'line-width': 8,
            'line-opacity': 0.4
          }
        });

        // Inner Sharp Line
        map.addLayer({
          id: 'osrm-route-line',
          type: 'line',
          source: 'osrm-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#06b6d4',
            'line-width': 4
          }
        });
      }

      // 5. Fit Map Bounds around OSRM Route
      const bounds = new maplibregl.LngLatBounds();
      geojsonCoordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 40, maxZoom: 15 });

      // 6. Uber Car Animation Marker along OSRM Route
      const carEl = document.createElement('div');
      carEl.className = 'w-9 h-9 rounded-full bg-purple-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-base shadow-purple-950/80 animate-pulse';
      carEl.innerText = '🚘';

      const driverMarker = new maplibregl.Marker({ element: carEl })
        .setLngLat(geojsonCoordinates[0])
        .addTo(map);

      driverMarkerRef.current = driverMarker;

      // Animate vehicle position smoothly along OSRM Polyline
      if (isTrackingActive && geojsonCoordinates.length > 1) {
        let step = 0;
        const totalSteps = geojsonCoordinates.length;

        const interval = setInterval(() => {
          step = (step + 1) % totalSteps;
          const currentCoord = geojsonCoordinates[step];
          driverMarker.setLngLat(currentCoord);
        }, 1200);

        return () => clearInterval(interval);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickupCoords[0], pickupCoords[1], dropCoords[0], dropCoords[1], mapTheme, isTrackingActive]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl" style={{ height }}>
      
      {/* MAPLIBRE GL DISPLAY CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* OSRM ROUTING NAVIGATION HEADER CARD */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 glass-panel p-3 rounded-xl border border-teal-500/40 bg-slate-950/90 text-xs text-white flex items-center gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">OSRM Driving Route</span>
            <span className="font-extrabold text-sm text-teal-300 flex items-center gap-1.5">
              {osrmData.loading ? 'Calculating OSRM...' : `${osrmData.distanceKm} km`}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Duration</span>
            <span className="font-extrabold text-sm text-purple-300">
              {osrmData.loading ? '...' : `~${osrmData.durationMins} mins`}
            </span>
          </div>
        </div>

        <div className="hidden sm:block pl-2 border-l border-slate-800">
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            MapLibre GL + OSM
          </span>
        </div>
      </div>

    </div>
  );
}
