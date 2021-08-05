import React from "react";
import { View, Text, Switch } from "react-native";

export default function TripInfo(props) {
  const { tripDuration, tripDistance, tripPrice, id } = props;
  return (
    <View>
      {tripDistance !== 0 && (
        <View>
          <Text className="mt-3 ">
            Trip Duration:{" "}
            <Text>
              {" "}
              {`${tripDuration.hours}`} hours and {`${tripDuration.minutes}`}{" "}
              minutes
            </Text>
          </Text>
          <Text>
            Trip Distance: <Text>{`${tripDistance}`} Km</Text>
          </Text>
          <Text>
            tripPrice: <Text>{`${tripPrice}`} EGP</Text>{" "}
          </Text>
        </View>
      )}
    </View>
  );
}
