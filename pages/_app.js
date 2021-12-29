import '../styles.css'
import React from 'react';
import Head from 'next/head'
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Nprogress from '@/components/nprogress';
import theme from '@/components/design-system';
import DefaultLayout from '@/layouts/default';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'swagger-ui-react/swagger-ui.css';

const App = ({ Component, pageProps }) => {
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout children={page} />);

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>WotsApp</title>
      </Head>
      <CSSReset />
      <Nprogress />
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer />
    </ChakraProvider>
  );
};

export default App;
