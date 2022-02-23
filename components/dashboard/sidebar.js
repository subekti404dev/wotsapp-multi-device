import {
   Box,
   Flex,
   Text,
   VStack,
   useColorModeValue,
   Image
} from '@chakra-ui/core';
import { NavLink } from './nav-link';
import {
   Home,
   UserGroup,
   Folder,
   Logout,
   Mail,
   Document,
   Webhook,
} from '../icons';
import { useLogin } from '@/utils/hooks/use-login';
import { useRouter } from 'next/router';

const SidebarLink = ({ href, onClick, children, icon, target }) => {
   const Content = () => (
      <Flex align="center">
         <Box as={icon} mr={3} w={6} />
         <Text fontSize="sm" fontWeight="medium">
            {children}
         </Text>
      </Flex>
   )
   if (onClick) {
      return (
         <div style={{ width: '100%', padding: '0.5rem 0.75rem', cursor: 'pointer' }} onClick={onClick}>
            <Content />
         </div>
      )
   }

   return (
      <NavLink href={href} target={target}>
         <Content />
      </NavLink>
   );
}

function PageLinks() {
   const color = useColorModeValue('#4b5563', 'white');
   const [isLoading, { logout }] = useLogin();
   const router = useRouter();

   const menus = [
      {
         id: 1,
         title: 'Dashboard',
         href: '/dashboard',
         icon: Home
      },
      {
         id: 2,
         title: 'Sessions',
         href: '/dashboard/sessions',
         icon: UserGroup
      },
      {
         id: 3,
         title: 'Send Message',
         href: '/dashboard/send-message',
         icon: Mail
      },
      {
         id: 4,
         title: 'Logs',
         href: '/dashboard/logs',
         icon: Folder
      },

      {
         id: 6,
         title: 'API Docs',
         href: '/docs',
         icon: Document,
         target: '_blank'
      },
      {
         id: 7,
         title: 'Logout',
         onClick: () => {
            logout(() => router.push('/'));
         },
         icon: Logout
      }
   ]

   if (process.env.APP_ENABLE_WEBHOOK === 'true') {
      menus.push({
         id: 5,
         title: 'Webhooks',
         href: '/dashboard/webhooks',
         icon: Webhook
      });

      menus = menus.sort((a, b) => a.id - b.id);
   }
   return (
      <VStack w="full" spacing={1}>
         {menus.map((m, i) => (
            <SidebarLink key={i} href={m.href} target={m.target} onClick={m.onClick} style={{ color }} icon={m.icon}>
               {m.title}
            </SidebarLink>
         ))}
      </VStack>
   );
}

function SidebarContainer(props) {
   return (
      <Box
         as="aside"
         position="fixed"
         top={0}
         w={[320, 320, 64]}
         insexX={0}
         h="full"
         {...props}
      />
   );
}

export default function Sidebar(props) {
   const bgColor = useColorModeValue('white', 'gray.800');
   const logo = useColorModeValue('/wa-grey.png', '/wa-white.png');

   return (
      <SidebarContainer bg={bgColor} display={props.display}>
         <VStack>
            <VStack
               as="nav"
               aria-label="Main navigation"
               position="relative"
               h="calc(100vh - 4rem)"
               p={3}
               overflowY="auto"
               {...props}
            >
               <Flex w="full" align="center" h={16} p={3}>
                  <Flex boxSize="full" align="center" px={3}>
                     <Flex boxSize="full" align="center">
                        <Box
                           h={8}
                           w="auto"
                           display={{ base: 'block', lg: 'none' }}
                        >
                           <Image src={logo} w={140} />
                        </Box>
                        <Box
                           h={8}
                           w="auto"
                           display={{ base: 'none', lg: 'block' }}
                        >
                           <Image src={logo} w={140} />
                        </Box>
                     </Flex>
                  </Flex>
               </Flex>
               <PageLinks />
            </VStack>
            <Box style={{ fontStyle: 'italic' }}>
               {'Created by Urip'}
            </Box>
         </VStack>

      </SidebarContainer>
   );
}
