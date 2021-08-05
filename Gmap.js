import React, {useEffect, useRef} from 'react';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker, EdgePadding} from 'react-native-maps';
import {or} from 'react-native-reanimated';

const bootstrapStyleSheet = new BootstrapStyleSheet();
const {s, c} = bootstrapStyleSheet;

// import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  height: '400px',
  marginTop: '1rem',
};

export default function Gmap(props) {
  const {
    center,
    onLoad,
    onUnmount,
    originPosition,
    destinationPosition,
    loadError,
    onOriginDragEnd,
    onDestinationDragEnd,
    originName,
    destinationName,
  } = props;
  const mapRefContainer = useRef(null);
  useEffect(() => {
    // const mapView = new MapView();
    console.log(originPosition);
    mapRefContainer.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: {
        top: 150,
        right: 10,
        bottom: 150,
        left: 10,
      },
    });
  }, [originPosition, destinationPosition]);
  return (
    // < className="col-12 col-md-8 col-lg-6 col-xl-6 text-left px-lg-4">

    <View style={styles.map}>
      <MapView
        ref={mapRefContainer}
        onMapReady={onLoad}
        style={styles.map}
        camera={{
          center: center,
          heading: 10,
          pitch: 10,
          zoom: 10,
          altitude: 50,
        }}>
        {originPosition && (
          <Marker
            draggable={true}
            identifier={'origin'}
            coordinate={originPosition}
            onDragEnd={onOriginDragEnd}
            title={'origin'}
            description={originName}
          />
        )}

        {destinationPosition && (
          <Marker
            draggable={true}
            identifier={'destination'}
            coordinate={destinationPosition}
            title={'destination'}
            onDragEnd={onDestinationDragEnd}
            description={destinationName}
          />
        )}
      </MapView>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: 350,
    height: 400,
    display: 'flex',
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
  },
});
