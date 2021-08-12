import React from 'react';
import {View, Text, Switch} from 'react-native';

export default function TripInfo(props) {
  const {tripDuration, tripDistance, tripPrice, id, t} = props;
  return (
    <View>
      {tripDistance !== 0 && (
        <View>
          <Text className="mt-3 ">
            {t('tripinfo:duration')}
            <Text>
              {`${tripDuration.hours}`} {t('tripinfo:hours')}{' '}
              {`${tripDuration.minutes}`}
              {t('tripinfo:minutes')}
            </Text>
          </Text>
          <Text>
            {t('tripinfo:distance')}{' '}
            <Text>
              {`${tripDistance}`} {t('tripinfo:kilometer')}
            </Text>
          </Text>
          <Text>
            {t('tripinfo:price')} <Text>{`${tripPrice}`}</Text>{' '}
            {t('tripinfo:money')}
          </Text>
        </View>
      )}
    </View>
  );
}
