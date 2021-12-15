import React, { useEffect, useState } from 'react';
import "./MyGoogleMap.css";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import usePlacesAutocomplete,
{
  getGeocode,
  getLatLng
}
  from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
}
  from "@reach/combobox"
import "@reach/combobox/styles.css";
import mapDarkStyles from './mapDarkStyles.js';

const libraries = ["places"]
const mapContainerStyle = {
  width: '100%',
  height: '300px'
}

const options = {
  styles: mapDarkStyles,
  disableDefaultUI: true,
  zoomControl: true
}

const MyGoogleMap = ({ location, setLocation, staticMap, zoom }) => {  
  const [center, setCenter] = useState({
    lat: location.lat ?? 51.1657,
    lng: location.lng ?? 15.4123
  });
  const [firstLoad, setFirstLoad] = useState(true);
  
  useEffect(() => {
    if(firstLoad){
      if(location){
        setCenter({lat: location.lat, lng: location.lng});
        setFirstLoad(false);
      }
    }
  }, [location])

  const onMapClick = React.useCallback((e) => {
    if(!staticMap){
      setLocation({
        lat: e.latLng.lat() ?? 0,
        lng: e.latLng.lng() ?? 0,
        time: new Date(),
      })
    }
  }, [])

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  if (loadError) return "Erorr loading maps;";
  if (!isLoaded) return "Loading maps";


  
  return (<div>
    {!staticMap ?
    <div className="map-user-search">
      <Search panTo={panTo} />
      <Locate panTo={panTo} />
    </div> : ''}

    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={zoom ? zoom : 3}
      center={center}
      options={options}
      onClick={onMapClick}
      onLoad={onMapLoad}
      className="map">
        {location ?       <Marker
        key={location.time}
        position={{ lat: location.lat, lng: location.lng }} /> : ''}
)
    </GoogleMap>
  </div>)
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={(e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src={require("./compass.svg")} alt="compass" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect} >
        <ComboboxInput
          autoComplete="text"
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Enter an address" />
        <ComboboxPopover className="search-suggestion">
          <ComboboxList>
            {status === "OK" && data.map(({ id, description }) => <ComboboxOption key={id} value={description}>{description}</ComboboxOption >)}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>)
}

export default MyGoogleMap;