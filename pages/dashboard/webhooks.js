import { getLayout } from '@/layouts/dashboard';
import Table from '@/components/table';
import { Box, Button, useColorModeValue } from '@chakra-ui/core';
import WebhookModal from '@/components/webhook-modal';

const DashboardWebhooks = () => {
   const [webhooks, setWebhooks] = React.useState([]);
   const [modalIsOpen, setIsOpen] = React.useState(false);
   const [mode, setMode] = React.useState('create');
   const [oldData, setOldData] = React.useState(null);
   const isDarkMode = useColorModeValue(false, true);

   React.useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      const res = await fetch(`/api/webhooks`);
      const webhooks = await res.json();
      setWebhooks(webhooks);
   };

   const onCloseModal = () => {
      setIsOpen(false);
      setOldData(null);
      fetchData();
   }


   return (
      <>
         <Button
            colorScheme='teal'
            onClick={() => {
               setMode('create');
               setIsOpen(true)
            }}
         >
            {'Add New'}
         </Button>
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
                           setIsOpen(true);
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
            onAfterSave={fetchData}
            mode={mode}
            oldData={oldData}
         />
      </>
   )
};

DashboardWebhooks.getLayout = getLayout;

export default DashboardWebhooks;
