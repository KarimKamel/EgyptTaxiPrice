import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';
import './i18n';
import {NetworkProvider} from 'react-native-offline';

import ContentContainer from './ContentContainer';

export default function App() {
  const {t, i18n} = useTranslation();
  return (
    <NetworkProvider>
      <ContentContainer t={t} i18n={i18n} />
    </NetworkProvider>
  );
  // return ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
