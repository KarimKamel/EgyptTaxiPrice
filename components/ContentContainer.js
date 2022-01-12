import React, { useState, useRef, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Form from './Form';
import Gmap from './Gmap';
import TripInfo from './TripInfo';
import GoogleMapHelper from '../utils/GoogleMapHelperClass';
import { useIsConnected } from 'react-native-offline';
import Header from './Header';
import colors from '../constants/colors';
import { GlobalContext, GlobalContextProvider } from '../context/globalContext';


export default function ContentContainer(props) {

  const {
    isConnected,
    setScrollCoords, scrollCoords, t, i18n
  } = useContext(GlobalContext)


  const scrollViewElement = useRef(null)
  const [originName, setOriginName] = useState('zamalek cairo');
  const [destinationName, setDestinationName] = useState('gardencity cairo');
  const [center] = useState({
    latitude: 30.0609422,
    longitude: 31.219709,
  }); //cairo
  const [originCoords, setOriginCoords] = useState({
    isReady: false,
    latitude: '',
    longitude: '',
  });
  const [destinationCoords, setDestinationCoords] = useState({
    isReady: false,
    latitude: '',
    longitude: '',
  });
  const [tripPrice, setTripPrice] = useState(0);
  const [tripDuration, setTripDuration] = useState({ hours: 0, minutes: 0 });
  const [tripDistance, setTripDistance] = useState(0);
  const [departureTime, setDepartureTime] = useState();


  const [originErrorMessage, setOriginErrorMessage] = useState(false);
  const [destinationErrorMessage, setDestinationErrorMessage] = useState(false);
  const [routeNotFoundError, setRouteNotFoundError] = useState(false);
  const [showTripInfo, setShowTripInfo] = useState(true);
  const [originNotEgypt, setOriginNotEgypt] = useState(false);
  const [destinationNotEgypt, setDestinationNotEgypt] = useState(false);

  const [mapHelper, setMapHelper] = React.useState(null);

  const onLoad = React.useCallback(function callback() {
    const googleMapHelper = new GoogleMapHelper();
    setMapHelper(googleMapHelper);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMapHelper(null);
  }, []);

  // fill in the fields that make up the trip info banner
  // show the trip info banner

  function makeTripInfo(
    originFormattedName,
    destinationFormattedName,

    distanceInMeters,
    durationInTrafficSeconds,
  ) {
    const _tripPrice = mapHelper.getPrice(
      distanceInMeters,
      durationInTrafficSeconds,
    );

    //convert trip time to hours and minutes

    const { hours, minutes } = mapHelper.convertTime(durationInTrafficSeconds);

    //set trip distance in state

    setTripDistance(distanceInMeters / 1000);

    //set trip duration in state

    setTripDuration({ hours, minutes });

    //set trip price in state

    setTripPrice(_tripPrice);
    setDestinationName(destinationFormattedName);
    setOriginName(originFormattedName);
    setShowTripInfo(true);
  }

  const handleSubmit = async () => {

    setRouteNotFoundError(false);
    setOriginErrorMessage(false);
    setDestinationErrorMessage(false);


    //get trip duration, distance, origin and destination formatted names using distance matrix service
    try {
      const {
        innerStatus,
        status,
        distanceInMeters,
        durationInTrafficSeconds,
        originFormattedName,
        destinationFormattedName,
      } = await mapHelper.getTripData(
        originName,
        destinationName,
        departureTime,
      );

      if (innerStatus === 'OK') {
        setRouteNotFoundError(false);
        setOriginErrorMessage(false);
        setDestinationErrorMessage(false);

        makeTripInfo(
          originFormattedName,
          destinationFormattedName,
          distanceInMeters,
          durationInTrafficSeconds,
        );


        const { _locationCoords: _originCoords, locationCountry: originCountry } =
          await mapHelper.geocodeLocation(originFormattedName);

        if (originCountry !== 'Egypt') {
          setOriginNotEgypt(true);

        }
        setOriginCoords({
          isReady: true,
          latitude: _originCoords.lat,
          longitude: _originCoords.lng,
        });

        const {
          _locationCoords: _destinationCoords,
          locationCountry: destinationCountry,
        } = await mapHelper.geocodeLocation(destinationFormattedName);

        if (destinationCountry !== 'Egypt') {
          setDestinationNotEgypt(true);

        }
        setDestinationCoords({
          isReady: true,
          latitude: _destinationCoords.lat,
          longitude: _destinationCoords.lng,
        });
        scrollViewElement.current.scrollTo(scrollCoords)
      } else if (innerStatus === 'ZERO_RESULTS') {
        //zero results means no route connecting origin and destination was found
        //show error message accordingly
        setOriginCoords({
          isReady: false,
          latitude: '',
          longitude: '',
        });
        setDestinationCoords({
          isReady: false,
          latitude: '',
          longitude: '',
        });

        setRouteNotFoundError(true);
        setShowTripInfo(false);
        setOriginErrorMessage(false);
        setDestinationErrorMessage(false);


        // setDestinationName(destinationFormattedName);
        // setOriginName(originFormattedName);
      } else {
        //if execution reaches this point it means origin or destination were not found
        //show error message accordingly
        setRouteNotFoundError(false);
        setShowTripInfo(false);
        if (originFormattedName) setOriginName(originFormattedName);
        else {
          setOriginCoords({
            isReady: false,
            latitude: '',
            longitude: '',
          });
          setOriginErrorMessage(true);
        }

        if (destinationFormattedName)
          setDestinationName(destinationFormattedName);
        else {
          setDestinationErrorMessage(true);
          setDestinationCoords({
            isReady: false,
            latitude: '',
            longitude: '',
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const onOriginDragEnd = async e => {
    const coords =
      e.nativeEvent.coordinate.latitude +
      ',' +
      e.nativeEvent.coordinate.longitude;


    const {
      distanceInMeters,
      durationInTrafficSeconds,
      originFormattedName,
      destinationFormattedName,
    } = await mapHelper.getTripData(coords, destinationName);


    makeTripInfo(
      originFormattedName,
      destinationFormattedName,
      distanceInMeters,
      durationInTrafficSeconds,
    );
  };
  const onDestinationDragEnd = async e => {
    const coords =
      e.nativeEvent.coordinate.latitude +
      ',' +
      e.nativeEvent.coordinate.longitude;

    const {
      distanceInMeters,
      durationInTrafficSeconds,
      originFormattedName,
      destinationFormattedName,
    } = await mapHelper.getTripData(originName, coords);


    makeTripInfo(
      originFormattedName,
      destinationFormattedName,
      distanceInMeters,
      durationInTrafficSeconds,
    );
  };
  return (
    <ScrollView ref={scrollViewElement}
      onLayout={(event) =>
        setScrollCoords({ x: 0, y: (event.nativeEvent.layout.y + event.nativeEvent.layout.height) })
      } >
      <Header />


      <View style={{ marginHorizontal: 10 }}>
        {!isConnected && (
          <Text style={{ color: colors.primary, padding: 8 }}>
            {t('container:loadMapError')}
          </Text>
        )}

        <View style={{ padding: 8 }}>
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
            destinationNotEgypt={destinationNotEgypt}
            originNotEgypt={originNotEgypt}
            i18n={i18n}
            primary={true}
            t={t}
          />

          <View
            style={{ flex: 1, flexDirection: 'column' }}>
            <Gmap
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
                  t={t}
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
