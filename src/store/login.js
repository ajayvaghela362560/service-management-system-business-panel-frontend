import { create } from "zustand";
import Cookies from "js-cookie";

export const useSaveTokenStore = create((set) => ({
  token: typeof window !== "undefined" ? Cookies.get("user-token") ?? "" : "",
  setToken: (token) => {
    Cookies.set("user-token", token, { expires: 7, sameSite: "Strict" });
    set(() => ({ token }));
  },
  logOut: () => {
    Cookies.remove("user-token");
    set(() => ({ token: null }));
  },
}));