import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CLEAN_USERS, 
  CLEAN_ORGANIZATIONS, 
  CLEAN_VEHICLES, 
  CLEAN_RIDES, 
  CLEAN_TRIPS, 
  CLEAN_SAVED_PLACES,
  CLEAN_ANALYTICS,
  CLEAN_ADMIN_SETTINGS,
  DEMO_SAMPLE_DATA
} from '../data/mockData';
import { calculateAIMatchScore } from '../utils/aiEngine';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('carpool_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('carpool_user');
    return saved ? JSON.parse(saved) : CLEAN_USERS[0];
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [organizations, setOrganizations] = useState(CLEAN_ORGANIZATIONS);

  const [users, setUsers] = useState(() => {
    const savedDb = localStorage.getItem('carpool_users_db');
    if (savedDb) {
      const dbObj = JSON.parse(savedDb);
      const userList = Object.values(dbObj);
      if (userList.length > 0) return userList;
    }
    const saved = localStorage.getItem('carpool_users');
    return saved ? JSON.parse(saved) : CLEAN_USERS;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('carpool_vehicles');
    return saved ? JSON.parse(saved) : [];
  });

  const [rides, setRides] = useState(() => {
    const saved = localStorage.getItem('carpool_rides');
    return saved ? JSON.parse(saved) : [];
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('carpool_trips');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedPlaces, setSavedPlaces] = useState(() => {
    const saved = localStorage.getItem('carpool_saved_places');
    return saved ? JSON.parse(saved) : [];
  });

  const [analytics, setAnalytics] = useState(CLEAN_ANALYTICS);
  const [adminSettings, setAdminSettings] = useState(CLEAN_ADMIN_SETTINGS);
  
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);

  // Driver Dispatch State
  const [isDriverOnline, setIsDriverOnline] = useState(true); // Online / Offline switcher
  const [nearbyDriverAlert, setNearbyDriverAlert] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: '⚡ Enterprise Carpool persistent state active!', time: 'Just now', unread: true }
  ]);

  // Sync currentUser and usersDb to localStorage on every update so LOGOUT NEVER ERASES USER DATA
  useEffect(() => {
    if (currentUser && currentUser.email) {
      localStorage.setItem('carpool_user', JSON.stringify(currentUser));
      localStorage.setItem('carpool_authenticated', isAuthenticated.toString());

      const savedDb = localStorage.getItem('carpool_users_db');
      const usersDb = savedDb ? JSON.parse(savedDb) : {};
      usersDb[currentUser.email.toLowerCase()] = currentUser;
      localStorage.setItem('carpool_users_db', JSON.stringify(usersDb));

      // Keep users list in sync with real registered users
      const allRealUsers = Object.values(usersDb);
      if (allRealUsers.length > 0) {
        setUsers(allRealUsers);
      }
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('carpool_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('carpool_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('carpool_rides', JSON.stringify(rides));
  }, [rides]);

  useEffect(() => {
    localStorage.setItem('carpool_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('carpool_saved_places', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  // Actions
  const loginUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    addNotification(`Welcome back, ${user.name}! Authenticated to ${user.orgName || 'Enterprise'}`);
  };

  const logoutUser = () => {
    if (currentUser && currentUser.email) {
      const savedDb = localStorage.getItem('carpool_users_db');
      const usersDb = savedDb ? JSON.parse(savedDb) : {};
      usersDb[currentUser.email.toLowerCase()] = currentUser;
      localStorage.setItem('carpool_users_db', JSON.stringify(usersDb));
    }
    
    setIsAuthenticated(false);
    addNotification('Logged out successfully. All user data saved.');
  };

  const resetToFreshState = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentUser(CLEAN_USERS[0]);
    setUsers(CLEAN_USERS);
    setOrganizations(CLEAN_ORGANIZATIONS);
    setVehicles(CLEAN_VEHICLES);
    setRides(CLEAN_RIDES);
    setTrips(CLEAN_TRIPS);
    setSavedPlaces(CLEAN_SAVED_PLACES);
    setAnalytics(CLEAN_ANALYTICS);
    setAdminSettings(CLEAN_ADMIN_SETTINGS);
    setSelectedTripId(null);
    setNearbyDriverAlert(null);
    addNotification('✨ Reset app to 100% fresh clean state!');
  };

  const loadDemoSampleData = () => {
    setCurrentUser(DEMO_SAMPLE_DATA.users[0]);
    setIsAuthenticated(true);
    setUsers(DEMO_SAMPLE_DATA.users);
    setOrganizations(DEMO_SAMPLE_DATA.organizations);
    setVehicles(DEMO_SAMPLE_DATA.vehicles);
    setRides(DEMO_SAMPLE_DATA.rides);
    setTrips(DEMO_SAMPLE_DATA.trips);
    setSavedPlaces(DEMO_SAMPLE_DATA.savedPlaces);
    setAnalytics(DEMO_SAMPLE_DATA.analytics);
    addNotification('🚀 Sample demo data loaded successfully!');
  };

  const switchUserRole = (userId) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      addNotification(`Switched user context to ${found.name} (${found.role.toUpperCase()})`);
    }
  };

  const addNotification = (text) => {
    setNotifications(prev => [
      { id: Date.now(), text, time: 'Just now', unread: true },
      ...prev
    ]);
  };

  const triggerNearbyDriverAlert = (alertData) => {
    setNearbyDriverAlert(alertData);
    addNotification(`🔔 Broadcasted passenger search for ₹${alertData.offeredFare} to nearby drivers within 20 km!`);
  };

  const publishRide = async (rideData) => {
    const aiMatch = calculateAIMatchScore(rideData, {}, currentUser);
    const newRideData = {
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverAvatar: currentUser.avatar,
      driverRating: currentUser.rating || 5.0,
      aiMatchScore: aiMatch.score,
      aiMatchReason: aiMatch.reason,
      status: 'active',
      isOnline: isDriverOnline,
      ...rideData
    };

    let createdRide = await api.publishRide(newRideData);
    if (!createdRide) {
      createdRide = { id: `ride-${Date.now()}`, ...newRideData };
    }

    setRides(prev => [createdRide, ...prev]);
    addNotification(`Ride published successfully from ${createdRide.pickupLocation}! 0% Platform Fee active.`);
    setActiveView('my-trips');
    return createdRide;
  };

  const bookRide = async (ride, seatsCount = 1, paymentMethod = 'Wallet') => {
    const totalFare = ride.farePerSeat * seatsCount;
    
    if (paymentMethod === 'Wallet') {
      if (currentUser.walletBalance < totalFare) {
        alert(`Insufficient Wallet balance (₹${currentUser.walletBalance.toFixed(2)}). Please top up your wallet.`);
        return false;
      }
      setCurrentUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - totalFare
      }));
    }

    const tripId = `trip-${Date.now()}`;
    // Generate 4-digit verification OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const bookedTrip = {
      id: tripId,
      rideId: ride.id,
      passengerId: currentUser.id,
      passengerName: currentUser.name,
      passengerPhone: currentUser.phone || '+91 98765 43210',
      driverId: ride.driverId,
      driverName: ride.driverName,
      driverPhone: ride.driverPhone || '+91 98123 45678',
      vehicleName: ride.vehicleName,
      pickupLocation: ride.pickupLocation,
      dropLocation: ride.dropLocation,
      date: ride.date,
      time: ride.time,
      seatsBooked: seatsCount,
      fareTotal: totalFare,
      paymentMethod,
      paymentStatus: paymentMethod === 'Wallet' ? 'Paid' : 'Pending',
      tripStatus: 'Pending Approval',
      otpCode,
      rideCategory: ride.rideCategory || 'Economy Carpool'
    };

    setTrips(prev => [bookedTrip, ...prev]);
    setSelectedTripId(tripId);
    
    addNotification(`📩 Ride request sent to Driver ${ride.driverName} for ₹${totalFare}! Verification OTP: ${otpCode}`);
    setActiveView('my-trips');
    return true;
  };

  const acceptRideRequest = (tripId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        setRides(rList => rList.map(r => r.id === t.rideId ? { ...r, availableSeats: Math.max(0, r.availableSeats - t.seatsBooked) } : r));
        addNotification(`🎉 Driver ACCEPTED ride request #${tripId.slice(-4)} for ₹${t.fareTotal}! Passenger OTP: ${t.otpCode}`);
        return { ...t, tripStatus: 'Booked' };
      }
      return t;
    }));
  };

  const declineRideRequest = (tripId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        if (t.paymentMethod === 'Wallet' && t.passengerId === currentUser.id) {
          setCurrentUser(prev => ({ ...prev, walletBalance: prev.walletBalance + t.fareTotal }));
        }
        addNotification(`❌ Driver DECLINED ride request #${tripId.slice(-4)}. ₹${t.fareTotal} refunded.`);
        return { ...t, tripStatus: 'Declined' };
      }
      return t;
    }));
  };

  // UPDATE TRIP STATUS & AUTOMATICALLY DISBURSE FARE (₹) TO DRIVER BALANCE
  const updateTripStatus = async (tripId, newStatus) => {
    await api.updateTripStatus(tripId, newStatus);
    
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, tripStatus: newStatus };
        
        if (newStatus === 'Completed') {
          updated.paymentStatus = 'Completed';

          const earnedFare = t.fareTotal || 0;

          // DISBURSE EARNED FARE (₹) TO DRIVER WALLET BALANCE (100% ZERO COMMISSION)
          if (currentUser.id === t.driverId || currentUser.role === 'driver') {
            setCurrentUser(curr => ({
              ...curr,
              walletBalance: (curr.walletBalance || 0) + earnedFare
            }));
          }

          // Update Driver's balance in users list & localStorage database
          setUsers(userList => userList.map(u => {
            if (u.id === t.driverId) {
              const newBal = (u.walletBalance || 0) + earnedFare;
              
              // Sync to carpool_users_db
              const savedDb = localStorage.getItem('carpool_users_db');
              const usersDb = savedDb ? JSON.parse(savedDb) : {};
              if (u.email && usersDb[u.email.toLowerCase()]) {
                usersDb[u.email.toLowerCase()].walletBalance = newBal;
                localStorage.setItem('carpool_users_db', JSON.stringify(usersDb));
              }

              return { ...u, walletBalance: newBal };
            }
            return u;
          }));

          setAnalytics(curr => ({
            ...curr,
            totalTripsCompleted: curr.totalTripsCompleted + 1,
            totalDistanceKm: curr.totalDistanceKm + (t.distanceKm || 12),
            co2SavedKg: curr.co2SavedKg + Math.round((t.distanceKm || 12) * 0.22)
          }));

          addNotification(`🎉 Trip #${tripId.slice(-4)} completed! Disbursed 100% fare (+₹${earnedFare}) to Driver wallet!`);
        }
        return updated;
      }
      return t;
    }));
  };

  const rechargeWallet = async (amount) => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    
    await api.rechargeWallet(currentUser.id, val);
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + val
    }));
    addNotification(`💳 Wallet successfully recharged with +₹${val.toFixed(2)}`);
  };

  const addVehicle = async (vehData) => {
    let createdVeh = await api.addVehicle({
      driverId: currentUser.id,
      ...vehData
    });
    if (!createdVeh) {
      createdVeh = { id: `veh-${Date.now()}`, driverId: currentUser.id, ...vehData };
    }
    setVehicles(prev => [...prev, createdVeh]);
    addNotification(`Registered new vehicle: ${createdVeh.model} (${createdVeh.regNumber})`);
  };

  const addSavedPlace = async (placeData) => {
    let createdPlace = await api.addSavedPlace(placeData);
    if (!createdPlace) {
      createdPlace = { id: `sp-${Date.now()}`, ...placeData };
    }
    setSavedPlaces(prev => [...prev, createdPlace]);
    addNotification(`Saved place '${createdPlace.name}' added to your profile!`);
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    activeView,
    setActiveView,
    organizations,
    users,
    vehicles,
    rides,
    setRides,
    trips,
    setTrips,
    savedPlaces,
    analytics,
    adminSettings,
    setAdminSettings,
    selectedTripId,
    setSelectedTripId,
    nearbyDriverAlert,
    setNearbyDriverAlert,
    triggerNearbyDriverAlert,
    isDriverOnline,
    setIsDriverOnline,
    isChatOpen,
    setIsChatOpen,
    isAICopilotOpen,
    setIsAICopilotOpen,
    isServerOnline,
    notifications,
    loginUser,
    logoutUser,
    switchUserRole,
    publishRide,
    bookRide,
    acceptRideRequest,
    declineRideRequest,
    updateTripStatus,
    rechargeWallet,
    addVehicle,
    addSavedPlace,
    addNotification,
    resetToFreshState,
    loadDemoSampleData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
