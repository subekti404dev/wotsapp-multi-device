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
  Mail,
} from '../icons';

const SidebarLink = ({ href, children, icon }) => (
  <NavLink href={href}>
    <Flex align="center">
      <Box as={icon} mr={3} w={6} />
      <Text fontSize="sm" fontWeight="medium">
        {children}
      </Text>
    </Flex>
  </NavLink>
);

function PageLinks() {
  const menus = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      title: 'Sessions',
      href: '/dashboard/sessions',
      icon: UserGroup
    },
    {
      title: 'Send Message',
      href: '/dashboard/send-message',
      icon: Mail
    },
    {
      title: 'Logs',
      href: '/dashboard/logs',
      icon: Folder
    }
  ]
  return (
    <VStack w="full" spacing={1}>
      {menus.map((m, i) => (
        <SidebarLink key={i} href={m.href} icon={m.icon}>
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
        <Box>
          {'Created by Urip'}
        </Box>
      </VStack>

    </SidebarContainer>
  );
}
