import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Form from './Form';
import Gmap from './Gmap';
import TripInfo from './TripInfo';
import Header from './Header';
import colors from '../constants/colors';
import { GlobalContext } from '../context/globalContext';


export default function ContentContainer() {

  const {
    isConnected,
    setScrollCoords,
    t,
    showTripInfo,
    scrollViewElement,
  } = useContext(GlobalContext)


  return (
    <ScrollView ref={scrollViewElement}
      onLayout={(event) =>
        setScrollCoords({ x: 0, y: (event.nativeEvent.layout.y + event.nativeEvent.layout.height) })
      } >
      <Header />


      <View style={{ marginHorizontal: 10 }}>
        {!isConnected && (
          <Text style={{ color: colors.primary, padding: 8 }}>
            {t('container:loadMapError')}
          </Text>
        )}

        <View style={{ padding: 8 }}>
          <Form />

          <View
            style={{ flex: 1, flexDirection: 'column' }}>
            <Gmap>
              {showTripInfo && (
                <TripInfo />
              )}
            </Gmap>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
