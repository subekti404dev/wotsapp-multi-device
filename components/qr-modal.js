import Modal from 'react-modal';
import { Box, Button, HStack, useColorModeValue, VStack, Input, Image } from '@chakra-ui/core';
import ScaleLoader from "react-spinners/ScaleLoader";
import QRCode from "react-qr-code";


export default function QRModal({ isOpen, onClose }) {
   const [sessionId, setSessionId] = React.useState();
   const [QR, setQR] = React.useState();
   const [loadingAN, setLoadingAN] = React.useState(false);

   const onRequestQR = async () => {
      try {
         setLoadingAN(true);
         const res = await fetch(`/api/sessions/${sessionId}/qr`);
         const { qr } = await res.json();
         setQR(qr);
         setTimeout(onCloseModal, 1000 * 10);
         setLoadingAN(false);
      } catch (error) {
         alert(error.message);
         setLoadingAN(false);
      }
   }

   const onCloseModal = () => {
      setQR();
      setSessionId();
      onClose();
   }
   const bgColor = useColorModeValue('white', '#171923');
   const inputBgColor = useColorModeValue('white', 'grey');
   const isDarkMode = useColorModeValue(false, true);

   return (
      <Modal
         isOpen={isOpen}
         onRequestClose={onCloseModal}
         style={{
            content: {
               top: '50%',
               left: '50%',
               marginRight: '-50%',
               transform: 'translate(-50%, -50%)',
               zIndex: 1400,
               width: 500,
               height: QR ? 500 : 520,
               backgroundColor: bgColor,
            },
            overlay: {
               backgroundColor: "rgba(0, 0, 0, 0.5)",
               zIndex: 10,
            }
         }}
         contentLabel="Example Modal"
      >
         <VStack>
            <HStack>
               <div style={{ fontSize: 20, fontWeight: 'bold' }}>Add New Session</div>
            </HStack>
            <HStack>
               <Input
                  type="text"
                  id="session-id"
                  variant="filled"
                  placeholder={'Session ID'}
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  disabled={loadingAN}
                  style={{ color: '#000', backgroundColor: inputBgColor, borderColor: '#dedede' }}
               />
               <Button
                  colorScheme="teal"
                  onClick={onRequestQR}
                  disabled={!sessionId || loadingAN}
               >
                  Get QR
               </Button>
            </HStack>
            <ScaleLoader color={'rgba(14, 165, 233, 0.8)'} loading={loadingAN} />
            <Box>
               {QR && <div style={{ backgroundColor: "white", padding: 2, marginTop: 20 }}>
                  <QRCode value={QR} />
               </div>}
               {!QR && <div>
                  <div style={{ color: "grey", display: "flex", justifyContent: "center", alignItems: "center" }}>
                     {'Please Join WA Multi Device First'}
                  </div>
                  {!loadingAN && <Image src={'/multi-device.jpeg'} style={{ width: 400, marginTop: 10 }} />}
               </div>}
            </Box>
         </VStack>

      </Modal>
   )
}