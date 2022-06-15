import mapboxgl from "mapbox-gl";
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import SearchBar from "./subComponents/SearchBar";
import Marker from "./subComponents/Marker";
import { getUrl, getAddress } from "../../utils/mapbox/geocoder";
mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;

export default function Map({
  features,
  changePlace,
  setMarker,
  mapType: type,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-3.74);
  const [lat, setLat] = useState(40.38);
  const [zoom, setZoom] = useState(18);
  const [mapType, setMapType] = useState(type);
  const [userPosition, setUserPosition] = useState(null);

  const dragEnd = async (e) => {
    const data = await getAddress(e.target._lngLat);
  };
  //Update map type
  useEffect(() => {
    setMapType(type);
  }, [type]);

  //Check navigator permissions
  useEffect(() => {
    if (map.current) return;
    if ("geolocation" in navigator) {
      getUserPosition();
    } else {
      setUserPosition({ lat, lng });
    }
  }, [map]);

  //Get user position
  const getUserPosition = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setUserPosition({
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      });
    });
  };

  // initialize map only once
  useEffect(() => {
   
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    //Adding geolocalitation controller.
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );

    if (changePlace) {
      const moveMap = (i) => {
        map.current.flyTo({
          center: [features[i].coordinates[0], features[i].coordinates[1]],
          zoom: 10,
        });
      };
      changePlace.current = moveMap;
    }
   
    console.log(mapType)
    //In case of having to display points on the map
    if (mapType === "features") {
      console.log("features", features.length);
      if (features?.length > 0) {
        const bounds = [];
        let indexMarker = 1;
        features.forEach((feature) => {
          // Create a React ref
          const ref = React.createRef();
          // Create a new DOM node and save it to the React ref
          ref.current = document.createElement("div");
          const root = createRoot(ref.current);
          root.render(<Marker onClick={markerClicked}>{indexMarker}</Marker>);
          indexMarker++;

          // Create a Mapbox Marker at our new DOM node
          new mapboxgl.Marker(ref.current)
            .setLngLat(feature.coordinates)
            .addTo(map.current);

          bounds.push(feature.coordinates);
        });

       
       
          var boundsF = bounds.reduce(function (boundsIn, coord) {
            return boundsIn.extend(coord);
          }, new mapboxgl.LngLatBounds(bounds[0], bounds[0]));
          map.current.fitBounds(boundsF, {
            padding: 20,
          });
        
        
      } else {
        console.log("hello")
        const ref = React.createRef();
        // Create a new DOM node and save it to the React ref
        ref.current = document.createElement("div");
        const root = createRoot(ref.current);
        root.render(<Marker onClick={markerClicked}></Marker>);
        new mapboxgl.Marker(ref.current)
          .setLngLat(features[0].coordinates)
          .addTo(map.current);
          
        map.current.fitBounds([features[0].coordinates], {
          padding: 20,
        });
      }
    }
  },[]);

  //Update map state
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const markerClicked = (e) => {
    console.log(e.target);
  };

  return (
    <div ref={mapContainer} className="map-container">
   
    </div>
  );
}
