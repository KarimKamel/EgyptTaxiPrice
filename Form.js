import React, {useState} from 'react';

import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import {View, Text, TextInput, Button} from 'react-native';
// import {View, Text, Button} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import TextInput from 'react-native-input-validator';

const bootstrapStyleSheet = new BootstrapStyleSheet();
const {s, c} = bootstrapStyleSheet;

const submitButtonStyle = {backgroundColor: 'rgb(160 16 16)'};

export default function Form(props) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [originIsEmpty, setOriginIsEmpty] = useState(false);
  const [destinationIsEmpty, setdestinationIsEmpty] = useState(false);
  const [departureTimeError, , setDepartureTimeError] = useState(false);
  const {
    setDestinationName,
    setDepartureTime,
    setOriginName,
    handleSubmit,
    originValue,
    destinationValue,
    destinationError,
    originError,
    routeNotFoundError,

    departureTime,
    i18n,
    t,
    originNotEgypt,
    destinationNotEgypt,
  } = props;

  const verifySubmit = () => {
    if (originValue.length === 0) {
      setOriginIsEmpty(true);
    }
    if (destinationValue.length === 0) {
      setdestinationIsEmpty(true);
    }
    if (destinationValue.length > 0 && originValue.length > 0) {
      setdestinationIsEmpty(false);
      setOriginIsEmpty(false);
      handleSubmit();
    }
  };

  function getAlignment() {
    return {textAlign: i18n.language === 'en' ? 'left' : 'right'};
    // return {textAlign: 'left'};
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const currentDate = new Date();
    console.log('currentDate:', currentDate);
    console.log('input date', date);
    if (date >= new Date()) {
      console.log('selected is not in the past');
      setDepartureTimeError(false);
    } else {
      console.log('date is in the past');
      setDepartureTimeError(true);
    }

    hideDatePicker();
  };
  //add text input validation for length to be >= 10
  return (
    // <View style={{paddingLeft: 20, paddingRight: 20}}>
    <View>
      <Text style={[s.lead, {fontSize: 18, ...getAlignment()}]}>
        {t('form:subtitle')}
      </Text>

      <Text style={[s.formLabelText, {marginTop: 8}]}>{t('form:from')}</Text>

      <TextInput
        style={[s.formControl, getAlignment()]}
        id="originInput"
        type="text"
        onChangeText={text => setOriginName(text)}
        // onChangeText={e => handleTextInput(e)}
        className="form-control"
        value={originValue}
        placeholder={t('form:origin')}
      />
      {originIsEmpty && (
        <Text style={{color: 'red', ...getAlignment()}}>
          {t('form:searchErrorMessage')}
        </Text>
      )}

      {originError && (
        <Text style={{color: 'red', ...getAlignment()}}>
          {t('form:searchErrorMessage')}
        </Text>
      )}
      {originNotEgypt && (
        <Text style={{color: 'red', ...getAlignment()}}>
          {t('form:locationNotEgypt')}
        </Text>
      )}

      <Text
        style={[s.formLabelText, {marginTop: 8}]}
        // style={getAlignment()}
        htmlFor="destinationInput">
        {t('form:to')}
      </Text>

      <TextInput
        style={[s.formControl, getAlignment()]}
        id="destinationInput"
        type="text"
        onChangeText={setDestinationName}
        className="form-control"
        value={destinationValue}
        placeholder={t('form:destination')}
      />
      {destinationIsEmpty && (
        <Text style={{color: 'red', ...getAlignment()}}>
          {t('form:searchErrorMessage')}
        </Text>
      )}
      {destinationError && (
        <Text style={{color: 'red', ...getAlignment()}}>
          {t('form:searchErrorMessage')}
        </Text>
      )}
      {destinationNotEgypt && (
        <Text style={{color: 'red', ...getAlignment()}}>
          {t('form:locationNotEgypt')}
        </Text>
      )}

      <Text style={[s.formLabelText, {marginTop: 8}]}>
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
          },
        ]}>
        {/* <View style={{ marginTop: 8, marginLeft: 0 }}> */}
        {/* <View style={[{marginLeft: 0, marginRight: 8, padding: 0}]}> */}
        <View style={{flex: 1}}>
          <Button
            title="Show Date Picker"
            onPress={showDatePicker}
            style={{flex: 1}}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={{flex: 1}}>
          <Button
            title={t('form:submit')}
            color="#8b1414"
            onPress={() => verifySubmit()}
            // style={{ backgroundColor: "rgb(160 16 16)" }}
            type="submit"></Button>
        </View>

        {departureTimeError && (
          <Text style={{color: 'red', ...getAlignment()}}>
            {t('form:departureTimeErrorMessage')}
          </Text>
        )}
        {/* <View
            style={[s.row, {marginLeft: 0, padding: 0, flexGrow: 1}]}></View> */}
      </View>

      <View style={[s.col4, s.colMd4, {marginLeft: 0, padding: 0}]}></View>

      {routeNotFoundError && (
        <Text style={{color: 'red'}}>{t('form:routeErrorMessage')}</Text>
      )}
    </View>
    // </View>
  );
}
