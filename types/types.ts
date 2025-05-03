export interface Stand {
  _id: string;
  name: string;
}

export interface RecentSearch {
  id: string;
  from: string;
  to: string;
  fromId: string;
  toId: string;
}

export interface SearchStore {
  stands: Stand[];
  recentSearches: RecentSearch[];
  loading: boolean;
  fetchStands: () => Promise<void>;
  searchBuses: (sourceId: string, destId: string) => Promise<any>;
  addRecentSearch: (search: RecentSearch) => void;
  clearRecentSearches: () => void;
}
