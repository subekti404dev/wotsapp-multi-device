import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useSessions() {
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/sessions`);
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data?.message || "Something went wrong");
            }
            setLoading(false);
            setSessions(data);
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });
        }
    };
    return [
        {
            sessions,
            loading
        },
        fetchData
    ]
}
