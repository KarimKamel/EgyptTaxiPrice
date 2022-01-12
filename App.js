import React from 'react';

import { NetworkProvider } from 'react-native-offline';

import ContentContainer from './components/ContentContainer';
import { GlobalContextProvider } from './context/globalContext';



export default function App() {



  return (
    <NetworkProvider>
      <GlobalContextProvider>
        <ContentContainer />
      </GlobalContextProvider>
    </NetworkProvider>



  );
}


