import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useSessions() {
    const [sessions, setSessions] = useState([]);
    useEffect(() => {
        fetchData()
    }, []);
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/sessions`);
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data?.message || "Something went wrong");
            }
            setSessions(data);
        } catch (error) {
            toast.error(error.message, { autoClose: 5000 });

        }
    };
    return [sessions, fetchData]
}
