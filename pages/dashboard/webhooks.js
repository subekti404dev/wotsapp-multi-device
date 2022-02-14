import { getLayout } from '@/layouts/dashboard';
import Table from '@/components/table';
import { Box, Button, useColorModeValue } from '@chakra-ui/core';
import WebhookModal from '@/components/webhook-modal';
import { useWebhooks } from '@/utils/hooks/use-webhooks';
import { useModal } from '@/utils/hooks/use-modal';

const DashboardWebhooks = () => {
   const [modalIsOpen, openModal, closeModal] = useModal(false);
   const [mode, setMode] = React.useState('create');
   const [oldData, setOldData] = React.useState(null);
   const isDarkMode = useColorModeValue(false, true);
   const [
      { webhooks, loading },
      { fetchWebhooks, createWebhook, updateWebhook, deleteWebhook }
   ] = useWebhooks();

   const onCloseModal = () => {
      closeModal();
      setOldData(null);
      fetchWebhooks();
   }


   return (
      <>
         <Button
            colorScheme='teal'
            onClick={() => {
               setMode('create');
               openModal();
            }}
         >
            {'Add New'}
         </Button>
         <Box h={5} />
         <div style={{ color: 'grey', fontSize: 13, fontStyle: 'italic' }} >
            {'Note: For now only text messages will trigger the webhook'}
         </div>
         <Box h={5} />
         <Table
            headers={[
               {
                  label: "Name",
                  value: "name"
               },
               {
                  label: "Session ID",
                  value: "session_id"
               },
               {
                  label: 'URL',
                  value: 'url'
               },
               {
                  label: 'Active',
                  value: 'is_active_string'
               },
               {
                  label: 'Edit',
                  value: 'id',
                  contentWrapper: ({ data }) => (
                     <Button
                        onClick={() => {
                           const id = data;
                           setOldData(webhooks.find(webhook => webhook.id === id));
                           setMode('edit');
                           openModal();
                        }}
                        style={isDarkMode ? { backgroundColor: '#252f3f' } : {}}
                     >
                        {'Edit'}
                     </Button>
                  )
               },
            ]}
            rows={webhooks}
         />
         <WebhookModal
            isOpen={modalIsOpen}
            onClose={onCloseModal}
            onAfterSave={fetchWebhooks}
            mode={mode}
            oldData={oldData}
            onCreate={createWebhook}
            onUpdate={updateWebhook}
            onDelete={deleteWebhook}
            cudLoading={loading}
         />
      </>
   )
};

DashboardWebhooks.getLayout = getLayout;

export default DashboardWebhooks;
