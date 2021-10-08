import React, { useState } from 'react';
import "./MyGoogleMap.css";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
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

const center = {
  lat: 43.653225,
  lng: -79.383186
}

const options = {
  styles: mapDarkStyles,
  disableDefaultUI: true,
  zoomControl: true
}

const MyGoogleMap = ({ location, setLocation }) => {

  const onMapClick = React.useCallback((e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date(),
    })
  }, [])

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAW0sl6m4y17JzkWaamloCpJuY0bccg1Tw",
    libraries: libraries,
  });
  if (loadError) return "Erorr loading maps;";
  if (!isLoaded) return "Loading maps";

  return (<div>
    <div className="map-user-search">
      <Search panTo={panTo} />
      <Locate panTo={panTo} />
    </div>

    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      options={options}
      onClick={onMapClick}
      onLoad={onMapLoad}
      className="map">
      <Marker
        key={location.time}
        position={{ lat: location.lat, lng: location.lng }} />)
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
            console.log(position);
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
      console.log("😱 Error: ", error);
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