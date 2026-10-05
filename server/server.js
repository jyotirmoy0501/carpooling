import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carpool';

app.use(cors());
app.use(express.json());

// MongoDB Connection State Flag
let isMongoConnected = false;

// 🍃 MongoDB Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  role: String,
  orgId: String,
  orgName: String,
  department: String,
  avatar: String,
  phone: String,
  rating: Number,
  tripsCompleted: Number,
  walletBalance: Number,
  isDriver: Boolean
}, { timestamps: true });

const vehicleSchema = new mongoose.Schema({
  id: String,
  driverId: String,
  model: String,
  regNumber: String,
  color: String,
  capacity: Number,
  fuelType: String,
  efficiencyKmL: Number
}, { timestamps: true });

const rideSchema = new mongoose.Schema({
  id: String,
  driverId: String,
  driverName: String,
  driverAvatar: String,
  driverRating: Number,
  vehicleId: String,
  vehicleName: String,
  pickupLocation: String,
  pickupCoords: [Number],
  dropLocation: String,
  dropCoords: [Number],
  date: String,
  time: String,
  availableSeats: Number,
  totalSeats: Number,
  farePerSeat: Number,
  distanceKm: Number,
  durationMins: Number,
  aiMatchScore: Number,
  aiMatchReason: String,
  status: String
}, { timestamps: true });

const tripSchema = new mongoose.Schema({
  id: String,
  rideId: String,
  passengerId: String,
  passengerName: String,
  driverId: String,
  driverName: String,
  driverPhone: String,
  vehicleName: String,
  pickupLocation: String,
  dropLocation: String,
  date: String,
  time: String,
  seatsBooked: Number,
  fareTotal: Number,
  paymentMethod: String,
  paymentStatus: String,
  tripStatus: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const Ride = mongoose.model('Ride', rideSchema);
const Trip = mongoose.model('Trip', tripSchema);

// Connect to MongoDB with graceful fallback to db.json
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2000
})
.then(() => {
  isMongoConnected = true;
  console.log(`🍃 Connected successfully to MongoDB Database: ${MONGODB_URI}`);
})
.catch((err) => {
  isMongoConnected = false;
  console.log(`ℹ️ MongoDB connection not active (${err.message}). Using JSON File Storage DB (server/db.json).`);
});

// Helper DB Read/Write for JSON Fallback
function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    dbType: isMongoConnected ? 'MongoDB' : 'JSON File (db.json)',
    time: new Date().toISOString(), 
    message: isMongoConnected ? '🍃 Enterprise Express connected to MongoDB' : '📁 Enterprise Express running on JSON File Storage' 
  });
});

// 2. Users Endpoint
app.get('/api/users', async (req, res) => {
  if (isMongoConnected) {
    const users = await User.find({});
    return res.json(users);
  }
  const db = readDb();
  res.json(db.users || []);
});

// 3. Vehicles Endpoint
app.get('/api/vehicles', async (req, res) => {
  if (isMongoConnected) {
    const vehicles = await Vehicle.find({});
    return res.json(vehicles);
  }
  const db = readDb();
  res.json(db.vehicles || []);
});

app.post('/api/vehicles', async (req, res) => {
  const newVehData = { id: `veh-${Date.now()}`, ...req.body };
  if (isMongoConnected) {
    const created = await Vehicle.create(newVehData);
    return res.status(201).json(created);
  }
  const db = readDb();
  db.vehicles = [newVehData, ...(db.vehicles || [])];
  writeDb(db);
  res.status(201).json(newVehData);
});

// 4. Rides Endpoint
app.get('/api/rides', async (req, res) => {
  if (isMongoConnected) {
    const rides = await Ride.find({ status: 'active' });
    return res.json(rides);
  }
  const db = readDb();
  res.json(db.rides || []);
});

app.post('/api/rides', async (req, res) => {
  const newRideData = {
    id: `ride-${Date.now()}`,
    aiMatchScore: 95,
    aiMatchReason: 'Direct route overlap & high commute synergy',
    status: 'active',
    ...req.body
  };
  if (isMongoConnected) {
    const created = await Ride.create(newRideData);
    return res.status(201).json(created);
  }
  const db = readDb();
  db.rides = [newRideData, ...(db.rides || [])];
  writeDb(db);
  res.status(201).json(newRideData);
});

// 5. Trips Endpoint
app.get('/api/trips', async (req, res) => {
  if (isMongoConnected) {
    const trips = await Trip.find({});
    return res.json(trips);
  }
  const db = readDb();
  res.json(db.trips || []);
});

