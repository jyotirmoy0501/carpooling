/**
 * Clean Fresh Initial Dataset for Enterprise Carpooling Platform
 */

export const CLEAN_ORGANIZATIONS = [
  { id: 'org-1', name: 'EcoDrive Community', domain: 'ecodrive.com', employeeCount: 1, carbonTargetKg: 10000 },
];

export const CLEAN_USERS = [
  {
    id: 'usr-me',
    name: 'Commuter User',
    email: 'user@ecodrive.com',
    role: 'passenger',
    orgId: 'org-1',
    orgName: 'EcoDrive Community',
    department: 'General',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    rating: 5.0,
    tripsCompleted: 0,
    walletBalance: 500.00,
    isDriver: true,
  },
  {
    id: 'usr-admin',
    name: 'Platform Admin',
    email: 'admin@ecodrive.com',
    role: 'admin',
    orgId: 'org-1',
    orgName: 'EcoDrive Community',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98123 45678',
    rating: 5.0,
    tripsCompleted: 0,
    walletBalance: 1000.00,
    isDriver: false,
  }
];

export const CLEAN_VEHICLES = [];

export const CLEAN_SAVED_PLACES = [];

export const CLEAN_RIDES = [];

export const CLEAN_TRIPS = [];

export const CLEAN_ANALYTICS = {
  totalTripsCompleted: 0,
  totalDistanceKm: 0,
  co2SavedKg: 0,
  totalFuelCostSavedUSD: 0.00,
  monthlyTrends: [
    { month: 'Jan', trips: 0, distance: 0, co2: 0, cost: 0 },
    { month: 'Feb', trips: 0, distance: 0, co2: 0, cost: 0 },
    { month: 'Mar', trips: 0, distance: 0, co2: 0, cost: 0 },
  ],
  vehicleWiseAnalysis: []
};

export const CLEAN_ADMIN_SETTINGS = {
  fuelPricePerLiter: 1.65,
  defaultCostPerKm: 0.35,
  companySubsidyPct: 20,
  allowedDomains: ['enterprise.com'],
  autoApproveVerifiedDrivers: true,
  requireVehicleInspection: true,
  maxDetourMins: 15,
};

/* Optional Demo Sample Data for instant 1-click seeding */
export const DEMO_SAMPLE_DATA = {
  organizations: [
    { id: 'org-1', name: 'Global Enterprise Corp', domain: 'enterprise.com', employeeCount: 1420, carbonTargetKg: 50000 },
    { id: 'org-2', name: 'TechLabs Enterprises', domain: 'techlabs.com', employeeCount: 850, carbonTargetKg: 30000 }
  ],
  users: [
    {
      id: 'usr-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@enterprise.com',
      role: 'employee',
      orgId: 'org-1',
      orgName: 'Global Enterprise Corp',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210',
      rating: 4.9,
      tripsCompleted: 48,
      walletBalance: 125.50,
      isDriver: true,
    },
    {
      id: 'usr-2',
      name: 'Rahul Sharma',
      email: 'rahul.s@enterprise.com',
      role: 'employee',
      orgId: 'org-1',
      orgName: 'Global Enterprise Corp',
      department: 'Product Design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98123 45678',
      rating: 4.8,
      tripsCompleted: 32,
      walletBalance: 78.00,
      isDriver: true,
    },
    {
      id: 'usr-admin',
      name: 'Alex Morgan (Admin)',
      email: 'admin@enterprise.com',
      role: 'admin',
      orgId: 'org-1',
      orgName: 'Global Enterprise Corp',
      department: 'Operations & Admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+91 99999 00000',
      rating: 5.0,
      tripsCompleted: 120,
      walletBalance: 500.00,
      isDriver: false,
    }
  ],
  vehicles: [
    {
      id: 'veh-1',
      driverId: 'usr-1',
      model: 'Tesla Model 3 (EV)',
      regNumber: 'EV-88-EP',
      color: 'Deep Blue Metallic',
      capacity: 4,
      fuelType: 'Electric',
      efficiencyKmL: 5.5,
    },
    {
      id: 'veh-2',
      driverId: 'usr-2',
      model: 'Toyota Prius Hybrid',
      regNumber: 'HY-42-EP',
      color: 'Silver Grey',
      capacity: 3,
      fuelType: 'Hybrid',
      efficiencyKmL: 24.5,
    }
  ],
  savedPlaces: [
    { id: 'sp-1', name: 'Home (Baner High Street)', address: 'Baner Road, Balewadi High Street, Pune', lat: 18.5590, lng: 73.7868, category: 'home' },
    { id: 'sp-2', name: 'Work (Hinjawadi IT Park)', address: 'Hinjawadi Phase 1, Rajiv Gandhi IT Park, Pune', lat: 18.5912, lng: 73.7389, category: 'work' },
  ],
  rides: [
    {
      id: 'ride-101',
      driverId: 'usr-1',
      driverName: 'Sarah Jenkins',
      driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      driverRating: 4.9,
      vehicleId: 'veh-1',
      vehicleName: 'Tesla Model 3 (EV)',
      pickupLocation: 'Hinjawadi Infotech Park Phase 1, Pune',
      pickupCoords: [18.5912, 73.7389],
      dropLocation: 'Koregaon Park, Pune',
      dropCoords: [18.5362, 73.8940],
      date: '2026-08-15',
      time: '08:30 AM',
      availableSeats: 3,
      totalSeats: 4,
      farePerSeat: 150.00,
      distanceKm: 16.5,
      durationMins: 32,
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      aiMatchScore: 98,
      aiMatchReason: 'Direct overlap with your morning commute & EV zero-emission bonus!',
      status: 'active',
    }
  ],
  trips: [],
  analytics: {
    totalTripsCompleted: 48,
    totalDistanceKm: 620,
    co2SavedKg: 142,
    totalFuelCostSavedUSD: 210.00,
    monthlyTrends: [
      { month: 'Jun', trips: 12, distance: 150, co2: 35, cost: 50 },
      { month: 'Jul', trips: 16, distance: 210, co2: 48, cost: 72 },
      { month: 'Aug', trips: 20, distance: 260, co2: 59, cost: 88 },
    ],
    vehicleWiseAnalysis: [
      { name: 'EVs (Tesla)', count: 28, avgCo2Saved: 3.4, costPerKm: 0.12 },
      { name: 'Hybrids (Prius)', count: 20, avgCo2Saved: 2.2, costPerKm: 0.18 },
    ]
  }
};
