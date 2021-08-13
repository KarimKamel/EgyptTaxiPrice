import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import './i18n';
import {NetworkProvider} from 'react-native-offline';

import ContentContainer from './components/ContentContainer';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  const {t, i18n} = useTranslation();
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);
  return (
    <NetworkProvider>
      <ContentContainer t={t} i18n={i18n} />
    </NetworkProvider>
    
      
    
  );
}


