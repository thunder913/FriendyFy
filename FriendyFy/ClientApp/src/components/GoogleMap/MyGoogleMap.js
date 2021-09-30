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
    disableDefaultUI: true,
    zoomControl: true
}


const MyGoogleMap = () => {
    const [marker, setMarker] = useState([]);

    const onMapClick = React.useCallback((e) => {
        setMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            time: new Date(),
        })
    }, [])

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        return;
    }, [])

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB-SPedc5Ni9U9ghbmNQCSL6HLHCabM9io",
        libraries: libraries,
    });
    if (loadError) return "Erorr loading maps;";
    if (!isLoaded) return "Loading maps";

    return (<div>
        <Search />
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}>
            <Marker
                key={marker.time}
                position={{ lat: marker.lat, lng: marker.lng }} />)
        </GoogleMap>
    </div>)
}

function Search() {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.653225, lng: () => -79.383186 },
            radius: 200 * 1000
        }
    })

    return (
    <div className="search">
    <Combobox onSelect={(address) => { console.log(address) }}>
        <ComboboxInput
        autoComplete="text"
            value={value}
            onChange={(e) => {
                console.log(data);
                setValue(e.target.value)
            }}
            disabled={!ready}
            placeholder="Enter an address" />
            <ComboboxPopover >
                {status === "OK" && data.map(({id, description}) => <ComboboxOption key={id} value={description}/>)}
            </ComboboxPopover>
    </Combobox>
    </div>)
}

export default MyGoogleMap;