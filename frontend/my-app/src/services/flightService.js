import Axiosinstance from "./Axiosinstance";

const flightService = {
  // Search flights
  searchFlights: async (params) => {
    try {
      const response = await Axiosinstance.get("/flights/search", {
        params: {
          departure: params.departure,
          arrival: params.arrival,
          departDate: params.departDate,
          returnDate: params.returnDate,
          passengers: params.passengers,
          tripType: params.tripType,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all flights (with filters)
  getFlights: async (filters = {}) => {
    try {
      const response = await Axiosinstance.get("/flights", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get flight by ID
  getFlightById: async (flightId) => {
    try {
      const response = await Axiosinstance.get(`/flights/${flightId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get airlines
  getAirlines: async () => {
    try {
      const response = await Axiosinstance.get("/flights/airlines");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get airports
  getAirports: async () => {
    try {
      const response = await Axiosinstance.get("/flights/airports");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Book a flight
  bookFlight: async (flightId, bookingData) => {
    try {
      const response = await Axiosinstance.post(`/flights/${flightId}/book`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get flight prices
  getPrices: async (departure, arrival) => {
    try {
      const response = await Axiosinstance.get("/flights/prices", {
        params: { departure, arrival },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default flightService;
