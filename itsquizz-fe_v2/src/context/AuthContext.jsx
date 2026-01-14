/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const response = await authService.getStatus();
            if (response.data.logged_in) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem("token");
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
            setUser(response.data.user);
            setIsAuthenticated(true);
        }
        return response;
    };

    const register = async (data) => {
        return await authService.register(data);
    };

    const logout = async () => {
        try {
            // Optional: Call backend to blacklist token
            // await authService.logout(); 
        } finally {
            localStorage.removeItem("token");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

// Convenience hook


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
