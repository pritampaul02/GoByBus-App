import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { SearchStore } from '@/types/types';

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      stands: [],
      loading: false,
      recentSearches: [],

      fetchStands: async () => {
        try {
          set({ loading: true });
          const token = useAuthStore.getState().token;
          const { data } = await axiosInstance.get('/schedule/stands', {
            headers: { token },
          });
          set({ stands: data.stands || [], loading: false });
        } catch (error) {
          console.error('Error fetching stands:', error);
          set({ loading: false });
        }
      },

      searchBuses: async (sourceId, destId) => {
        try {
          set({ loading: true });
          const token = useAuthStore.getState().token;
          const { data } = await axiosInstance.get(
            `schedule/search?source=${sourceId}&destination=${destId}`,
            { headers: { token } },
          );
          set({ loading: false });
          return data;
        } catch (error) {
          console.error('Search error:', error);
          set({ loading: false });
          throw error;
        }
      },

      addRecentSearch: (search) => {
        set((state) => {
          const filtered = state.recentSearches.filter(
            (item) => !(item.fromId === search.fromId && item.toId === search.toId),
          );
          const updatedSearches = [search, ...filtered.slice(0, 4)];
          return { recentSearches: updatedSearches };
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    },
  ),
);

// import { create } from 'zustand';
// import axiosInstance from '@/api/axios';
// import { useAuthStore } from '@/store/useAuthStore';
// import { SearchStore } from '@/types/types';

// export const useSearchStore = create<SearchStore>((set, get) => ({
//   stands: [],
//   recentSearches: [],
//   loading: false,

//   fetchStands: async () => {
//     try {
//       set({ loading: true });
//       const token = useAuthStore.getState().token;
//       const { data } = await axiosInstance.get('/schedule/stands', {
//         headers: { token },
//       });
//       set({ stands: data.stands || [], loading: false });
//     } catch (error) {
//       console.error('Error fetching stands:', error);
//       set({ loading: false });
//     }
//   },

//   searchBuses: async (sourceId, destId) => {
//     try {
//       set({ loading: true });
//       const token = useAuthStore.getState().token;
//       const { data } = await axiosInstance.get(
//         `schedule/search?source=${sourceId}&destination=${destId}`,
//         { headers: { token } },
//       );
//       set({ loading: false });
//       return data;
//     } catch (error) {
//       console.error('Search error:', error);
//       set({ loading: false });
//       throw error;
//     }
//   },

//   addRecentSearch: (search) => {
//     set((state) => {
//       const filtered = state.recentSearches.filter(
//         (item) => !(item.fromId === search.fromId && item.toId === search.toId),
//       );
//       return { recentSearches: [search, ...filtered.slice(0, 4)] };
//     });
//   },
// }));
