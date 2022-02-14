import { useState } from 'react';
import { toast } from 'react-toastify';

export function useSendMessage() {
    const [isLoading, setLoading] = useState(false);

    const onSendMessage = async (data) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/messages/send`, {
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
            toast.success("Your message has been sent", { autoClose: 5000 });
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });
        }
    };

    return [isLoading, onSendMessage]
}