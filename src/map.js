/*global google*/
import React, { Component } from "react"
import { compose,withHandlers } from "recompose"
// import restClient from './network/restClient';
// import myIcon from './images/pin.png';
// import foto from './images/fachada.jpg';
import marcadorIcon from './images/marker_marriott.svg';
import marcadorIconW from './images/marker_marriott_w.svg';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');



const MapWithAMarker = compose(withScriptjs, withGoogleMap,
  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
  }),)(props => {

  return (
    <GoogleMap ref={props.onMapMounted} defaultZoom={5} defaultCenter={{ lat: 20.5, lng: -98 }}>
      <MarkerClusterer
        onClick={props.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        defaultImagePath=""
        clusterClass="cluster-visible"
        styles={[
          {
            textColor: 'white',
            url: '',
            height: 50,
            width: 50
        }
        ]}
        gridSize={60}
      >
        {
        props.markers.map(marker => {
        const onClick = props.onClick.bind(this, marker)
        const onMouseOver = props.onMouseOver.bind(this, marker)
        const onMouseOut = props.onMouseOut.bind(this, marker)
        // if(props.selectedMarker===marker || (props.hotelHover!==undefined && props.hotelHover.id_properties===marker.id_properties)){
        //   marker.icon = marcadorIconW;
        // }else if(props.hotelHover===undefined && marker.icon===marcadorIconW && marker.mapHover===undefined){
        //   marker.icon = marcadorIcon;
        // }
        if(props.selectedMarker===marker){
          marker.icon = marcadorIconW;
        }



        return (
          <Marker
            key={`${marker.id_properties}-marker`}
            onClick={onClick}
            // draggable={true}
            // icon={{url:'http://petsocieties.com/assets/img/home/pinpoint_active.svg', scaledSize: new google.maps.Size(45, 60)}}
            position={{ lat: marker.coordX, lng: marker.coordY}}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          >
            {props.selectedMarker === marker &&
              <InfoWindow
              onCloseClick={props.onClose}
              className="infoWindow">
                <div className="pinCard">
                  <div className="photoBox">
                    <img src={marker.photo_path} className="pinPhotoCard"/>
                  <div className="mask"></div>

                    <div className=""></div>
                    <div className="infoPhotoBox">
                      <h6>{marker.property}</h6>
                      <span>{marker.rooms}</span><span> rooms</span>
                    </div>
                  </div>
                  <div className="footerPin">
                    <a href={marker.link} target="_blank">Hotel Website (Click here)</a>
                  </div>
                </div>



              </InfoWindow>}
          </Marker>
        )
      })}

      </MarkerClusterer>

    </GoogleMap>
  )
})

export default class GoogleMaps extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      properties: this.props.propertiesList,
      selectedMarker: false,
    }
  }
  componentDidMount() {


  }
  handleClick = (marker, event) => {
    this.setState({ selectedMarker: marker })
  }
  handleCloseClick = (marker, event) => {
    this.setState({ selectedMarker: undefined })
  }
  onMouseOver=(marker)=>{
    marker.icon = marcadorIconW;
    marker.mapHover = true;
    this.forceUpdate();
  }
  onMouseOut = (marker)=>{
    marker.icon = marcadorIcon;
    marker.mapHover = undefined;
    this.forceUpdate();
  }
  handleMapMounted = map => {
    if (map) {
      this.map = map;
    }
  }
  panToMarker=(marker)=>{
    if (window.google && this.map && marker.coordX && marker.coordY) {
      const center = new window.google.maps.LatLng(marker.coordX, marker.coordY)
      this.map.panTo(center)
      // this.map.zo
      // const bounds = new google.maps.LatLngBounds();
      // bounds.extend(new google.maps.LatLng(parseFloat(marker.coordX),parseFloat(marker.coordY)));
      // let padding = 250;
      // this.map.fitBounds(bounds,padding);
    }
  }
  fitMarkersBound=()=>{
    const arrayCoords = [];
    const bounds = new window.google.maps.LatLngBounds();
    this.props.propertiesList.map((marcador,index) => {
      bounds.extend(new window.google.maps.LatLng(parseFloat(marcador.coordX),parseFloat(marcador.coordY)));
    })
    let padding = 50;
    if(this.props.propertiesList.length==1){
      let temp = this.props.propertiesList[0];
      let lng = parseFloat(temp.lng) + 0.005;
      bounds.extend(new window.google.maps.LatLng(parseFloat(temp.lat),lng));
      padding = 400
    }
    this.map.fitBounds(bounds,padding);
  }

  
  render() {
    if(this.props.hotelSelected!==undefined){
      this.panToMarker(this.props.hotelSelected)
    }
    return (
      <MapWithAMarker
        onMarkerClustererClick
        selectedMarker={this.state.selectedMarker}
        markers={this.props.propertiesList}
        onClick={this.handleClick}
        onClose={this.handleCloseClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOUNN5NBOHyrHAOKyvFkDM1P9zZZOsIug&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `calc(100vh)` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        hotelHover={this.props.hotelHover}
        onMapMounted={this.handleMapMounted}
      />
    )
  }
}
