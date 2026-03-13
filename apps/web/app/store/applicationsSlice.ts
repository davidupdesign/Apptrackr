import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Application {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  appliedAt: string;
  notes?: string | null;
  salary?: number | null;
  url?: string | null;
  updatedAt: string;
}

export interface ApplicationsState {
  list: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  list: [],
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setApplications(state, action: PayloadAction<Application[]>) {
      state.list = action.payload;
    },
    addApplication(state, action: PayloadAction<Application>) {
      state.list.unshift(action.payload); // add to the front
    },
    updateApplication(state, action: PayloadAction<Application>) {
      const index = state.list.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    removeApplication(state, action: PayloadAction<string>) {
      state.list = state.list.filter((a) => a.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  setLoading,
  setError,
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
