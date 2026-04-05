import api from './Axiosinstance';

const busService = {
  getBusTrips: async (params = {}) => {
    const res = await api.get('/buses', { params });
    return res.data;
  },

  getBusSeatMap: async (tripId) => {
    const res = await api.get(`/buses/${tripId}/seats`);
    return res.data;
  },

  createBusBooking: async (payload) => {
    const res = await api.post('/buses/bookings', payload);
    return res.data;
  },

  confirmBusPayment: async (bookingId, payload) => {
    const res = await api.put(`/buses/bookings/${bookingId}/confirm-payment`, payload);
    return res.data;
  },

  getBusBookingById: async (bookingId) => {
    const res = await api.get(`/buses/bookings/${bookingId}`);
    return res.data;
  },
};

export default busService;
