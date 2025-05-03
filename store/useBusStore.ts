import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import axiosInstance from '@/api/axios';

export interface Bus {
  _id?: string;
  name: string;
  registrationNumber: string;
  busNumber: string;
  busType: string;
  seatCapacity: number;
  isAC: boolean;
  isExpress: boolean;
  owner?: string;
  __v?: number;
}

interface BusStore {
  myBus: Bus[] | null;
  loading: boolean;
  fetchMyBus: () => Promise<void>;
  addBus: (bus: Bus) => Promise<void>;
  deleteBus: (id: string) => Promise<void>;
  updateBus: (id: string, bus: Partial<Bus>) => Promise<void>;
}

export const useBusStore = create<BusStore>((set, get) => ({
  myBus: null,
  loading: false,

  fetchMyBus: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get('bus/my-buses', {
        headers: {
          'token': useAuthStore.getState().token,
          'Content-Type': 'application/json',
        },
      });
      set({ myBus: data.buses || [] });
    } catch (error) {
      console.error('Error fetching bus data:', error);
    } finally {
      set({ loading: false });
    }
  },

  addBus: async (bus) => {
    try {
      const { data } = await axiosInstance.post('bus/create', bus, {
        headers: {
          'token': useAuthStore.getState().token,
          'Content-Type': 'application/json',
        },
      });
      await get().fetchMyBus();
      return data;
    } catch (error) {
      console.error('Error adding bus:', error);
    }
  },

  deleteBus: async (id) => {
    try {
      await axiosInstance.delete(`bus/delete/${id}`, {
        headers: {
          'token': useAuthStore.getState().token,
          'Content-Type': 'application/json',
        },
      });
      await get().fetchMyBus();
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  },

  updateBus: async (id, bus) => {
    try {
      await axiosInstance.put(`bus/update/${id}`, bus, {
        headers: {
          'token': useAuthStore.getState().token,
          'Content-Type': 'application/json',
        },
      });
      await get().fetchMyBus();
    } catch (error) {
      console.error('Error updating bus:', error);
    }
  },
}));
