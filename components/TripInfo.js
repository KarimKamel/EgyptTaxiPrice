import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import colors from "../constants/colors"
import { GlobalContext } from '../context/globalContext';

const TripInfo = (props) => {

  const {

    t,

  } = useContext(GlobalContext)
  const { tripDuration, tripDistance, tripPrice } = props;
  return (
    <View
      style={{ paddingTop: 10 }} >
      {tripDistance !== 0 && (
        <View style={{ padding: 5, backgroundColor: colors.lightBackground }}>
          <Text style={{ color: colors.primary }}>

            {t('tripinfo:duration')}
            <Text>
              {`${tripDuration.hours}`} {t('tripinfo:hours')}{' '}
              {`${tripDuration.minutes}`}
              {t('tripinfo:minutes')}
            </Text>
            {"\n"}

            {t('tripinfo:distance')}{' '}
            <Text>
              {`${tripDistance}`} {t('tripinfo:kilometer')}
            </Text>
            {"\n"}

            {t('tripinfo:price')} <Text>{`${tripPrice}`}</Text>{' '}
            {t('tripinfo:money')}
          </Text>

        </View>
      )}
    </View>)
}




export default TripInfo

