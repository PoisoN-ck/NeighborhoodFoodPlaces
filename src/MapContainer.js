import React, {Component} from 'react'
import {GoogleApiWrapper} from 'google-maps-react'
import Sidebar from './Sidebar'

class MapContainer extends Component {

  state = {
    selectedPlaces: [],
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow() // make sure only one inforwindow exists on the map
  }

  componentDidMount() {
    let _this = this;
    navigator.geolocation.getCurrentPosition(function(pos) { //requesting current user's location to retrieve places
      fetch('https://api.foursquare.com/v2/venues/search?client_id=2WP5GO4YERTX5FI1UF1WWWM1XBPVK5JBVHZBWUUNGEM4O4L0&client_secret=QZUCZ5G3ATK5EUWYMMHXE5MD4U1BDXEMF3IMBIR5PNROUL0N&v=20180323&ll=' + pos.coords.latitude + ',' + pos.coords.longitude + '&limit=20&radius=1000&categoryId=4d4b7105d754a06374d81259')
        .then(function(data) {
          if (!data.ok) { // if request was unsucessful throw an error
            const loadingSign = document.getElementById("loadingSign");
            loadingSign.setAttribute("style", "fontSize: 30px; margin-top: 40vh;");
            loadingSign.innerHTML = "Sorry, we couldn't load your map. Check for the error code.";
            throw new Error(" code " + data.status + ". Please check for the further description of this error in the network. Sorry for the inconveniences.");
          } else { // otherwise return request
            return data.json();
          }
        })
        .then(function(request){
          _this.setState({selectedPlaces: request.response.venues}); // returns places next to user's location
          _this.initMap(pos.coords); // load map with the user's current location
          _this.showInfowindowFromList(); // showing markers on the map when list element is clicked
        })
        .catch(function(error) {
          alert(error); // alert error if request was unsuccessful
        });
    });
  }

  initMap(coords) {
  if (this.props.google) {
    const mapContainer = document.getElementById('mapContainer');
    const {google} = this.props;
    
    const mapDetails = {
      center: {lat: coords.latitude, lng: coords.longitude}, // get current location
      zoom: 15
    }

    this.map = new google.maps.Map(mapContainer, mapDetails);
    this.renderMarkers(); // add markers of current places to the map
  } else {
    alert("Sorry, there was a problem loading the map. Please, try again later");
  }
    
  }

  infowindowShow = (marker, infowindow) => {

    let {google} = this.props;
    const _this = this;

    fetch('https://api.foursquare.com/v2/venues/' + marker.venueId + '/photos?client_id=2WP5GO4YERTX5FI1UF1WWWM1XBPVK5JBVHZBWUUNGEM4O4L0&client_secret=QZUCZ5G3ATK5EUWYMMHXE5MD4U1BDXEMF3IMBIR5PNROUL0N&v=20180323&limit=1') // requesting image of the places
    .then(function(data) {
      if (!data.ok) { // if map wasn't loaded
        throw new Error("We are having some issues with loading data at this time. Please, try again later. Code " + data.status + ". Sorry for the inconveniences.");
      } else {
        return data.json();
      }
    })
    .then(function(request) {
      if (infowindow.anchor === marker) { // to prevent reopening the same infowindow
        return;
      } else {
        if (infowindow.anchor) { // remove animation from previous marker
          let index = _this.state.markers.findIndex(marker => marker === infowindow.anchor);
          _this.state.markers[index].setAnimation(null);
        }
        infowindow.anchor = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
        if (request.meta.code === 200) { // if request was successful
          if (request.response.photos.count && marker.location.address && marker.location.city) { // specifically for some places address is not available
            infowindow.setContent(`<h3 class="inforWindowHeader">${marker.title}<img class="imageContainer" src="${request.response.photos.items["0"].prefix + '300x300' + request.response.photos.items["0"].suffix}" alt="${marker.title} image"><p class="address">Address: ${marker.location.postalCode}, ${marker.location.city}, ${marker.location.address}</p><p class="attribution">Data taken from Foursquare©</p></h3>`); // paste the photo from Foursquare API to infowindow
          } else {
            infowindow.setContent(`<h3 class="inforWindowHeader">${marker.title}<img class="imageContainer" src="./images/sorry-no-photo.jpeg" alt="${marker.title} image"><p class="address">Address: Sorry, no data available. Coordinates of the spot are ${marker.position}</p><p class="attribution">Data taken from Foursquare©</p></h3>`); // or paste in the standard image
          }
        } else {
          infowindow.setContent(`<h3 class="inforWindowHeader">${marker.title}<img class="imageContainer" src="./images/sorry-no-photo.jpeg" alt="${marker.title} image">Address: Sorry, no data available. Sorry, no data available. Coordinates of the spot are ${marker.position}</p><p class="attribution">Data taken from Foursquare©</p></h3>`); // if request was unsuccessful add standard image
        }
        infowindow.open(_this.map, marker);
        infowindow.addListener('closeclick', function () {
          marker.setAnimation(null);
        })
      }
    })
    .catch(function(error) {
      infowindow.setContent(`<h3 class="inforWindowHeader">${marker.title}<img class="imageContainer" src="./images/sorry-no-photo.jpeg" alt="${marker.title} image">Address: Sorry, no data available. Sorry, no data available. Coordinates of the spot are ${marker.position}</p><p class="attribution">Data taken from Foursquare©</p></h3>`); // if request was unsuccessful add standard image
      alert(error);
    })

  }

  showInfowindowFromList = () => {
    let placesList = document.getElementById('placesList');
    const _this = this;

    placesList.addEventListener('click', function(e){ // to make the infowindow appear on selected place from the list
      let id = _this.state.markers.findIndex(marker => marker.title === e.target.innerText);
      _this.infowindowShow(_this.state.markers[id], _this.state.infowindow);
    })
  }
      

  renderMarkers = () => {
    const {google} = this.props;
    const bounds = new google.maps.LatLngBounds();
    const _this = this;

    this.state.selectedPlaces.forEach((location) => {
      const marker = new google.maps.Marker({
        venueId: location.id,
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: location.name,
        position: {lat: location.location.lat, lng: location.location.lng},
        location: location.location
      })

      marker.addListener('click', function(){ // open the infowindow on clicked marker
        _this.infowindowShow(marker, _this.state.infowindow);      
      })      

      _this.setState((state) => ({
        markers: [...state.markers, marker] // adding each markers to markers state
      }))
      bounds.extend(marker.position); // adding markers position to bounds
    })
    this.map.fitBounds(bounds); // make sure map will shown with all markers
  }

  render() {
    return (
      <div id="container">
        <header id="mainHeader">
          <h1>Food Places Map</h1>
        </header>
        <Sidebar infowindow={this.state.infowindow} selectedPlaces={this.state.selectedPlaces} markers={this.state.markers}/>
        <p id="loadingSign"><img src="./images/magnify.svg" alt="Searching"/><br/>Retrieving your location...</p>
        <div id="mapContainer" role="application">Map</div>
      </div>
      )
    }
  }

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAKX_iuf98B5zA5X4dkU1DIKrjWTUC0UBU'
})(MapContainer)