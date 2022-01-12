import React, { useState, useRef, useContext } from 'react';
import { useIsConnected } from 'react-native-offline';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

export const GlobalContext = React.createContext();


export const GlobalContextProvider = ({ children }) => {
    const [scrollCoords, setScrollCoords] = useState({ x: "", y: "" })
    const { t, i18n } = useTranslation();
    const isConnected = useIsConnected();
    const [originName, setOriginName] = useState('zamalek cairo');
    const [destinationName, setDestinationName] = useState('gardencity cairo');
    const [tripDuration, setTripDuration] = useState({ hours: 0, minutes: 0 });
    const [tripDistance, setTripDistance] = useState(0);
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
    const [showTripInfo, setShowTripInfo] = useState(true);
    const [mapHelper, setMapHelper] = React.useState(null);
    const [departureTime, setDepartureTime] = useState();
    const [originErrorMessage, setOriginErrorMessage] = useState(false);
    const [destinationErrorMessage, setDestinationErrorMessage] = useState(false);
    const [routeNotFoundError, setRouteNotFoundError] = useState(false);

    const [originNotEgypt, setOriginNotEgypt] = useState(false);
    const [destinationNotEgypt, setDestinationNotEgypt] = useState(false);
    const scrollViewElement = useRef(null)

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

        <GlobalContext.Provider value={{
            isConnected,
            scrollCoords, setScrollCoords,
            t, i18n,
            originName, setOriginName,
            destinationName, setDestinationName,
            originCoords, setOriginCoords,
            destinationCoords, setDestinationCoords,
            tripPrice, setTripPrice,
            showTripInfo, setShowTripInfo, makeTripInfo,
            tripDistance, tripDuration,
            mapHelper, setMapHelper,
            departureTime, setDepartureTime,
            originErrorMessage, setOriginErrorMessage,
            destinationErrorMessage, setDestinationErrorMessage,
            routeNotFoundError, setRouteNotFoundError,
            originNotEgypt, setOriginNotEgypt,
            destinationNotEgypt, setDestinationNotEgypt,
            handleSubmit, scrollViewElement,
            onOriginDragEnd, onDestinationDragEnd
        }}>

            {children}

        </GlobalContext.Provider>
    )
}

