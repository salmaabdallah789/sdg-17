import axios from 'axios';
import { Scenario, FinalSummary } from '../types/game';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  async getScenarios(): Promise<Scenario[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/scenarios`, {
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error in getScenarios:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
      }
      throw error;
    }
  },

  async getScenario(id: string): Promise<Scenario> {
    const response = await axios.get(`${API_BASE_URL}/scenarios/${id}`);
    return response.data;
  },

  async processDecision(data: { currentState: any; decision: any }) {
    const response = await axios.post(`${API_BASE_URL}/simulate/decision`, data);
    return response.data;
  },

  async generateSummary(gameState: any): Promise<FinalSummary> {
    const response = await axios.post(`${API_BASE_URL}/simulate/summary`, { gameState });
    return response.data;
  }
};