app.post('/api/trips/book', async (req, res) => {
  const { ride, seatsNeeded = 1, paymentMethod = 'Wallet', userId, userName } = req.body;
  const totalFare = (ride.farePerSeat || 8) * seatsNeeded;

  const newTripData = {
    id: `trip-${Date.now()}`,
    rideId: ride.id,
    passengerId: userId,
    passengerName: userName || 'Passenger',
    driverId: ride.driverId,
    driverName: ride.driverName,
    driverPhone: '+1 (555) 234-5678',
    vehicleName: ride.vehicleName,
    pickupLocation: ride.pickupLocation,
    dropLocation: ride.dropLocation,
    date: ride.date,
    time: ride.time,
    seatsBooked: seatsNeeded,
    fareTotal: totalFare,
    paymentMethod,
    paymentStatus: paymentMethod === 'Wallet' ? 'Paid' : 'Pending',
    tripStatus: 'Booked'
  };

  if (isMongoConnected) {
    const createdTrip = await Trip.create(newTripData);
    await Ride.updateOne({ id: ride.id }, { $inc: { availableSeats: -seatsNeeded } });
    if (paymentMethod === 'Wallet') {
      await User.updateOne({ id: userId }, { $inc: { walletBalance: -totalFare } });
    }
    return res.status(201).json(createdTrip);
  }

  const db = readDb();
  if (paymentMethod === 'Wallet') {
    db.users = (db.users || []).map(u => u.id === userId ? { ...u, walletBalance: Math.max(0, u.walletBalance - totalFare) } : u);
  }
  db.rides = (db.rides || []).map(r => r.id === ride.id ? { ...r, availableSeats: Math.max(0, r.availableSeats - seatsNeeded) } : r);
  db.trips = [newTripData, ...(db.trips || [])];
  writeDb(db);
  res.status(201).json(newTripData);
});

app.patch('/api/trips/:id/status', async (req, res) => {
  const { id } = req.params;
  const { tripStatus } = req.body;

  if (isMongoConnected) {
    const updated = await Trip.findOneAndUpdate({ id }, { tripStatus, paymentStatus: tripStatus === 'Completed' ? 'Completed' : 'Pending' }, { new: true });
    return res.json(updated);
  }

  const db = readDb();
  let updatedTrip = null;
  db.trips = (db.trips || []).map(t => {
    if (t.id === id) {
      updatedTrip = { ...t, tripStatus, paymentStatus: tripStatus === 'Completed' ? 'Completed' : 'Pending' };
      return updatedTrip;
    }
    return t;
  });
  writeDb(db);
  res.json(updatedTrip || { success: true });
});

// 6. Wallet Endpoint
app.post('/api/wallet/recharge', async (req, res) => {
  const { userId, amount } = req.body;
  const val = parseFloat(amount);

  if (isMongoConnected) {
    const updated = await User.findOneAndUpdate({ id: userId }, { $inc: { walletBalance: val } }, { new: true });
    return res.json({ success: true, walletBalance: updated?.walletBalance || 0 });
  }

  const db = readDb();
  let updatedUser = null;
  db.users = (db.users || []).map(u => {
    if (u.id === userId) {
      updatedUser = { ...u, walletBalance: (u.walletBalance || 0) + val };
      return updatedUser;
    }
    return u;
  });
  writeDb(db);
  res.json({ success: true, walletBalance: updatedUser?.walletBalance || 0 });
});

// 7. Saved Places Endpoint
app.get('/api/saved-places', (req, res) => {
  const db = readDb();
  res.json(db.savedPlaces || []);
});

// 8. Admin Settings Endpoint
app.get('/api/admin/settings', (req, res) => {
  const db = readDb();
  res.json(db.adminSettings || {});
});

// 9. Analytics Endpoint
app.get('/api/analytics', (req, res) => {
  const db = readDb();
  res.json(db.analytics || {});
});

// 10. AI Copilot Endpoint
app.post('/api/ai/copilot', (req, res) => {
  const { query } = req.body;
  const q = (query || '').toLowerCase();

  if (q.includes('find') || q.includes('search')) {
    return res.json({
      action: 'NAVIGATE',
      targetView: 'find',
      text: '🤖 **MongoDB AI**: Navigated to **Find a Ride** screen.'
    });
  }

  res.json({
    text: '🤖 **Enterprise MongoDB Express AI**: How can I optimize your corporate commute today?'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Enterprise Carpool Express Server running on http://localhost:${PORT}`);
  console.log(`🍃 MongoDB URI configured: ${MONGODB_URI}`);
});
