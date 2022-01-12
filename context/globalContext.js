import React, { useState, useRef, useContext } from 'react';
import { useIsConnected } from 'react-native-offline';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

export const GlobalContext = React.createContext();


export const GlobalContextProvider = ({ children }) => {
    const [scrollCoords, setScrollCoords] = useState({ x: "", y: "" })
    const { t, i18n } = useTranslation();
    const isConnected = useIsConnected();

    return (

        <GlobalContext.Provider value={{
            isConnected,
            scrollCoords,
            setScrollCoords, t, i18n
        }}>{children}</GlobalContext.Provider>
    )
}

