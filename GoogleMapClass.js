import {calculateFare, calculateTime} from './utils/utils';
import {Loader} from '@googlemaps/js-api-loader';
// import { REACT_APP_GOOGLE_MAPS_API_KEY } from "@env";
const REACT_APP_GOOGLE_MAPS_API_KEY = 'AIzaSyCBQYwPosTpSUuW4C70A3IzBnI-_CHjBuM';
export default class GoogleMap {
  // constructor() {

  //   // this.mapOptions = {
  //   //   center: {
  //   //     lat: 30,
  //   //     lng: 31,
  //   //   },
  //   //   zoom: 4,
  //   // };
  //   // this.map = map;
  // }

  setMap(map) {
    this.map = map;
  }

  getTripData = async (originName, destinationName) => {
    console.log('in trip data');
    //if departure time has been changed by the user it will be returned in string format
    //if so, create a new date object with departure time and make sure departure time is not in the past
    //else create a new date object and use that as departure time
    var departureDate = new Date();

    //create a distanceMatrix service request using origin name, destination name and departure time

    // const request = {
    //   origins: [originName],
    //   destinations: [destinationName],
    //   travelMode: window.google.maps.TravelMode.DRIVING,
    //   unitSystem: window.google.maps.UnitSystem.METRIC,
    //   drivingOptions: {
    //     departureTime: departureDate,
    //   },
    //   avoidHighways: false,
    //   avoidTolls: false,
    // };

    //call distance matrix service

    var response;
    try {
      //can you access variable in android manifest???
      console.log(originName, destinationName, REACT_APP_GOOGLE_MAPS_API_KEY);
      console.log(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originName}&destinations=${destinationName}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
      );
      response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originName}&destinations=${destinationName}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
      );
    } catch (error) {
      console.log(error);
    }
    var response = await response.json();
    console.log(response);
    const originFormattedName = response.origin_addresses[0];
    const destinationFormattedName = response.destination_addresses[0];
    const status = response.rows[0].elements[0].status;
    var distanceInMeters;
    var durationInSeconds;
    if (status === 'OK') {
      distanceInMeters = response.rows[0].elements[0].distance.value;
      console.log('distance text:', response.rows[0].elements[0].distance.text);
      durationInSeconds = response.rows[0].elements[0].duration.value;
      console.log('duration text:', response.rows[0].elements[0].duration.text);
    }

    return {
      status,
      distanceInMeters,
      durationInSeconds,
      originFormattedName,
      destinationFormattedName,
    };
  };

  geocodeLocations = async (originFormattedName, destinationFormattedName) => {
    var originValues;
    var destinationValues;
    try {
      originValues = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${originFormattedName}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
      );
      destinationValues = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationFormattedName}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
    originValues = await originValues.json();
    destinationValues = await destinationValues.json();
    console.log('originValues', originValues);
    console.log('destinationValues', destinationValues);
    const _originCoords = originValues.results[0].geometry.location;
    const _destinationCoords = destinationValues.results[0].geometry.location;
    // console.log(_originCoords, _destinationCoords);
    return {_originCoords, _destinationCoords};
  };

  getPrice(distanceInMeters, durationInSeconds) {
    const _tripPrice = calculateFare(distanceInMeters, durationInSeconds);
    return _tripPrice;
  }
  convertTime(durationInSeconds) {
    return calculateTime(durationInSeconds);
  }
}
