import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth : true ,
  isLoggingOut : false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Signup successful!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
      set({ user: null, isSigningUp: false });
    }
  },

  login: async (credentials) => {
    try {
        set({isLoggingIn : true})
      const response = await axios.post("/api/v1/auth/login", credentials);
      console.log(response);
      console.log(credentials)
      set({ user: response.data.user, isLoggingIn: false });
      toast.success("login successful!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
      set({ user: null, isLoggingIn: false });
    }
  },

  logout: async () => {
    set({isLoggingOut :true})
    try{
        await axios.post("api/v1/auth/logout")
        set({user: null, isLoggingOut : false})
        toast.success("Logout Sueccessfully!");

    }
    catch(error){
    console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
      set({ isLoggingOut : false });      
    }
  },

  authCheck: async () => {
    set({isCheckingAuth : true})
    try {
        const response = await axios.get("/api/v1/auth/authCheck")
        set({user : response.data.user, isCheckingAuth :false})
    }
    catch(error){
        set({isCheckingAuth : false, user : null})
    }
  },
}));
