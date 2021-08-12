import React from 'react';
import {View, Text, Switch} from 'react-native';

export default function TripInfo(props) {
  const {tripDuration, tripDistance, tripPrice, id, t} = props;
  return (
    <View style = {{paddingTop:10}} >
      {tripDistance !== 0 && (
        <View style={{ padding:5,backgroundColor:"white"}}>
         <Text style={{color:"#8b1414"}}> 
        
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
    </View>
  );
}
