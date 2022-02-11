import { Dashboard } from '@/components/dashboard';
import { useSession, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';

const DashboardLayout = ({ children }) => <Dashboard>{children}</Dashboard>;

export const getLayout = (page) => {
   const [loginSession, loginLoading] = useSession();
   const router = useRouter();

   React.useEffect(() => {
      console.log(loginSession);
      if (!loginLoading && !loginSession?.user) {
         router.push('/')
      }
   }, [loginSession, loginLoading])

   return (
      <DashboardLayout>{page}</DashboardLayout>
   )
};

export default DashboardLayout;
