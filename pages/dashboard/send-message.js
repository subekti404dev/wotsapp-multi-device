import { getLayout } from '@/layouts/dashboard';
import { ScaleLoader } from "react-spinners";
import { Box, Button, useColorModeValue, Input, Select, Textarea, FormControl, FormLabel } from '@chakra-ui/core';
import React from 'react';
import { useSessions } from '@/utils/hooks/use-sessions';
import { useMessage } from '@/utils/hooks/use-message';

const InitialData = {
    session_id: null,
    number: '',
    message: '',
    imageUrl: '',
}

const DashboardSendMessage = () => {
    const [data, setData] = React.useState(InitialData);
    const [{ sessions }] = useSessions();
    const [loading, sendMessage] = useMessage();

    React.useEffect(() => {
        if (sessions.length > 0) {
            setData({
                ...data,
                session_id: sessions[0].session_id,
            });
        }
    }, [sessions])

    const isDark = useColorModeValue(false, true);

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
                    value={data.imageUrl}
                    disabled={disabledInput}
                    onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                />
            </FormControl>
            <Box h={5} />
            <ScaleLoader color={'rgba(14, 165, 233, 0.8)'} loading={loading} />
            <Button
                colorScheme='teal'
                onClick={async () => {
                    await sendMessage({
                        sessionId: data.session_id,
                        number: data.number,
                        text: data.message,
                        imageUrl: data?.imageUrl || null,
                    })
                    setData({ ...InitialData, session_id: data.session_id });
                }}
                isLoading={loading}
                disabled={disabledButton || loading}
            >
                {'Send'}
            </Button>
        </>
    )
};

DashboardSendMessage.getLayout = getLayout;

export default DashboardSendMessage;
