import { getLayout } from '@/layouts/dashboard';
import { ScaleLoader } from "react-spinners";
import { Box, Button, useColorModeValue, Input, Select, Textarea, FormControl, FormLabel } from '@chakra-ui/core';
import React from 'react';
import { toast } from 'react-toastify';

const InitialData = {
    session_id: null,
    number: '',
    message: '',
    image_url: '',
}

const DashboardSendMessage = () => {
    const [data, setData] = React.useState(InitialData);
    const [sessions, setSessions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await fetch(`/api/sessions`);
        const sessions = await res.json();
        setSessions(sessions);
        if (sessions.length > 0) {
            setData({
                ...data,
                session_id: sessions[0].session_id,
            });
        }
    };

    const isDark = useColorModeValue(false, true);

    const onSendMessage = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId: data.session_id,
                    number: data.number,
                    text: data.message,
                    image_url: data?.image_url || null,
                }),
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new Error(data?.message || "Something went wrong");
            }
            setData({ ...InitialData, session_id: data.session_id });
            setLoading(false);
            toast.success("Your message has been sent", {autoClose: 5000});
        } catch (error) {
            setLoading(false);
            toast.error(error.message, {autoClose: 5000});
        }
    };

    const disabledButton = !data.session_id || !data.number || !data.message;
    const disabledInput = loading || sessions.length === 0;

    return (
        <>
            <FormControl>
                <FormLabel>Session</FormLabel>
                {sessions.length > 0 && (
                    <Select
                        onChange={(e) => setData({ ...data, session_id: e.target.value })}
                        disabled={loading}
                        style={{ backgroundColor: isDark ? "#2d3748" : "#f5f5f5" }}
                    >
                        {sessions.map((session) => (
                            <option
                                style={{ backgroundColor: isDark ? "#2d3748" : "#f5f5f5" }}
                                key={session.session_id}
                                value={session.session_id}
                                selected={data.session_id === session.session_id}
                            >
                                {session.session_id}
                            </option>
                        ))}
                    </Select>
                )}
                {sessions.length === 0 && (
                    <Input
                        type="text"
                        style={{
                            backgroundColor: isDark ? "#2d3748" : "#f5f5f5",
                            color: isDark ? "#f5f5f5" : "#2d3748"
                        }}
                        disabled
                        placeholder="No Session Available"
                    />
                )}
            </FormControl>
            <Box h={5} />
            <FormControl>
                <FormLabel>Receiver Number</FormLabel>
                <Input
                    type="text"
                    style={{
                        backgroundColor: isDark ? "#2d3748" : "#f5f5f5",
                        color: isDark ? "#f5f5f5" : "#2d3748"
                    }}
                    placeholder="628xxxxx"
                    value={data.number}
                    disabled={disabledInput}
                    onChange={(e) => setData({ ...data, number: e.target.value })}
                />
            </FormControl>
            <Box h={5} />
            <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                    minH={250}
                    type="text"
                    disabled={disabledInput}
                    placeholder="Message here..."
                    value={data.message}
                    onChange={(e) => setData({ ...data, message: e.target.value })}
                />
            </FormControl>
            <Box h={5} />
            <FormControl>
                <FormLabel>Image URL (Optional)</FormLabel>
                <Input
                    type="text"
                    style={{
                        backgroundColor: isDark ? "#2d3748" : "#f5f5f5",
                        color: isDark ? "#f5f5f5" : "#2d3748"
                    }}
                    placeholder="https://example.com/image.jpg"
                    value={data.image_url}
                    disabled={disabledInput}
                    onChange={(e) => setData({ ...data, image_url: e.target.value })}
                />
            </FormControl>
            <Box h={5} />
            <ScaleLoader color={'rgba(14, 165, 233, 0.8)'} loading={loading} />

            {!loading && (
                <Button
                    colorScheme='teal'
                    onClick={onSendMessage}
                    disabled={disabledButton}
                >
                    Send
                </Button>
            )}
        </>
    )
};

DashboardSendMessage.getLayout = getLayout;

export default DashboardSendMessage;
