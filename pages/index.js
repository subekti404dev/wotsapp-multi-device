import { Flex, Heading, Button, Input, FormControl, FormLabel } from '@chakra-ui/core';
import { getLayout } from '@/layouts/default';
import { MY_APP } from '@/utils/constants';
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client';
import { toast } from 'react-toastify';

const initForm = {
   username: '',
   password: ''
}

const Home = () => {
   const [form, setForm] = React.useState(initForm);
   const [isLoading, setIsLoading] = React.useState(false);

   const updateForm = (key, value) => {
      setForm({ ...form, [key]: value });
   }

   const router = useRouter();
   const [loginSession, loginLoading] = useSession();

   React.useEffect(() => {
      if (!loginLoading && loginSession?.user) {
         router.push('/dashboard')
      }
   }, [loginSession, loginLoading]);

   React.useEffect(() => {
      if (router.query.error) {
         toast.error(router.query.error, {autoClose: 5000});
      }
   }, [router]);

   const handleLogin = async (username, password) => {
      try {
         setIsLoading(true);
         const res = await signIn('credentials', {
            username, password,
            callbackUrl: `${window.location.origin}/dashboard`,
         });
         setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
      }
   }

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
