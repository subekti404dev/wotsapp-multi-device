import { Flex, Heading, Button, Input, FormControl, FormLabel, useColorModeValue } from '@chakra-ui/core';
import { getLayout } from '@/layouts/default';
import { MY_APP } from '@/utils/constants';
import { useRouter } from 'next/router'
import { useLogin } from '@/utils/hooks/use-login';
import { useAuthSession } from '@/utils/hooks/use-auth-session';

const initForm = {
   username: '',
   password: ''
}

const Home = () => {
   const router = useRouter();
   const [form, setForm] = React.useState(initForm);
   const [isLoading, { login }] = useLogin();
   const [loading] = useAuthSession(router, '/dashboard');

   const updateForm = (key, value) => {
      setForm({ ...form, [key]: value });
   }

   const handleLogin = async (username, password) => {
      await login(username, password, () => router.push('/dashboard'))
   }

   const isDark = useColorModeValue(false, true);

   return (
      <Flex direction="column" justify="center" align="center">
         <Heading
            as="h2"
            mb={2}
            size="2xl"
            fontStyle="italic"
            fontWeight="extrabold"
         >
            {MY_APP}
         </Heading>

         <div style={{ maxWidth: 400, minWidth: 350 }}>
            <FormControl marginBottom={5}>
               <FormLabel>Username</FormLabel>
               <Input
                  maxW="400px"
                  style={{
                     backgroundColor: isDark ? "#2d3748" : "#f5f5f5",
                     color: isDark ? "#f5f5f5" : "#2d3748"
                  }}
                  value={form.username}
                  onChange={(e) => updateForm('username', e.target.value)}
                  disabled={isLoading}
               />
            </FormControl>

            <FormControl marginBottom={5}>
               <FormLabel>Password</FormLabel>
               <Input
                  maxW="400px"
                  type="password"
                  style={{
                     backgroundColor: isDark ? "#2d3748" : "#f5f5f5",
                     color: isDark ? "#f5f5f5" : "#2d3748"
                  }}
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  disabled={isLoading}
               />
            </FormControl>

            <Button
               backgroundColor="gray.900"
               color="white"
               fontWeight="medium"
               mt={4}
               width="100%"
               _hover={{ bg: 'gray.700' }}
               _active={{
                  bg: 'gray.800',
                  transform: 'scale(0.95)'
               }}
               onClick={() => handleLogin(form.username, form.password)}
               isLoading={isLoading}
            >
               Login
            </Button>
         </div>

      </Flex>
   );
};

Home.getLayout = getLayout;

export default Home;
