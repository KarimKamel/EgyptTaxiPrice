import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/globalContext';
import colors from "../constants/colors"
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;



export default function Form() {
  const {
    t,
    i18n,
    setOriginName,
    originName,
    destinationName, setDestinationName,
    setDepartureTime,
    routeNotFoundError,
    originNotEgypt,
    destinationNotEgypt,
    handleSubmit,
    originErrorMessage,
    destinationErrorMessage


  } = useContext(GlobalContext)


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [originIsEmpty, setOriginIsEmpty] = useState(false);
  const [destinationIsEmpty, setdestinationIsEmpty] = useState(false);
  const [departureTimeError, setDepartureTimeError] = useState(false);


  const verifySubmit = () => {
    if (originName.length === 0) {
      setOriginIsEmpty(true);
    }
    if (destinationName.length === 0) {
      setdestinationIsEmpty(true);
    }
    if (destinationName.length > 0 && originName.length > 0) {
      setdestinationIsEmpty(false);
      setOriginIsEmpty(false);
      handleSubmit();
    }
  };

  function getAlignment() {
    return i18n.language === 'ar' && styles.textAlignRight
  };

  function getFlexDirection() {
    return i18n.language === 'ar' && styles.flexDirectionReverse
  };
  // return {textAlign: 'left'};


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const currentDate = new Date();

    if (date >= new Date()) {

      setDepartureTimeError(false);
      setDepartureTime(date);
    } else {

      setDepartureTimeError(true);
    }

    hideDatePicker();
  };
  //add text input validation for length to be >= 10
  return (
    // <View style={{paddingLeft: 20, paddingRight: 20}}>
    <View>

      <Text style={{ fontSize: 18 }}>
        {t('form:subtitle')}
      </Text>

      <Text style={[s.formLabelText, { marginTop: 8 }]}>{t('form:from')}</Text>

      <TextInput
        style={[s.formControl, getAlignment()]}
        id="originInput"
        type="text"
        onChangeText={text => setOriginName(text)}
        // onChangeText={e => handleTextInput(e)}
        className="form-control"
        value={originName}
        placeholder={t('form:origin')}
      />
      {originIsEmpty && (
        <Text style={{ color: colors.errorRed }}>
          {t('form:locationEmpty')}
        </Text>
      )}



      {originErrorMessage && (
        <Text style={{ color: colors.errorRed }}>
          {t('form:searchErrorMessage')}
        </Text>
      )}
      {originNotEgypt && (
        <Text style={{ color: colors.errorRed }}>
          {t('form:locationNotEgypt')}
        </Text>
      )}

      <Text
        style={[s.formLabelText, { marginTop: 8 }]}
        // style={getAlignment()}
        htmlFor="destinationInput">
        {t('form:to')}
      </Text>

      <TextInput
        style={[s.formControl, getAlignment()]}
        id="destinationInput"
        type="text"
        onChangeText={setDestinationName}
        value={destinationName}
        placeholder={t('form:destination')}
      />
      {destinationIsEmpty && (
        <Text style={{ color: colors.errorRed }}>
          {t('form:locationEmpty')}
        </Text>
      )}
      {destinationErrorMessage && (
        <Text style={{ color: colors.errorRed }}>
          {t('form:searchErrorMessage')}
        </Text>
      )}
      {destinationNotEgypt && (
        <Text style={{ color: colors.errorRed }}>
          {t('form:locationNotEgypt')}
        </Text>
      )}

      <Text style={[s.formLabelText, { marginTop: 8 }]}>
        {t('form:departure time')}
      </Text>

      <Text style={[s.textSmall]}>{t('form:asterisk message')}</Text>
      <View
        style={[
          {
            display: 'flex',
            flexDirection: 'row',
            marginTop: 16,
            marginBottom: 16,
          }, getFlexDirection()
        ]}>

        <View style={{ flex: 1 }}>
          <Button
            title={t('form:pickDate')}
            onPress={showDatePicker}
            style={{ flex: 1 }}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={t('form:submit')}
            color={colors.primary}
            onPress={() => verifySubmit()}

            type="submit"></Button>
        </View>

      </View>

      <View style={[s.col4, s.colMd4, { marginLeft: 0, padding: 0 }]}>
        {routeNotFoundError && (
          <Text style={{ color: colors.errorRed }}>{t('form:routeErrorMessage')}</Text>
        )}
        {departureTimeError && (
          <Text style={{ color: colors.errorRed, ...getAlignment() }}>
            {t('form:departureTimeErrorMessage')}
          </Text>
        )}
      </View>
    </View>
    // </View>
  );
}
const styles = StyleSheet.create({

  textAlignRight: {
    textAlign: "right"
  },
  flexDirectionReverse: {
    flexDirection: "row-reverse"
  }
})
