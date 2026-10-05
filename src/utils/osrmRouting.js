/**
 * OSRM (Open Source Routing Machine) Service Integration
 * Calculates real driving routes, distance (km), duration (mins), and GeoJSON geometries
 */

export async function fetchOSRMRoute(startCoords, endCoords) {
  const [startLat, startLng] = startCoords;
  const [endLat, endLng] = endCoords;

  try {
    // OSRM expects coordinates in Lng,Lat order
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No OSRM route found');
    }

    const primaryRoute = data.routes[0];
    const distanceKm = (primaryRoute.distance / 1000).toFixed(1); // meters -> km
    const durationMins = Math.round(primaryRoute.duration / 60); // seconds -> mins

    // GeoJSON coordinates are in [lng, lat], convert to MapLibre/Leaflet [lat, lng] format
    const routePolyline = primaryRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);

    return {
      success: true,
      distanceKm: parseFloat(distanceKm),
      durationMins,
      polyline: routePolyline,
      geojson: primaryRoute.geometry
    };
  } catch (error) {
    console.warn('OSRM API fetch failed or offline, using fallback geometry:', error.message);
    
    // Fallback curved polyline generator
    const steps = 15;
    const fallbackPolyline = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = startLat + (endLat - startLat) * t + Math.sin(t * Math.PI) * 0.015;
      const lng = startLng + (endLng - startLng) * t + Math.cos(t * Math.PI) * 0.015;
      fallbackPolyline.push([lat, lng]);
    }

    const estDist = (Math.sqrt(Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2)) * 111).toFixed(1);
    const estTime = Math.round(parseFloat(estDist) * 2.2);

    return {
      success: false,
      isFallback: true,
      distanceKm: parseFloat(estDist),
      durationMins: estTime,
      polyline: fallbackPolyline,
      geojson: {
        type: 'LineString',
        coordinates: fallbackPolyline.map(p => [p[1], p[0]])
      }
    };
  }
}
