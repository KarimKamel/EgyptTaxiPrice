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
            mapHelper, setMapHelper
        }}>

            {children}

        </GlobalContext.Provider>
    )
}

