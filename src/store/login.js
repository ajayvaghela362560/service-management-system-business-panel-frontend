import { create } from "zustand";

export const useSaveTokenStore = create()((set) => ({
  token: localStorage.getItem('user-token') ?? "",
  setToken: (token) => {
    localStorage.setItem('user-token', token);
    set(() => ({ token }))
  },
  logOut: () => {
    localStorage.removeItem('user-token');
    set(() => ({ token: null }))
  },
}));