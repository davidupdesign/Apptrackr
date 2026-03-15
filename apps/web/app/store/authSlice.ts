import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  // checking localStorage for existing token on app load
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // calling after login or register - storing the torken
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
      // also set a cookie so middlewate can read it on server
      document.cookie = `token=${action.payload}; path=/; max-age=${60 * 60 * 24 * 7} `;
    },

    // calling aftet GET /auth/me - storing the user data
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    // calling on logout - clearing evrything
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      // clears the cookie
      document.cookie = "token=; path=/; max-age=0";
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
