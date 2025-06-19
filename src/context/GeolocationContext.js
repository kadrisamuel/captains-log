import React, { createContext, useContext, useState } from 'react';

const GeolocationContext = createContext();

export const GeolocationProvider = ({ children }) => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  return (
    <GeolocationContext.Provider value={{ geolocationEnabled, setGeolocationEnabled }}>
      {children}
    </GeolocationContext.Provider>
  );
};

export const useGeolocation = () => useContext(GeolocationContext);