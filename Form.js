import React, { useState } from "react";

import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { View, Text, TextInput, Button } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;

const submitButtonStyle = { backgroundColor: "rgb(160 16 16)" };

export default function Form(props) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
    departureTimeError,
    departureTime,
    i18n,
    t,
  } = props;

  function getAlignment() {
    return { textAlign: i18n.language === "en" ? "left" : "right" };
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <View>
      <Text style={[s.lead, { fontSize: 18, ...getAlignment() }]}>
        {t("form:subtitle")}
      </Text>

      <Text style={[s.formLabelText, { marginTop: 8 }]}>{t("form:from")}</Text>
      <TextInput
        style={[s.formControl, getAlignment()]}
        id="originInput"
        type="text"
        onChangeText={setOriginName}
        // onChangeText={e => handleTextInput(e)}
        className="form-control"
        value={originValue}
        placeholder={t("form:origin")}
      />

      {originError && (
        <Text style={{ color: "red", ...getAlignment() }}>
          {t("form:searchErrorMessage")}
        </Text>
      )}

      <Text
        style={[s.formLabelText, { marginTop: 8 }]}
        // style={getAlignment()}
        htmlFor="destinationInput">
        {t("form:to")}
      </Text>

      <TextInput
        style={[s.formControl, getAlignment()]}
        id="destinationInput"
        type="text"
        onChangeText={setDestinationName}
        className="form-control"
        value={destinationValue}
        placeholder={t("form:destination")}
      />
      {destinationError && (
        <Text style={{ color: "red", ...getAlignment() }}>
          {t("form:searchErrorMessage")}
        </Text>
      )}

      <Text style={[s.formLabelText, { marginTop: 8 }]}>
        {t("form:departure time")}
      </Text>

      <Text style={[s.textSmall]}>{t("form:asterisk message")}</Text>
      <View style={[s.row, { margin: 0, marginTop: 8 }]}>
        {/* <View style={{ marginTop: 8, marginLeft: 0 }}> */}
        <View
          style={[
            s.col4,
            s.colMd8,
            { marginLeft: 0, marginRight: 8, padding: 0 },
          ]}>
          <Button title="Show Date Picker" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          {departureTimeError && (
            <Text style={{ color: "red", ...getAlignment() }}>
              {t("form:departureTimeErrorMessage")}
            </Text>
          )}
          <View
            style={[s.row, { marginLeft: 0, padding: 0, flexGrow: 1 }]}></View>
        </View>

        <View style={[s.col4, s.colMd4, { marginLeft: 0, padding: 0 }]}>
          <Button
            title={t("form:submit")}
            color="#8b1414"
            onPress={handleSubmit}
            // style={{ backgroundColor: "rgb(160 16 16)" }}
            type="submit"></Button>
        </View>

        {routeNotFoundError && (
          <Text style={{ color: "red" }}>{t("form:routeErrorMessage")}</Text>
        )}
      </View>
    </View>
  );
}
