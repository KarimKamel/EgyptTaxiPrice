import React, {useEffect, useRef} from 'react';

import {View,  StyleSheet, } from 'react-native';
import MapView, {Marker} from 'react-native-maps';





// import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  height: '400px',
  marginTop: '1rem',
};

export default function Gmap(props) {
  const {
    center,
    onLoad,
    
    originPosition,
    destinationPosition,
    
    onOriginDragEnd,
    onDestinationDragEnd,
    originName,
    destinationName,
  } = props;
  const mapRefContainer = useRef(null);
  useEffect(() => {
    // const mapView = new MapView();
    
    if (mapRefContainer.current.fitToSuppliedMarkers){ 
      
      mapRefContainer.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: {
        top: 150,
        right: 10,
        bottom: 150,
        left: 10,
      },
    }
    )
  }
   
  }, [originPosition, destinationPosition]);
  return (
    // < className="col-12 col-md-8 col-lg-6 col-xl-6 text-left px-lg-4">

    <View style={styles.map}>
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
        // camera={{
        //   center: center,
        //   heading: 10,
        //   pitch: 10,
        //   zoom: 10,
        //   altitude: 50,
        // }}
      >
        {originPosition.isReady && (
          <Marker
            draggable={true}
            identifier={'origin'}
            coordinate={originPosition}
            onDragEnd={onOriginDragEnd}
            title={'origin'}
            description={originName}
          />
        )}

        {destinationPosition.isReady && (
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
    width: 'auto',
    height: 300,
    display: 'flex',
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
  },
});
