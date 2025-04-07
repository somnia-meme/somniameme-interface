import api from "@/lib/api";
import { create } from "zustand";


export type User = {
    displayName: string;
    address: string;
    created_at: string;
}

export type UserStore = {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User) => void;
    getUser: () => Promise<User | null>;
    generateToken: (signature: string, message: string) => Promise<void>;
    login: (user: any) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user: User) => set({ user }),

    getUser: async () => {
        const response = await api.get("/user/me");
        return response.data as User;
    },

    login: (user: any) => set({ user, isLoggedIn: true }),

    generateToken: async (signature: string, message: string) => {
        const response = await api.post("/user/verify-signature", {
            signature,
            message
        });

        const token = response.data.token;

        localStorage.setItem("token", token);

        return token;
    },

    logout: () => {
        localStorage.removeItem("token");
        set({
            user: null,
            isLoggedIn: false
        });
    }
}));

