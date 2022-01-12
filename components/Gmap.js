import React, { useEffect, useRef, useContext, useState } from 'react';
import { GlobalContext } from '../context/globalContext';
import { View, StyleSheet, } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GoogleMapHelper from '../utils/GoogleMapHelperClass';


export default function Gmap({ children }) {
  const [center] = useState({
    latitude: 30.0609422,
    longitude: 31.219709,
  }); //cairo

  const onLoad = React.useCallback(function callback() {
    const googleMapHelper = new GoogleMapHelper();
    setMapHelper(googleMapHelper);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMapHelper(null);
  }, []);
  const {
    originName,
    destinationName,
    setMapHelper,
    onOriginDragEnd, onDestinationDragEnd,
    originCoords,
    destinationCoords,

  } = useContext(GlobalContext)


  const mapRefContainer = useRef(null);
  useEffect(() => {
    // const mapView = new MapView();

    if (mapRefContainer.current.fitToSuppliedMarkers) {

      mapRefContainer.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {
          top: 150,
          right: 50,
          bottom: 150,
          left: 50,
        },
      }
      )
    }

  }, [originCoords, destinationCoords]);
  return (


    <View style={styles.container}>
      <MapView
        ref={mapRefContainer}
        onMapReady={onLoad}
        style={styles.map}
        initialCamera={{
          center: center,
          heading: 10,
          pitch: 10,
          zoom: 10,
          altitude: 50,
        }}

      >
        {originCoords.isReady && (
          <Marker
            draggable={true}
            identifier={'origin'}
            coordinate={originCoords}
            onDragEnd={onOriginDragEnd}
            title={'origin'}
            description={originName}
          />
        )}

        {destinationCoords.isReady && (
          <Marker
            draggable={true}
            identifier={'destination'}
            coordinate={destinationCoords}
            title={'destination'}
            onDragEnd={onDestinationDragEnd}
            description={destinationName}
          />
        )}
      </MapView>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    display: "flex",

  },
  map: {

    height: 400,

  },
});
