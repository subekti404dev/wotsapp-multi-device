import { getLayout } from '@/layouts/dashboard';
import Table from '@/components/table';
import { Box, Button } from '@chakra-ui/core';
import QRModal from '@/components/qr-modal';
import { useSessions } from '@/utils/hooks/use-sessions';
import { useModal } from '@/utils/hooks/use-modal';

const DashboardSessions = () => {
    const [{ sessions }, refetchSessions] = useSessions();
    const [modalIsOpen, openModal, closeModal] = useModal()

    const onCloseModal = () => {
        closeModal();
        refetchSessions();
    }

    return (
        <>
            <Button colorScheme='teal' onClick={openModal}>Add New</Button>
            <Box h={5} />
            <Table
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
            <QRModal isOpen={modalIsOpen} onClose={onCloseModal} />
        </>
    )
};

DashboardSessions.getLayout = getLayout;

export default DashboardSessions;
