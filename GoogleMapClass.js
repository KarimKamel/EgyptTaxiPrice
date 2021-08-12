import {calculateFare, calculateTime} from './utils/utils';

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

  getTripData = async (originName, destinationName, departureTime) => {
    console.log('in trip data');
    //if departure time has been changed by the user it will be returned in string format
    //if so, create a new date object with departure time and make sure departure time is not in the past
    //else create a new date object and use that as departure time
    var currentTime = new Date();
    if (!departureTime || departureTime < currentTime)
      departureTime = currentTime;
    departureTime = departureTime.getTime() / 1000;
    departureTime = Math.ceil(departureTime);

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

    //can you access variable in android manifest???
    console.log(
      originName,
      destinationName,
      departureTime,
      REACT_APP_GOOGLE_MAPS_API_KEY,
    );

    response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&region=EG&origins=${originName}&destinations=${destinationName}&departure_time=${departureTime}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
    );
    // response = await fetch(
    //   `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&region=EG&origins=${originName}&destinations=${destinationName}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
    // );

    var response = await response.json();
    console.log('distance matrix response', response);
    const status = response.status;
    var innerStatus;
    if (status === 'OK') innerStatus = response.rows[0].elements[0].status;
    console.log('distance matrix status:', status);
    console.log('distance matrix inner status:', innerStatus);
    const originFormattedName = response.origin_addresses[0];
    const destinationFormattedName = response.destination_addresses[0];

    var distanceInMeters;
    var durationInSeconds;

    if (innerStatus === 'OK') {
      console.log(response.rows[0].elements);
      distanceInMeters = response.rows[0].elements[0].distance.value;
      console.log('distance text:', response.rows[0].elements[0].distance.text);
      durationInSeconds = response.rows[0].elements[0].duration.value;
      durationInTrafficSeconds =
        response.rows[0].elements[0].duration_in_traffic.value;
      console.log('duration text:', response.rows[0].elements[0].duration.text);
    }
    console.log(
      'distance matrix status: ',
      status,
      '\ndistance matrix inner status: ',
      innerStatus,
      ' \ndistance matrix duration in seconds: ',
      durationInSeconds,
      ' \ndistance matrix duration in traffic seconds: ',
      durationInTrafficSeconds,
      '\ndistance matrix distance in meters: ',
      distanceInMeters,
      '\ndistanceMatrix origin formatted name: ',
      originFormattedName,
      '\ndistancematrix destination formatted name: ',
      destinationFormattedName,
    );
    return {
      innerStatus,
      status,
      distanceInMeters,
      durationInTrafficSeconds,
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
    // console.log('originValues', originValues);
    // console.log(
    //   'address components',
    //   originValues.results[0].address_components,
    // );
    // console.log('originValues', originValues.results[0].address_components[3]);
    const originCountry =
      originValues.results[0].address_components[3].long_name;
    const destinationCountry =
      destinationValues.results[0].address_components[3].long_name;
    // console.log('destinationValues', destinationValues);
    const _originCoords = originValues.results[0].geometry.location;
    const _destinationCoords = destinationValues.results[0].geometry.location;
    // console.log(_originCoords, _destinationCoords);
    return {
      _originCoords,
      _destinationCoords,
      originCountry,
      destinationCountry,
    };
  };
  geocodeLocation = async locationFormattedName => {
    var locationValues;

    locationValues = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${locationFormattedName}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
    );

    locationValues = await locationValues.json();

    // console.log('locationValues', locationValues);
    // console.log(
    //   'address components',
    //   locationValues.results[0].address_components[0],
    // );

    var locationCountry;
    locationValues.results[0].address_components.forEach(element => {
      if (element.types && element.types.includes('country'))
        locationCountry = element.long_name;
    });

    const _locationCoords = locationValues.results[0].geometry.location;

    // console.log(_originCoords, _destinationCoords);
    return {
      _locationCoords,

      locationCountry,
    };
  };

  getPrice(distanceInMeters, durationInSeconds) {
    const _tripPrice = calculateFare(distanceInMeters, durationInSeconds);
    return _tripPrice;
  }
  convertTime(durationInSeconds) {
    return calculateTime(durationInSeconds);
  }
}
