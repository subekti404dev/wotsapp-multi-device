import { getLayout } from '@/layouts/dashboard';
import { Box, HStack, useColorModeValue } from '@chakra-ui/core';
import { useEffect } from 'react';

const Card = ({ label, value }) => {
    const isDark = useColorModeValue(false, true);
    return (
        <Box flex={1} bgColor={isDark ? '#171923' : '#E2E8F0'} p={5} borderRadius={6}>
            <Box fontSize={15} color={'grey'}>{label}</Box>
            <Box fontSize={25}>{value}</Box>
        </Box>
    )

}


const DashboardIndex = () => {
    const [data, setData] = React.useState({});

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const res = await fetch('/api/dashboard');
        const { uptime, totalMessage, activeSessions } = await res.json();
        let totalSeconds = uptime;
        let days = Math.floor(totalSeconds / (3600 * 24));
        totalSeconds %= 3600 * 24;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = (totalSeconds % 60).toFixed(0);
        let strUptime = ``;
        if (days > 0) strUptime += `${days}d `;
        if (hours > 0) strUptime += `${hours}h `;
        if (minutes > 0) strUptime += `${minutes}m `;
        if (seconds > 0 && days === 0) strUptime += `${seconds}s`;
        setData({ ...data, uptime: strUptime, totalMessage, activeSessions });
    }

    return (
        <div>
            <HStack>
                <Card label="Uptime Service" value={(data?.uptime || '-')} />
                <Card label="Active Sessions" value={(data?.activeSessions || 0)} />
            </HStack>
            <Box h={2}/>
            <HStack>
                <Card label="Total Messages" value={(data?.totalMessage || 0)} />
            </HStack>
        </div>
    )
};

DashboardIndex.getLayout = getLayout;

export default DashboardIndex;
