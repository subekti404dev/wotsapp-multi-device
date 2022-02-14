import { useState } from 'react';
import { toast } from 'react-toastify';
import { setCookies, removeCookies } from 'cookies-next';

export function useLogin() {
    const [loading, setLoading] = useState(false);

    const login = async (username, password, callback = null) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data?.message || "Something went wrong");
            }
            const token = data.token;
            setCookies('x-app-token', token);
            setLoading(false);
            if (callback) callback();
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });
        }
    };

    const logout = async (callback = null) => {
        removeCookies('x-app-token')
        if (callback) callback();
    }

    return [loading, { login, logout }]
}
