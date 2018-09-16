import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
// import Dropdown from './components/Dropdown'
import Map from './components/Map'
import Search from "./components/Search";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            center:
              {
              lat: -33.86411252085682,
              lng: 151.2079701552909
              },
            zoom: 13,
            map: '',
            info: '',
            venues: [],
            listedMarkers: [],
            highlightedIcon: null,
            querySelector: 'food',
            client_id: "YCMGPBOPZCPOG4QYVXZ4ETGY5TLVNO34BGYAZ1NNKA3T44KS",
            client_secret: "EKIC4ZUG3DJJGATRLZA2WO1W3X5L204BHM0XG2RE5IGP0GK5"
        };

        this.initMap = this.initMap.bind(this);
        this.onclickLocation = this.onclickLocation.bind(this)
    }

//do not do initMap in this component as we won't have venues then
  componentDidMount() {
    // this.updateQuery()
    this.getVenues()
    this.onclickLocation()

}

  renderMap = () => {
    loadMap("https://maps.googleapis.com/maps/api/js?key=AIzaSyCIgum1zb5V0e5Z6em7zkzPhbM7R_E2eB0&callback=initMap")
    window.initMap = this.initMap

    // window.initAutocomplete = this.initAutocomplete
  }

//to get venues from foursquare
    getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: this.state.client_id,
      client_secret: this.state.client_secret,
      query: this.state.querySelector,
      // categoryId: this.state.querySelector,
      near: "Sydney",
      v: "20180903"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
        // console.log(response)

        //response.data.response.groups[0].items
      })
      .catch(error => {
        console.log("ERROR! " + error)
      })
  }

    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: this.state.zoom,
          center: this.state.center
        });

        const infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});

        this.state.venues.forEach(fsVenue => {

          var contentString = `${fsVenue.venue.name} , ${fsVenue.venue.location.address}`

          const markerLocation = {lat: fsVenue.venue.location.lat, lng: fsVenue.venue.location.lng}
        //creating the custom marker icon
            let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            let marker = new window.google.maps.Marker({
              position: markerLocation,
              map: map,
              title: fsVenue.venue.name,
              icon: iconBase + 'coffee.png'
            });


          marker.addListener('click', function () {
              // console.log(markerLocation)

              marker.setAnimation(window.google.maps.Animation.BOUNCE);
                  setTimeout(function() {
                    marker.setAnimation(null);
                  }, 2100);
                  infowindow.setContent(contentString)
              infowindow.open(map, marker)

          //need to move a center of a map to the marker position
              let newMarkerCenter=new window.google.maps.LatLng(markerLocation);
              map.setCenter(newMarkerCenter)


          });

          let listedMarker = this.state.listedMarkers;
          if(!listedMarker.includes(marker)) {
            listedMarker.push(marker);
          }

          this.setState({listedMarkers: listedMarker});

        });
  }

  changeCenter = (LatLng) => {
   this.setState({center: LatLng})
 }

  onclickLocation = () => {
    let that = this

    document.querySelector('.search').addEventListener('click', function (e) {
      for (var i = 0; i < that.state.listedMarkers.length; i++) {
        if  (that.state.listedMarkers[i].title.toLowerCase() === e.target.innerText.toLowerCase()) {
        let newlocation = {lat: that.state.venues[i].venue.location.lat, lng: that.state.venues[i].venue.location.lng}
        console.log("newloc", newlocation)
        that.setState({center: newlocation})
        let newMarkerCenter2=new window.google.maps.LatLng(newlocation);
        that.state.map.setCenter(newMarkerCenter2)

var contentString2 = that.state.venues[i].venue.location.address + ', \n ' + that.state.venues[i].venue.name
        that.state.info.setContent(contentString2)
        that.state.info.open(that.state.map, that.state.listedMarkers[i])

        var k = e.target.style.color;
        e.target.style.color = 'red';
        setTimeout(function(){
        e.target.style.color = k;
   }, 2000);


         console.log("cont", contentString2)
         var tot = that.state.listedMarkers[i]
         tot.setAnimation(window.google.maps.Animation.BOUNCE);
                 setTimeout(function() {
                    tot.setAnimation(null);
                  }, 2000);

           console.log("state", that.state)
           console.log("state", that.state.center)
           console.log("map", that.state.map)
      // alert(that.state.venues[i].venue.name)
        }
      }


      // alert(e.target.innerText.toLowerCase())
        console.log("ven", that.state.venues)

         console.log("ls", that.state.listedMarkers)

    })
  }


    toggleNavBar= () => {
       const navbar = document.querySelector('.side');
       const mapClass = document.querySelector('#map');

        navbar.style.display === 'none'
        ? navbar.style.display = 'block'
        : (navbar.style.display = 'none',
          mapClass.style.width = '100%');

    }

    render() {
     var message = 'You selected ' + this.state.querySelector;

     console.log("cat", this.state.querySelector)
            // console.log("venues", this.state.venues)
        return (
          <div>
              <header>
                <button type="button" className="navbar-toggle collapsed"
            data-toggle="collapse" onClick={this.toggleNavBar}>
                 <div className="icon-bar"></div>
                 <div className="icon-bar"></div>
                 <div className="icon-bar"></div>

            </button>
                Google Maps with <a href="https://foursquare.com/developers/apps">Foursquare</a>
                </header>
            <div id ="container">

                  <div class='side'>

                    <p>{message}</p>
                    <Search
                        infoWindow={this.state.info}
                        openInfo={this.info}
                        listedMarker={this.state.listedMarkers}
                    >
                    </Search>
                  </div>

                <div id ="map">
                <Map markers={this.state.venues.location}></Map>
                </div>
            </div>
            </div>

        );
    }
}
function loadMap(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded. Please reload the page, and if that doesn't work reload the page. Otherwise reload page.");
    };
    tag.parentNode.insertBefore(script, tag);
}
export default App;