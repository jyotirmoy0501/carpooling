const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getRides() {
    try {
      const res = await fetch(`${API_BASE_URL}/rides`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async publishRide(rideData) {
    try {
      const res = await fetch(`${API_BASE_URL}/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rideData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async getVehicles() {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async addVehicle(vehData) {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async bookRide(bookingData) {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateTripStatus(tripId, tripStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/${tripId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripStatus })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async rechargeWallet(userId, amount) {
    try {
      const res = await fetch(`${API_BASE_URL}/wallet/recharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async getSavedPlaces() {
    try {
      const res = await fetch(`${API_BASE_URL}/saved-places`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async addSavedPlace(placeData) {
    try {
      const res = await fetch(`${API_BASE_URL}/saved-places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async getAdminSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateAdminSettings(settings) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
