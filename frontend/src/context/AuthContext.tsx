import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
    email: string;
    full_name?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, fullName: string, role: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Ideally, we'd have a /me endpoint to validate token and get user details
                    // For now, we'll decode the token or just trust it exists + simple backend check if needed
                    // Let's implement a quick decode or assume logged in if token exists for this step
                    // Better: Let's rely on the token being valid. 
                    // To actually get user data, we need a payload or an endpoint. 
                    // Our Login returns {access_token, token_type}.
                    // We'll decode the JWT here to get the email/role.

                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    setUser({
                        email: payload.sub,
                        role: payload.role
                    });
                    setToken(storedToken);
                } catch (error) {
                    console.error("Invalid token", error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', {
            username: email,
            password: password
        });
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        setToken(access_token);

        // Decode token to set user state immediately
        const payload = JSON.parse(atob(access_token.split('.')[1]));
        setUser({
            email: payload.sub,
            role: payload.role
        });
    };

    const signup = async (email: string, password: string, fullName: string, role: string) => {
        await api.post('/auth/register', {
            email,
            password,
            full_name: fullName,
            role
        });
        // Auto-login after signup? Or require login. 
        // Let's require login for simplicity in flow or just call login()
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
