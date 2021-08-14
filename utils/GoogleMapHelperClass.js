import {calculateFare, calculateTime} from './utils';

// import { REACT_APP_GOOGLE_MAPS_API_KEY } from "@env";
const REACT_APP_GOOGLE_MAPS_API_KEY = 'AIzaSyCBQYwPosTpSUuW4C70A3IzBnI-_CHjBuM';
export default class GoogleMapHelperClass {
 

  setMap(map) {
    this.map = map;
  }

  getTripData = async (originName, destinationName, departureTime) => {
    //if departure time has been changed by the user it will be returned in string format
    //if so, create a new date object with departure time and make sure departure time is not in the past
    //else create a new date object and use that as departure time
    var currentTime = new Date();
    if (!departureTime || departureTime < currentTime)
      departureTime = currentTime;
    departureTime = departureTime.getTime() / 1000;
    departureTime = Math.ceil(departureTime);

    //create a distanceMatrix service request using origin name, destination name and departure time

    

    //call distance matrix service

    var response;

    //can you access variable in android manifest???
  

    response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&region=EG&origins=${originName}&destinations=${destinationName}&departure_time=${departureTime}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`,
    );
    

    var response = await response.json();
    
    const status = response.status;
    var innerStatus;
    if (status === 'OK') innerStatus = response.rows[0].elements[0].status;
    
    
    const originFormattedName = response.origin_addresses[0];
    const destinationFormattedName = response.destination_addresses[0];

    var distanceInMeters;
    var durationInSeconds;

    if (innerStatus === 'OK') {
      
      distanceInMeters = response.rows[0].elements[0].distance.value;
      
      durationInSeconds = response.rows[0].elements[0].duration.value;
      durationInTrafficSeconds =
        response.rows[0].elements[0].duration_in_traffic.value;
      
    }
    
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
    

    
    const originCountry =
      originValues.results[0].address_components[3].long_name;
    const destinationCountry =
      destinationValues.results[0].address_components[3].long_name;
    
    const _originCoords = originValues.results[0].geometry.location;
    const _destinationCoords = destinationValues.results[0].geometry.location;
    
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


    var locationCountry;
    locationValues.results[0].address_components.forEach(element => {
      if (element.types && element.types.includes('country'))
        locationCountry = element.long_name;
    });

    const _locationCoords = locationValues.results[0].geometry.location;

  
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
