import { getLayout } from '@/layouts/dashboard';
import Table from '@/components/table';
import Pagination from '@/components/pagination';
import { Box, Button, useColorModeValue, Input } from '@chakra-ui/core';
import Modal from 'react-modal';
import { useLogs } from '@/utils/hooks/use-logs';
import { useModal } from '@/utils/hooks/use-modal';
import { useResendMessage } from '@/utils/hooks/use-resend-message';
let ReactJson;

const DashboardLogs = () => {
   const [content, setContent] = React.useState(false);
   const [data, action] = useLogs();
   const [isOpenModal, openModal, closeModal] = useModal();
   const [isLoadingResend, resendMessage] = useResendMessage();

   React.useEffect(() => {
      action.setKeyword('');
      require.ensure(
         ['react-json-view'],
         function () {
            try {
               ReactJson = require('react-json-view').default;
            } catch (err) {
               console.log('react-json-view:', err);
            }
         })
   }, []);

   const onResend = async (payload) => {
      await resendMessage(payload)
      closeModal();
      await action.setPage(1);
   }

   const isDarkMode = useColorModeValue(false, true);

   return (
      <>
         <Input
            type="text"
            style={{
               backgroundColor: isDarkMode ? "#2d3748" : "#f5f5f5",
               color: isDarkMode ? "#f5f5f5" : "#2d3748"
            }}
            placeholder="Search"
            value={data.keyword}
            onChange={(e) => action.setKeyword(e.target.value)}
         />
         <Box h={3} />
         <Table
            headers={[
               {
                  label: 'Timestamp',
                  value: 'timestamp'
               },
               {
                  label: "Session ID",
                  value: "session_id"
               },
               {
                  label: 'Receiver',
                  value: 'jid'
               },
               {
                  label: 'Message ID',
                  value: 'wa_id'
               },

               {
                  label: 'Status',
                  value: 'status_message'
               },
               {
                  label: 'Payload',
                  value: 'payload',
                  contentWrapper: ({ data }) => (
                     <Button
                        onClick={() => {
                           setContent(data);
                           openModal();
                        }}
                        style={isDarkMode ? { backgroundColor: '#252f3f' } : {}}
                     >
                        {'Show'}
                     </Button>
                  )
               },
            ]}
            rows={data.messages}
         />
         <Box h={5} />
         <Pagination currentPage={data.page} totalPage={data.totalPage} onPageChange={page => action.setPage(page)} />
         <Modal
            isOpen={isOpenModal}
            onRequestClose={closeModal}
            style={{
               content: {
                  top: '50%',
                  left: '50%',
                  marginRight: '-50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1400,
                  width: 500,
                  height: 500,
                  backgroundColor: "white",
                  color: "black",
               },
               overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 10,
               }
            }}
            contentLabel="Example Modal"
         >

            <Box alignItems={'center'} justifyContent={'center'}>
               <div style={{ fontSize: 20, fontWeight: 'bold' }}>Content</div>

            </Box>
            <Box mt={5} >
               {ReactJson && content && <ReactJson src={JSON.parse(content)} name={false} />}
            </Box>
            <Box mt={5} style={{ position: 'absolute', bottom: 10, right: 10 }}>
               <Button
                  colorScheme='teal'
                  isLoading={isLoadingResend}
                  style={{ marginRight: 5 }}
                  onClick={() => onResend(JSON.parse(content))}>
                  Resend
               </Button>

               <Button
                  onClick={closeModal}
               >
                  Close
               </Button>
            </Box>
         </Modal>
      </>
   )
}

DashboardLogs.getLayout = getLayout;

export default DashboardLogs;
