import React, { useState } from "react";
import { View, Text, Switch, StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { BungeeInline_400Regular } from "@expo-google-fonts/bungee-inline";
import {
  BungeeShade_400Regular,
  useFonts,
} from "@expo-google-fonts/bungee-shade";

export default function Header() {
  let [fontsLoaded] = useFonts({
    BungeeShade_400Regular,
    BungeeInline_400Regular,
  });
  const { t, i18n } = useTranslation();
  const [inputSwitch, setInputSwitch] = useState(true);

  const onLanguageChange = event => {
    
    if(event){
      i18n.changeLanguage("en");
      setInputSwitch(event);
    } else {
      i18n.changeLanguage("ar");
      setInputSwitch(event);
    }
  };
  return (
    <View>
      <StatusBar
        translucent={false}
        animated={true}
        backgroundColor="#8b1414"
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          backgroundColor: "#8b1414",
        }}>
        <Text
          style={{
            padding: 10,
            fontSize: 20,

            // fontFamily: "BungeeInline_400Regular",
            color: "#fff",
          }}>
          Egypt Taxi Prices
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>ar</Text>
          <Switch
            trackColor={{ false: "white", true: "white" }}
            onValueChange={onLanguageChange}
            value={inputSwitch}
          />
          <Text>en</Text>
        </View>
      </View>
    </View>
  );
}
