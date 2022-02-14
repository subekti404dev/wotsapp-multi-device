import { Dashboard } from '@/components/dashboard';
import { useAuthSession } from '@/utils/hooks/use-auth-session';
import { useRouter } from 'next/router';

const DashboardLayout = ({ children }) => <Dashboard>{children}</Dashboard>;

export const getLayout = (page) => {
   const router = useRouter();
   const [loading] = useAuthSession(router, '/dashboard');

   return (
      <DashboardLayout>{page}</DashboardLayout>
   )
};

export default DashboardLayout;
