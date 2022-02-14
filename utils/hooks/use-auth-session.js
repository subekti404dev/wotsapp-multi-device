import { useState, useEffect } from 'react';
import { getCookie, removeCookies } from 'cookies-next';

export function useAuthSession(router, redirectUrl, loginUrl = '/') {
    const [loading, setLoading] = useState(false);

    const verify = async () => {
        try {
            setLoading(true);
            const token = getCookie('x-app-token');
            const response = await fetch(`/api/auth/verify`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data?.message || "Something went wrong");
            }

            setLoading(false);
            router.push(redirectUrl);
        } catch (error) {
            setLoading(false);
            removeCookies('x-app-token');
            router.push(loginUrl || '/');
        }
    };

    useEffect(() => {
        verify();
    }, [])

    return [loading]
}
