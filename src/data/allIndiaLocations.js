/**
 * ALL INDIA LOCATIONS & IT CORRIDORS DATASET
 * Richly categorized for Google Places style search experience across India.
 */

export const ALL_INDIA_LOCATIONS = [
  // PUNE & MAHARASHTRA
  { id: 'pn-1', category: 'Tech Park', typeIcon: '🏢', name: 'Hinjawadi Infotech Park Phase 1', city: 'Pune', state: 'Maharashtra', address: 'Hinjawadi Phase 1, Rajiv Gandhi IT Park, Pune', coords: [18.5912, 73.7389] },
  { id: 'pn-2', category: 'Tech Park', typeIcon: '🏢', name: 'Hinjawadi Infotech Park Phase 3', city: 'Pune', state: 'Maharashtra', address: 'Hinjawadi Phase 3, Embassy Tech Zone, Pune', coords: [18.5815, 73.7020] },
  { id: 'pn-3', category: 'Tech Park', typeIcon: '🏢', name: 'Kharadi EON Free Zone IT Park', city: 'Pune', state: 'Maharashtra', address: 'EON Free Zone, Kharadi, Pune', coords: [18.5516, 73.9535] },
  { id: 'pn-4', category: 'Tech Park', typeIcon: '🏢', name: 'Magarpatta Cybercity', city: 'Pune', state: 'Maharashtra', address: 'Cybercity, Magarpatta, Hadapsar, Pune', coords: [18.5158, 73.9272] },
  { id: 'pn-5', category: 'City Hub', typeIcon: '🏙️', name: 'Baner High Street', city: 'Pune', state: 'Maharashtra', address: 'Baner Road, Balewadi High Street, Pune', coords: [18.5590, 73.7868] },
  { id: 'pn-6', category: 'Airport', typeIcon: '✈️', name: 'Pune International Airport (PNQ)', city: 'Pune', state: 'Maharashtra', address: 'Lohegaon Airport, Viman Nagar Corridor, Pune', coords: [18.5679, 73.9143] },
  { id: 'pn-7', category: 'Railway Station', typeIcon: '🚆', name: 'Pune Junction Railway Station', city: 'Pune', state: 'Maharashtra', address: 'Agarkar Nagar, Pune Station, Pune', coords: [18.5289, 73.8744] },

  // MUMBAI METROPOLITAN REGION
  { id: 'mb-1', category: 'Financial Hub', typeIcon: '🏢', name: 'Bandra Kurla Complex (BKC)', city: 'Mumbai', state: 'Maharashtra', address: 'BKC, Bandra East, Mumbai', coords: [19.0657, 72.8686] },
  { id: 'mb-2', category: 'Airport', typeIcon: '✈️', name: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', city: 'Mumbai', state: 'Maharashtra', address: 'Terminal 2, Sahar Road, Andheri East, Mumbai', coords: [19.0896, 72.8656] },
  { id: 'mb-3', category: 'Tech Park', typeIcon: '🏢', name: 'Andheri East MIDC Tech Park', city: 'Mumbai', state: 'Maharashtra', address: 'MIDC, Andheri East, Mumbai', coords: [19.1136, 72.8697] },
  { id: 'mb-4', category: 'City Hub', typeIcon: '🏙️', name: 'Lower Parel Financial District', city: 'Mumbai', state: 'Maharashtra', address: 'Lower Parel, Senapati Bapat Marg, Mumbai', coords: [18.9953, 72.8293] },
  { id: 'mb-5', category: 'City Hub', typeIcon: '🏙️', name: 'Powai Hiranandani Tech Hub', city: 'Mumbai', state: 'Maharashtra', address: 'Hiranandani Gardens, Powai, Mumbai', coords: [19.1197, 72.9051] },
  { id: 'mb-6', category: 'Railway Station', typeIcon: '🚆', name: 'Mumbai Central & CSMT Station', city: 'Mumbai', state: 'Maharashtra', address: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai', coords: [18.9400, 72.8353] },

  // BENGALURU (BANGALORE)
  { id: 'bl-1', category: 'Tech Park', typeIcon: '🏢', name: 'Manyata Tech Park', city: 'Bengaluru', state: 'Karnataka', address: 'Nagavara, Outer Ring Road, Bengaluru', coords: [13.0451, 77.6204] },
  { id: 'bl-2', category: 'Tech Park', typeIcon: '🏢', name: 'Electronic City Phase 1 & 2', city: 'Bengaluru', state: 'Karnataka', address: 'Hosur Road, Electronic City, Bengaluru', coords: [12.8452, 77.6602] },
  { id: 'bl-3', category: 'Tech Park', typeIcon: '🏢', name: 'Whitefield ITPB Tech Zone', city: 'Bengaluru', state: 'Karnataka', address: 'International Tech Park, Whitefield, Bengaluru', coords: [12.9864, 77.7370] },
  { id: 'bl-4', category: 'Airport', typeIcon: '✈️', name: 'Kempegowda International Airport (BLR)', city: 'Bengaluru', state: 'Karnataka', address: 'Devanahalli, Bengaluru', coords: [13.1986, 77.7066] },
  { id: 'bl-5', category: 'City Hub', typeIcon: '🏙️', name: 'Koramangala 80ft Road Corridor', city: 'Bengaluru', state: 'Karnataka', address: 'Koramangala 4th Block, Bengaluru', coords: [12.9352, 77.6245] },
  { id: 'bl-6', category: 'City Hub', typeIcon: '🏙️', name: 'Indiranagar 100ft Road', city: 'Bengaluru', state: 'Karnataka', address: 'Indiranagar Metro Corridor, Bengaluru', coords: [12.9784, 77.6408] },

  // DELHI NCR (DELHI, GURUGRAM, NOIDA)
  { id: 'dl-1', category: 'Tech Park', typeIcon: '🏢', name: 'DLF Cyber City Phase 2 & 3', city: 'Gurugram', state: 'Haryana', address: 'DLF Cyber City, Phase 2, Gurugram', coords: [28.4950, 77.0895] },
  { id: 'dl-2', category: 'City Hub', typeIcon: '🏙️', name: 'Connaught Place (CP)', city: 'New Delhi', state: 'Delhi', address: 'Connaught Place, Central Delhi, New Delhi', coords: [28.6315, 77.2167] },
  { id: 'dl-3', category: 'Tech Park', typeIcon: '🏢', name: 'Sector 62 IT Hub Noida', city: 'Noida', state: 'Uttar Pradesh', address: 'Sector 62, Noida IT Corridor, Noida', coords: [28.6258, 77.3714] },
  { id: 'dl-4', category: 'Airport', typeIcon: '✈️', name: 'Indira Gandhi International Airport (DEL)', city: 'New Delhi', state: 'Delhi', address: 'Terminal 3, IGIA Aerocity, New Delhi', coords: [28.5562, 77.1000] },

  // HYDERABAD
  { id: 'hyd-1', category: 'Tech Park', typeIcon: '🏢', name: 'HITEC City & Cyber Towers', city: 'Hyderabad', state: 'Telangana', address: 'HITEC City, Madhapur, Hyderabad', coords: [17.4435, 78.3772] },
  { id: 'hyd-2', category: 'Financial Hub', typeIcon: '🏢', name: 'Financial District Nanakramguda', city: 'Hyderabad', state: 'Telangana', address: 'Financial District, Gachibowli, Hyderabad', coords: [17.4123, 78.3412] },
  { id: 'hyd-3', category: 'Airport', typeIcon: '✈️', name: 'Rajiv Gandhi International Airport (HYD)', city: 'Hyderabad', state: 'Telangana', address: 'Shamshabad, Hyderabad', coords: [17.2403, 78.4294] },

  // KOLKATA & EAST INDIA
  { id: 'kol-1', category: 'Tech Park', typeIcon: '🏢', name: 'Salt Lake Sector V IT Hub', city: 'Kolkata', state: 'West Bengal', address: 'Sector V, Salt Lake City, Kolkata', coords: [22.5726, 88.4312] },
  { id: 'kol-2', category: 'City Hub', typeIcon: '🏙️', name: 'New Town Action Area 1', city: 'Kolkata', state: 'West Bengal', address: 'New Town Rajarhat, Kolkata', coords: [22.5855, 88.4716] },
  { id: 'kol-3', category: 'Airport', typeIcon: '✈️', name: 'Netaji Subhash Chandra Bose Airport (CCU)', city: 'Kolkata', state: 'West Bengal', address: 'Dum Dum, Kolkata', coords: [22.6547, 88.4467] },
  { id: 'kol-4', category: 'Railway Station', typeIcon: '🚆', name: 'Howrah Junction Railway Station', city: 'Kolkata', state: 'West Bengal', address: 'Howrah Bridge Corridor, Howrah, Kolkata', coords: [22.5839, 88.3426] },

  // CHENNAI & SOUTH INDIA
  { id: 'ch-1', category: 'Tech Park', typeIcon: '🏢', name: 'OMR IT Corridor Sholinganallur', city: 'Chennai', state: 'Tamil Nadu', address: 'Old Mahabalipuram Road (OMR), Sholinganallur, Chennai', coords: [12.9010, 80.2279] },
  { id: 'ch-2', category: 'Airport', typeIcon: '✈️', name: 'Chennai International Airport (MAA)', city: 'Chennai', state: 'Tamil Nadu', address: 'Meenambakkam, Chennai', coords: [12.9941, 80.1709] },
  { id: 'kc-1', category: 'Tech Park', typeIcon: '🏢', name: 'InfoPark Kakkanad', city: 'Kochi', state: 'Kerala', address: 'InfoPark Campus, Kakkanad, Kochi', coords: [10.0097, 76.3639] },

  // AHMEDABAD, GUJARAT & RAJASTHAN
  { id: 'ah-1', category: 'Financial Hub', typeIcon: '🏢', name: 'GIFT City Tower Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', address: 'GIFT City, Gandhinagar - Ahmedabad Corridor', coords: [23.1614, 72.6841] },
  { id: 'jp-1', category: 'City Hub', typeIcon: '🏙️', name: 'World Trade Park Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', address: 'JLN Marg, Malviya Nagar, Jaipur', coords: [26.8532, 75.8049] },

  // CENTRAL & NORTH INDIA
  { id: 'lk-1', category: 'Tech Park', typeIcon: '🏢', name: 'Gomti Nagar IT City', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Gomti Nagar Extension, Lucknow', coords: [26.8500, 81.0000] },
  { id: 'ind-1', category: 'City Hub', typeIcon: '🏙️', name: 'Vijay Nagar & Super Corridor', city: 'Indore', state: 'Madhya Pradesh', address: 'Vijay Nagar, AB Road, Indore', coords: [22.7533, 75.8937] },
  { id: 'goa-1', category: 'Airport', typeIcon: '✈️', name: 'Dabolim & Mopa International Airport', city: 'Goa', state: 'Goa', address: 'North & South Goa Corridors, Goa', coords: [15.3808, 73.8314] }
];

export function searchAllIndiaLocations(query, selectedCityFilter = 'All') {
  let list = ALL_INDIA_LOCATIONS;

  if (selectedCityFilter && selectedCityFilter !== 'All') {
    list = list.filter(l => l.city.toLowerCase() === selectedCityFilter.toLowerCase());
  }

  if (!query || !query.trim()) return list.slice(0, 10);

  const cleanQ = query.toLowerCase().trim();

  return list.filter(l => 
    l.name.toLowerCase().includes(cleanQ) || 
    l.address.toLowerCase().includes(cleanQ) ||
    l.city.toLowerCase().includes(cleanQ) ||
    l.category.toLowerCase().includes(cleanQ) ||
    l.state.toLowerCase().includes(cleanQ)
  );
}

export function getDerivedCoords(locationAddress, isDestination = false) {
  if (!locationAddress) return isDestination ? [18.5362, 73.8940] : [18.5912, 73.7389];

  const clean = locationAddress.toLowerCase();
  const preset = ALL_INDIA_LOCATIONS.find(l => 
    l.address.toLowerCase().includes(clean) || 
    l.name.toLowerCase().includes(clean) ||
    l.city.toLowerCase() === clean
  );

  if (preset) return preset.coords;

  let hash = 0;
  for (let i = 0; i < locationAddress.length; i++) {
    hash = locationAddress.charCodeAt(i) + ((hash << 5) - hash);
  }

  const latOffset = (hash % 150) / 1000;
  const lngOffset = (hash % 120) / 1000;

  return isDestination 
    ? [20.5937 + latOffset, 78.9629 + lngOffset]
    : [18.5912 + latOffset, 73.7389 + lngOffset];
}
