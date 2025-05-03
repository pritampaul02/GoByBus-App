import axiosInstance from '@/api/axios';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

interface BusSchedule {
  _id: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: number;
  schedule: {
    _id: string;
    arrivalTime: string;
    stand: {
      _id: string;
      name: string;
      distance: number;
      price: number;
    };
  }[];
}

interface BusStopStore {
  schedulesByBus: Record<string, BusSchedule | null>;
  loading: boolean;
  fetchSchedules: (busId: string) => Promise<void>;
  deleteSchedule: (busId: string, scheduleId: string) => Promise<void>;
}

export const useBusStopStore = create<BusStopStore>((set, get) => ({
  schedulesByBus: {},
  loading: false,

  fetchSchedules: async (busId) => {
    try {
      set({ loading: true });

      const token = useAuthStore.getState().token;
      const { data } = await axiosInstance.get(`schedule/bus/${busId}`, {
        headers: { token },
      });

      console.log('🚀 ~ fetchSchedules: ~ data:', data);

      if (!data?.schedule) {
        throw new Error('Invalid schedule response');
      }

      set((state) => ({
        schedulesByBus: {
          ...state.schedulesByBus,
          [busId]: data.schedule,
        },
        loading: false,
      }));
    } catch (error) {
      console.error('Fetch schedule error:', error);
      set((state) => ({
        schedulesByBus: {
          ...state.schedulesByBus,
          [busId]: null,
        },
        loading: false,
      }));
    }
  },

  deleteSchedule: async (busId, scheduleId) => {
    try {
      const token = useAuthStore.getState().token;

      await axiosInstance.delete(`schedule/${scheduleId}`, {
        headers: { token },
      });

      set((state) => ({
        schedulesByBus: {
          ...state.schedulesByBus,
          [busId]: null, // Clear schedule after deletion
        },
      }));
    } catch (error) {
      console.error('Delete schedule error:', error);
      throw error;
    }
  },
}));
