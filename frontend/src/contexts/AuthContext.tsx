import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    fullName: string;
    email: string;
    userType: "candidate" | "recruiter";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (fullName: string, email: string, password: string, userType: "candidate" | "recruiter") => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    const isAuthenticated = !!token && !!user;

    const login = async (email: string, password: string) => {
        // TODO: Replace with actual API call
        // const response = await api.post('/auth/login', { email, password });
        // For now, mock login:
        const mockUser: User = {
            id: "1",
            fullName: "John Doe",
            email,
            userType: email.includes("recruiter") ? "recruiter" : "candidate",
        };
        const mockToken = "mock-jwt-token-" + Date.now();
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", mockToken);
    };

    const signup = async (fullName: string, email: string, password: string, userType: "candidate" | "recruiter") => {
        // TODO: Replace with actual API call
        // const response = await api.post('/auth/signup', { fullName, email, password, userType });
        const mockUser: User = { id: "1", fullName, email, userType };
        const mockToken = "mock-jwt-token-" + Date.now();
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", mockToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
