import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './utils/i18n';
import { NetworkProvider } from 'react-native-offline';

import ContentContainer from './components/ContentContainer';



export default function App() {
  const { t, i18n } = useTranslation();


  return (
    <NetworkProvider>
      {console.log("rendering")}
      <ContentContainer t={t} i18n={i18n} />
    </NetworkProvider>



  );
}


