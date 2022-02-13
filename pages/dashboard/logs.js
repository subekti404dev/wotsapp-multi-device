import { getLayout } from '@/layouts/dashboard';
import { timestampToStrDate } from '@/utils/timestamp';
import Table from '@/components/table';
import Pagination from '@/components/pagination';
import { Box, Button, useColorModeValue, Input } from '@chakra-ui/core';
let ReactJson;
import Modal from 'react-modal';

const DashboardLogs = () => {
   const [messages, setMessages] = React.useState([]);
   const [keyword, setKeyword] = React.useState('');
   const [totalPage, setTotalPage] = React.useState(0);
   const [page, setPage] = React.useState(1);
   const [isOpenModal, setIsOpenModal] = React.useState(false);
   const [content, setContent] = React.useState(false);
   const [isLoadingResend, setIsLoadingResend] = React.useState(false);

   React.useEffect(() => {
      fetchData();
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

   React.useEffect(() => {
      fetchData(1);
   }, [keyword])

   const fetchData = async (page = 1) => {
      let url = `/api/messages?page=${page}&q=${keyword}`;
      const res = await fetch(url);
      const messages = await res.json();
      setMessages((messages.data || []).map(m => ({ ...m, jid: m.jid.split("@")[0], timestamp: timestampToStrDate(m.timestamp) })));
      setTotalPage(messages.total % 20 === 0 ? messages.total / 20 : Math.floor(messages.total / 20) + 1);
      setPage(page);
   };

   const onResend = async (payload) => {
      try {
         setIsLoadingResend(true);
         const res = await fetch(`/api/messages/send`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
         });
         await res.json();
         setIsLoadingResend(false);
         setIsOpenModal(false);
         await fetchData(1);
      } catch (error) {
         setIsLoadingResend(false);
      }
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
                           setIsOpenModal(true);
                        }}
                        style={isDarkMode ? { backgroundColor: '#252f3f' } : {}}
                     >
                        {'Show'}
                     </Button>
                  )
               },
            ]}
            rows={messages}
         />
         <Box h={5} />
         <Pagination currentPage={page} totalPage={totalPage} onPageChange={page => fetchData(page)} />
         <Modal
            isOpen={isOpenModal}
            onRequestClose={() => setIsOpenModal(false)}
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
               <Button isLoading={isLoadingResend} onClick={() => onResend(JSON.parse(content))}>Resend</Button>
            </Box>
         </Modal>
      </>
   )
}

DashboardLogs.getLayout = getLayout;

export default DashboardLogs;
