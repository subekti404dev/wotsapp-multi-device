import { getLayout } from '@/layouts/dashboard';
import Modal from 'react-modal';
import Table from '@/components/table';
import { Box, Button, HStack, useColorModeValue, VStack } from '@chakra-ui/core';
import ScaleLoader from "react-spinners/ScaleLoader";
import QRCode from "react-qr-code";
import QRModal from '@/components/qr-modal';

const DashboardSessions = () => {
    const [sessions, setSessions] = React.useState([]);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await fetch(`/api/sessions`);
        const sessions = await res.json();
        setSessions(sessions);
    };

    const onCloseModal = () => {
        setIsOpen(false);
        fetchData();
    }

    return (
        <>
            <Button colorScheme='teal' onClick={() => setIsOpen(true)}>Add New</Button>
            <Box h={5}/>
            <Table
                // title={"Sessions"}
                headers={[{
                    label: "Session ID",
                    value: "session_id"
                },
                {
                    label: 'WA ID',
                    value: 'wa_id'
                },
                {
                    label: 'NAME',
                    value: 'wa_name'
                }]}
                rows={sessions}
            />
            <QRModal isOpen={modalIsOpen} onClose={onCloseModal}/>
        </>
    )
};

DashboardSessions.getLayout = getLayout;

export default DashboardSessions;
