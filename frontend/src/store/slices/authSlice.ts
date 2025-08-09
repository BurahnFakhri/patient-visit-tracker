import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; 

interface AuthState {
  token: string | null;
  user: any | null;
  role: "clinician" | "patient" | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user") || null,
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; user: any; role: "clinician" | "patient" }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("role", action.payload.role);
    },
    updateAuthUser: (
      state,
      action: PayloadAction<{ user: any;  }>
    ) => {
      state.user = action.payload.user;
      localStorage.setItem("user", action.payload.user);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { setAuth, logout, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;
