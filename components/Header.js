import React, { useState } from "react";
import { View, Text, Switch, StatusBar,StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import {BungeeInline_400Regular,BungeeShade_400Regular,useFonts} from "../constants/fonts"
import colors from "../constants/colors"


export default function Header(props) {
  let [fontsLoaded] = useFonts({
    BungeeShade_400Regular,
    BungeeInline_400Regular,
  });
  

  const { i18n } = useTranslation();
  const [languageSwitch, setLanguageSwitch] = useState(true);

  const onLanguageChange = event => {
    //event is equal to true for english and false for arabic
    if(event){
      i18n.changeLanguage("en");
      setLanguageSwitch(event);
    } else {
      i18n.changeLanguage("ar");
      setLanguageSwitch(event);
    }
  };
  return (
    <View>
      <StatusBar
        translucent={false}
        animated={true}
        backgroundColor={colors.primary}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          backgroundColor:colors.primary
        }}>
        <Text
          style={[{
            padding: 10,
            fontSize: 20,
            //fix font
            
            color: colors.lightText,
          },fontsLoaded&&styles.customFont]}>
          Egypt Taxi Prices
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>ar</Text>
          <Switch
            trackColor={{ false: colors.lightText, true:colors.lightText }}
            onValueChange={onLanguageChange}
            value={languageSwitch}
          />
          <Text>en</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  customFont:{
    fontFamily:"BungeeInline_400Regular",
  }})