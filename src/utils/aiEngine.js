/**
 * EcoDrive AI Engine - Carpooling Intelligence & Heuristics
 */

export function calculateAIMatchScore(ride, searchParams = {}, currentUser = {}) {
  let score = 75; // baseline match score
  let reasons = [];

  // Department / Organization synergy
  if (currentUser.department && ride.driverDepartment === currentUser.department) {
    score += 10;
    reasons.push(`Same Department (${currentUser.department})`);
  } else if (currentUser.orgId === ride.orgId) {
    score += 5;
    reasons.push(`Verified Organization Colleague`);
  }

  // Vehicle Sustainability Bonus
  if (ride.vehicleName?.includes('EV') || ride.vehicleName?.includes('Electric')) {
    score += 10;
    reasons.push('⚡ 100% Zero-Emission Electric Vehicle');
  } else if (ride.vehicleName?.includes('Hybrid')) {
    score += 6;
    reasons.push('🌿 Low-Emission Hybrid Vehicle');
  }

  // Driver Rating Bonus
  if (ride.driverRating >= 4.9) {
    score += 8;
    reasons.push('⭐ Top-Rated Driver (4.9+)');
  }

  // Time & Route Proximity
  if (searchParams.time) {
    score += 5;
    reasons.push('⏱️ Departure time aligns perfectly with your preference');
  }

  // Cap score between 65 and 99
  const finalScore = Math.min(99, Math.max(65, score));
  const primaryReason = reasons.length > 0 
    ? reasons.join(' • ') 
    : 'Direct route overlap with high commute synergy.';

  return {
    score: finalScore,
    reason: primaryReason,
    badgeText: finalScore >= 95 ? '🔥 Top AI Pick' : finalScore >= 90 ? '✨ Great Match' : '👍 Good Option'
  };
}

export function getAIFareRecommendation(distanceKm, fuelType = 'Petrol', fuelPrice = 100) {
  const dist = parseFloat(distanceKm) || 10;
  let baseRatePerKm = 8.5; // INR rate per km

  if (fuelType === 'Electric') baseRatePerKm = 5.0;
  else if (fuelType === 'Hybrid') baseRatePerKm = 6.5;

  const estimatedFuelCost = dist * baseRatePerKm;
  const suggestedSeatFare = Math.ceil((estimatedFuelCost / 3) * 1.1);
  const co2SavedKg = Math.round(dist * 0.21 * 10) / 10;

  return {
    suggestedSeatFare: suggestedSeatFare > 40 ? suggestedSeatFare : 50,
    estimatedFuelCost: estimatedFuelCost.toFixed(2),
    co2SavedKg,
    aiAdvice: `AI Pricing: Fair split rate for ${dist} km route on ${fuelType}. Saves ~${co2SavedKg} kg CO₂!`
  };
}

export function processAICopilotQuery(query, state = {}) {
  const q = query.toLowerCase().trim();
  const user = state.currentUser || { name: 'User', walletBalance: 1250, orgName: 'Enterprise Inc.' };
  const rides = state.rides || [];
  const analytics = state.analytics || { co2SavedKg: 1420, totalTripsCompleted: 88 };

  if (q.includes('find') || q.includes('search') || q.includes('ride') || q.includes('book') || q.includes('pickup')) {
    return {
      type: 'action',
      action: 'NAVIGATE',
      targetView: 'find',
      text: `🤖 **AI Assistant**: I've navigated you to the **Find a Ride** screen. Search by your pickup location to match available drivers in your area!`
    };
  }

  if (q.includes('offer') || q.includes('publish') || q.includes('drive') || q.includes('driver')) {
    return {
      type: 'action',
      action: 'NAVIGATE',
      targetView: 'offer',
      text: `🚗 **AI Assistant**: Opening the **Driver Panel & Offer Ride** screen. Set your pickup zone and start accepting passenger requests!`
    };
  }

  if (q.includes('wallet') || q.includes('balance') || q.includes('money') || q.includes('pay') || q.includes('top up') || q.includes('topup') || q.includes('recharge') || q.includes('upi')) {
    return {
      type: 'action',
      action: 'NAVIGATE',
      targetView: 'wallet',
      text: `💳 **Wallet Overview**: Hello **${user.name}**, your current wallet balance is **₹${(user.walletBalance || 0).toFixed(2)}**. I've opened the **Wallet & UPI Top-Up** view for you!`
    };
  }

  if (q.includes('carbon') || q.includes('co2') || q.includes('tree') || q.includes('saving') || q.includes('report') || q.includes('eco') || q.includes('green')) {
    const co2 = analytics.co2SavedKg || 1420;
    const trips = analytics.totalTripsCompleted || 88;
    return {
      type: 'info',
      text: `🌿 **AI Sustainability Report**: **${user.orgName || 'Enterprise'}** employees have completed **${trips} shared rides**, saving **${co2} kg of CO₂**! That's equivalent to planting **${Math.round(co2 / 20)} trees**.`
    };
  }

  if (q.includes('track') || q.includes('live') || q.includes('location') || q.includes('map') || q.includes('gps')) {
    return {
      type: 'action',
      action: 'NAVIGATE',
      targetView: 'live-tracking',
      text: `📍 **AI Assistant**: Opening **Live GPS Tracking**. You can view real-time CartoDB map telemetry and trip progress!`
    };
  }

  if (q.includes('profile') || q.includes('user') || q.includes('account') || q.includes('age') || q.includes('phone') || q.includes('mobile')) {
    return {
      type: 'action',
      action: 'NAVIGATE',
      targetView: 'profile',
      text: `👤 **Profile Settings**: Navigating to **My Profile**. You can view and update your Name, Age, Mobile Number (+91), Gender, and City!`
    };
  }

  if (q.includes('role') || q.includes('switch') || q.includes('mode') || q.includes('dashboard')) {
    return {
      type: 'action',
      action: 'NAVIGATE',
      targetView: 'dashboard',
      text: `📊 **Dashboard Hub**: Opening **Dashboard**. You can toggle between **Driver Dashboard** and **Passenger Dashboard** anytime!`
    };
  }

  return {
    type: 'info',
    text: `🤖 **EcoDrive AI Copilot**: How can I assist your commute today? Try asking:\n• *"Find me a ride to Tech Park HQ"* \n• *"Check my wallet balance"* \n• *"What is my carbon offset?"* \n• *"Open driver panel"* \n• *"Update my profile"*`
  };
}
