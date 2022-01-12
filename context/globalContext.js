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

    return (

        <GlobalContext.Provider value={{
            isConnected,
            scrollCoords, setScrollCoords,
            t, i18n,
            originName, setOriginName,
            destinationName, setDestinationName,
            originCoords, setOriginCoords,
            destinationCoords, setDestinationCoords
        }}>

            {children}

        </GlobalContext.Provider>
    )
}

