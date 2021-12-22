import { getLayout } from '@/layouts/dashboard';
import { ScaleLoader } from "react-spinners";
import { Box, Button, useColorModeValue, Input, Select, Textarea, FormControl, FormLabel } from '@chakra-ui/core';
import React from 'react';

const InitialData = {
    session_id: null,
    // number: "6287722171686",
    number: '',
    message: '',
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
            const response = await fetch(`/api/sessions/${data.session_id}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    number: data.number,
                    text: data.message,
                }),
            });
            const json = await response.json();
            setData(InitialData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error.message);
        }

    }

    React.useEffect(() => {
        console.log(data);
    }, [data]);

    const disabledButton = !data.session_id || !data.number || !data.message;

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
                    disabled={loading}
                    onChange={(e) => setData({ ...data, number: e.target.value })}
                />
            </FormControl>
            <Box h={5} />
            <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                    minH={300}
                    type="text"
                    disabled={loading}
                    placeholder="Message here..."
                    value={data.message}
                    onChange={(e) => setData({ ...data, message: e.target.value })}
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
