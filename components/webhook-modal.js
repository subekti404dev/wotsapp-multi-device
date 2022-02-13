import Modal from 'react-modal';
import {
   Box, Switch, Button,
   useColorModeValue, FormControl,
   FormLabel, Input, Select,
} from '@chakra-ui/core';
import { toast } from 'react-toastify';

const InitialData = {
   session_id: null,
   url: null,
   is_active: false,
}

export default function WebhookModal({ oldData, isOpen, onClose, mode, onAfterSave }) {

   const [data, setData] = React.useState(InitialData);
   const [loading, setLoading] = React.useState(false);
   const [sessions, setSessions] = React.useState([]);
   const isCreate = mode === 'create';

   const fetchData = async () => {
      try {
         setLoading(true);
         const res = await fetch(`/api/sessions`);
         const sessions = await res.json();
         setSessions(sessions);
         if (sessions.length > 0 && isCreate) {
            setData({
               ...data,
               session_id: sessions[0].session_id,
            });
         }
         setLoading(false);
      } catch (error) {
         toast.error(error.message, { autoClose: 5000 });
         setLoading(false);
      }
   };

   React.useEffect(() => {
      isOpen && fetchData();
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

   const onCreate = async () => {
      const response = await fetch(`/api/webhooks/create`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });
      if (response.status !== 200) {
         const data = await response.json();
         throw new Error(data?.message || "Something went wrong");
      }
   }

   const onUpdate = async () => {
      const response = await fetch(`/api/webhooks/${oldData.id}/update`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });
      if (response.status !== 200) {
         const data = await response.json();
         throw new Error(data?.message || "Something went wrong");
      }
   }

   const onSubmit = async () => {
      try {
         setLoading(true);
         if (isCreate) {
            await onCreate();
         } else {
            await onUpdate();
         }
         setLoading(false);
         onAfterSave();
         onCloseModal();
         toast.success("Webhook saved", { autoClose: 5000 });
      } catch (e) {
         toast.error(error.message, { autoClose: 5000 });
         setLoading(false);
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true);
         const response = await fetch(`/api/webhooks/${oldData.id}/delete`, {
            method: "DELETE",
         });
         if (response.status !== 200) {
            const data = await response.json();
            throw new Error(data?.message || "Something went wrong");
         }
         setLoading(false);
         onAfterSave();
         onCloseModal();
         toast.success("Webhook deleted", { autoClose: 5000 });
      } catch (error) {
         toast.error(error.message, { autoClose: 5000 });
         setLoading(false);
      }
   }

   const bgColor = useColorModeValue('white', '#171923');
   const inputBgColor = useColorModeValue('white', 'grey');
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
                  disabled={disableButton}
                  onClick={onDelete}>
                  {'Delete'}
               </Button>
            </Box>
         )}
      </Modal>
   )
}