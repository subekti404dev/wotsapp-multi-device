import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useWebhooks() {
    const [loading, setLoading] = useState(false);
    const [webhooks, setWebhooks] = useState([]);

    useEffect(() => {
        fetchWebhooks()
    }, []);

    const fetchWebhooks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/webhooks`);
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data?.message || "Something went wrong");
            }
            setLoading(false);
            setWebhooks(data);
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });
        }
    };

    const createWebhook = async (data) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/webhooks/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new Error(data?.message || "Something went wrong");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });

        }
    }

    const updateWebhook = async (id, data) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/webhooks/${id}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new Error(data?.message || "Something went wrong");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });

        }
    }

    const deleteWebhook = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/webhooks/${id}/delete`, {
                method: "DELETE",

            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new Error(data?.message || "Something went wrong");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });

        }
    }

    return [
        {
            webhooks,
            loading
        },
        {
            fetchWebhooks,
            createWebhook,
            updateWebhook,
            deleteWebhook,
        }
    ]
}
