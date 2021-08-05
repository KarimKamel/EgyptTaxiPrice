import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView} from 'react-native';
import Form from './Form';
import Gmap from './Gmap';
import TripInfo from './TripInfo';
import GoogleMap from './GoogleMapClass';
import {REACT_APP_GOOGLE_MAPS_API_KEY} from '@env';

import {useIsConnected} from 'react-native-offline';

import BootstrapStyleSheet from 'react-native-bootstrap-styles';

import Header from './Header';

const bootstrapStyleSheet = new BootstrapStyleSheet();
const {s, c} = bootstrapStyleSheet;

const ggmap = new GoogleMap();

export default function ContentContainer(props) {
  const isConnected = useIsConnected();
  const {t, i18n} = props;

  const [originName, setOriginName] = useState('zamalek cairo');
  const [destinationName, setDestinationName] = useState('gardencity cairo');
  const [center, setCenter] = useState({
    latitude: 30.0609422,
    longitude: 31.219709,
  }); //cairo
  const [originCoords, setOriginCoords] = useState({
    latitude: 30.0609422,
    longitude: 31.219709,
  });
  const [destinationCoords, setDestinationCoords] = useState({
    latitude: 30.0380584,
    longitude: 31.2325889,
  });
  const [tripPrice, setTripPrice] = useState(0);
  const [tripDuration, setTripDuration] = useState({hours: 0, minutes: 0});
  const [tripDistance, setTripDistance] = useState(0);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState({
    height: '',
    width: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [originErrorMessage, setOriginErrorMessage] = useState(false);
  const [destinationErrorMessage, setDestinationErrorMessage] = useState(false);
  const [routeNotFoundError, setRouteNotFoundError] = useState(false);
  const [showTripInfo, setShowTripInfo] = useState(true);

  const [mapObject, setMap] = React.useState(null);

  useEffect(() => {
    console.log('destination name ', destinationName);
    console.log('origin name ', originName);
    bootstrapStyleSheet.addOrientationListener(data => {
      setScreenDimensions({width: data.width, height: data.height});
    });
  }, []);

  const onLoad = React.useCallback(function callback() {
    console.log('in on load');
    setIsLoaded(true);

    const googleMapObject = new GoogleMap();
    setMap(googleMapObject);
  }, []);
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // fill in the fields that make up the trip info banner
  // show the trip info banner

  function makeTripInfo(
    originFormattedName,
    destinationFormattedName,

    distanceInMeters,
    durationInSeconds,
  ) {
    const _tripPrice = mapObject.getPrice(distanceInMeters, durationInSeconds);

    //convert trip time to hours and minutes

    const {hours, minutes} = mapObject.convertTime(durationInSeconds);

    //set trip distance in state

    setTripDistance(distanceInMeters / 1000);

    //set trip duration in state

    setTripDuration({hours, minutes});

    //set trip price in state

    setTripPrice(_tripPrice);
    setDestinationName(destinationFormattedName);
    setOriginName(originFormattedName);
    setShowTripInfo(true);
  }

  const handleSubmit = async e => {
    setRouteNotFoundError(false);
    setOriginErrorMessage(false);
    setDestinationErrorMessage(false);
    e.preventDefault();
    // console.log("origin:", originName);
    // console.log("destination", destinationName);

    //get trip duration, distance, origin and destination formatted names using distance matrix service
    try {
      const {
        status,
        distanceInMeters,
        durationInSeconds,
        originFormattedName,
        destinationFormattedName,
      } = await mapObject.getTripData(originName, destinationName);

      if (status === 'OK') {
        makeTripInfo(
          originFormattedName,
          destinationFormattedName,

          distanceInMeters,
          durationInSeconds,
        );
      } else if (status === 'ZERO_RESULTS') {
        //zero results means no route connecting origin and destination was found
        //show error message accordingly

        setRouteNotFoundError(true);
        setShowTripInfo(false);
        setOriginErrorMessage(false);
        setDestinationErrorMessage(false);

        setDestinationName(destinationFormattedName);
        setOriginName(originFormattedName);
      } else {
        //if execution reaches this point it means origin or destination were not found
        //show error message accordingly
        setRouteNotFoundError(false);
        setShowTripInfo(false);
        if (destinationFormattedName)
          setDestinationName(destinationFormattedName);
        else setDestinationErrorMessage(true);
        if (originFormattedName) setOriginName(originFormattedName);
        else setOriginErrorMessage(true);
      }

      // get origin and destination coords from their name using geocode service.

      const {_originCoords, _destinationCoords} =
        await mapObject.geocodeLocations(
          originFormattedName,
          destinationFormattedName,
        );

      //set origin and destination coords in state and pass them to markers as props

      setOriginCoords({
        latitude: _originCoords.lat,
        longitude: _originCoords.lng,
      });
      setDestinationCoords({
        latitude: _destinationCoords.lat,
        longitude: _destinationCoords.lng,
      });

      // const scrollElement = document.querySelector("#target");
      // scrollElement.scrollIntoView();
      // scrollIntoView(document.querySelector("#target") );
    } catch (error) {
      console.log(error);
    }
  };
  const onOriginDragEnd = async e => {
    const coords =
      e.nativeEvent.coordinate.latitude +
      ',' +
      e.nativeEvent.coordinate.longitude;
    console.log(coords);

    const {
      distanceInMeters,
      durationInSeconds,
      originFormattedName,
      destinationFormattedName,
    } = await mapObject.getTripData(coords, destinationName);
    console.log('from: ', originFormattedName);
    console.log('to: ', destinationFormattedName);
    makeTripInfo(
      originFormattedName,
      destinationFormattedName,
      distanceInMeters,
      durationInSeconds,
    );
  };
  const onDestinationDragEnd = async e => {
    const coords =
      e.nativeEvent.coordinate.latitude +
      ',' +
      e.nativeEvent.coordinate.longitude;
    console.log(coords);
    const {
      distanceInMeters,
      durationInSeconds,
      originFormattedName,
      destinationFormattedName,
    } = await mapObject.getTripData(originName, coords);
    console.log('from: ', originFormattedName);
    console.log('to: ', destinationFormattedName);
    makeTripInfo(
      originFormattedName,
      destinationFormattedName,
      distanceInMeters,
      durationInSeconds,
    );

    // get trip fare based on duration and distance
  };
  return (
    <ScrollView>
      <Header />

      <View style={styles.scrollView}>
        {!isConnected && (
          <Text style={{color: 'red', padding: 8}}>
            {t('container:loadMapError')}
          </Text>
        )}

        <View style={{padding: 8}}>
          <Form
            handleSubmit={handleSubmit}
            originValue={originName}
            destinationValue={destinationName}
            setOriginName={setOriginName}
            setDestinationName={setDestinationName}
            setDepartureTime={setDepartureTime}
            destinationError={destinationErrorMessage}
            originError={originErrorMessage}
            routeNotFoundError={routeNotFoundError}
            departureTime={departureTime}
            i18n={i18n}
            primary={true}
            t={t}
          />

          <View style={{flex: 1, flexDirection: 'column'}}>
            <Gmap
              loadError={loadError}
              center={center}
              onLoad={onLoad}
              onUnmount={onUnmount}
              originPosition={originCoords}
              destinationPosition={destinationCoords}
              onOriginDragEnd={onOriginDragEnd}
              onDestinationDragEnd={onDestinationDragEnd}
              originName={originName}
              destinationName={destinationName}>
              {showTripInfo && (
                <TripInfo
                  tripPrice={tripPrice}
                  tripDistance={tripDistance}
                  tripDuration={tripDuration}
                />
              )}
            </Gmap>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
