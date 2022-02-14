import { useState } from 'react';
import { toast } from 'react-toastify';

export function useResendMessage() {
    const [isLoading, setLoading] = useState(false);
    const doResend = async (data) => {
        try {
            setLoading(true);
            await fetch(`/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error(error.message, { autoClose: 5000 });
        }
    }

    return [isLoading, async (data) => doResend(data)]
}