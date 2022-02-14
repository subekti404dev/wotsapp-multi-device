import Modal from 'react-modal';
import {
   Box, Switch, Button,
   useColorModeValue, FormControl,
   FormLabel, Input, Select,
} from '@chakra-ui/core';
import { toast } from 'react-toastify';
import { useSessions } from '@/utils/hooks/use-sessions';
import React from 'react';

const InitialData = {
   session_id: null,
   url: null,
   is_active: false,
}

export default function WebhookModal({
   oldData, isOpen, onClose, mode, onAfterSave,
   onCreate, onUpdate, onDelete, cudLoading
}) {

   const [data, setData] = React.useState(InitialData);
   const [{ sessions, loading: sesLoading }, fetchSessions] = useSessions()
   const isCreate = mode === 'create';
   const loading = cudLoading || sesLoading;

   React.useEffect(() => {
      if (sessions.length > 0 && isCreate) {
         setData({
            ...data,
            session_id: sessions[0].session_id,
         });
      }
   }, [sessions])

   React.useEffect(() => {
      isOpen && fetchSessions();
   }, [isOpen]);

   React.useEffect(() => {
      if (oldData) {
         const newData = { ...oldData, is_active: oldData.is_active ? true : false };
         setData(newData);
      }
   }, [oldData]);

   const onCloseModal = () => {
      if (!loading) {
         setData(InitialData);
         onClose();
      }
   }

   const onSubmit = async () => {
      const urlExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      var regex = new RegExp(urlExp);
      if (!(data?.url || '').match(regex)) {
         toast.error("Invalid url", { autoClose: 5000 });
         return;
      }
      if (isCreate) {
         await onCreate(data);
      } else {
         await onUpdate(oldData.id, data);
      }
      onAfterSave();
      onCloseModal();
      toast.success("Webhook saved", { autoClose: 5000 });
   }

   const bgColor = useColorModeValue('white', '#171923');
   const isDarkMode = useColorModeValue(false, true);

   const disableButton = !data || !data.name || !data.url || !data.session_id || loading;

   return (
      <Modal
         isOpen={isOpen}
         onRequestClose={onCloseModal}
         style={{
            content: {
               top: '50%',
               left: '50%',
               // marginRight: '-50%',
               transform: 'translate(-50%, -50%)',
               zIndex: 1400,
               width: 500,
               height: 500,
               backgroundColor: bgColor,
            },
            overlay: {
               backgroundColor: "rgba(0, 0, 0, 0.5)",
               zIndex: 10,
            }
         }}
         contentLabel="Webhook Modal"
      >
         <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>Add New Webhook</div>
         </div>

         <FormControl>
            <FormLabel>Session</FormLabel>
            {sessions.length > 0 && (
               <Select
                  onChange={(e) => setData({ ...data, session_id: e.target.value })}
                  disabled={loading}
                  style={{ backgroundColor: isDarkMode ? "#2d3748" : "#f5f5f5" }}
               >
                  {sessions.map((session) => (
                     <option
                        style={{ backgroundColor: isDarkMode ? "#2d3748" : "#f5f5f5" }}
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
                     backgroundColor: isDarkMode ? "#2d3748" : "#f5f5f5",
                     color: isDarkMode ? "#f5f5f5" : "#2d3748"
                  }}
                  disabled
                  placeholder="No Session Available"
               />
            )}
         </FormControl>
         <Box h={5} />
         <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
               type="text"
               style={{
                  backgroundColor: isDarkMode ? "#2d3748" : "#f5f5f5",
                  color: isDarkMode ? "#f5f5f5" : "#2d3748"
               }}
               placeholder=""
               value={data.name}
               onChange={(e) => {
                  const name = e.target.value;
                  setData({ ...data, name });
               }}
            />
         </FormControl>
         <Box h={5} />
         <FormControl>
            <FormLabel>URL</FormLabel>
            <Input
               type="text"
               style={{
                  backgroundColor: isDarkMode ? "#2d3748" : "#f5f5f5",
                  color: isDarkMode ? "#f5f5f5" : "#2d3748"
               }}
               placeholder="http://example.com/webhook"
               value={data.url}
               onChange={(e) => {
                  const url = e.target.value;
                  setData({ ...data, url });
               }}
            />
         </FormControl>
         <Box h={5} />
         <FormControl>
            <FormLabel htmlFor={"is-active"} mb='0'>
               Active
            </FormLabel>
            <Switch
               id={"is-active"}
               colorScheme={"teal"}
               size={"lg"}
               isChecked={data.is_active}
               onChange={(e) => {
                  setData({ ...data, is_active: e.target.checked })
               }}
            />
         </FormControl>
         <Box mt={5} style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <Button
               colorScheme='teal'
               disabled={disableButton}
               isLoading={loading}
               style={{ marginRight: 5 }}
               onClick={onSubmit}>
               {isCreate ? 'Create' : 'Update'}
            </Button>

            <Button
               onClick={onCloseModal}
               style={isDarkMode ? { backgroundColor: '#252f3f' } : {}}
            >
               Close
            </Button>
         </Box>
         {!isCreate && (
            <Box mt={5} style={{ position: 'absolute', bottom: 10, left: 10 }}>
               <Button
                  colorScheme='red'
                  isLoading={loading}
                  disabled={loading}
                  onClick={async () => {
                     await onDelete(oldData.id);
                     await onAfterSave();
                     onCloseModal();
                  }}>
                  {'Delete'}
               </Button>
            </Box>
         )}
      </Modal>
   )
}