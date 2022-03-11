const $ = window.$,
	api = require( './api.js' ),
	ERROR_PERMISSION_DENIED = 'permission',
	ERROR_TIMEOUT = 'timeout',
	ERROR_POSITION_UNAVAILABLE = 'location',
	ERROR_UNKNOWN = 'unknown',
	ERROR_SERVICE_UNAVAILABLE = 'incompatible';
let /** @type {Coordinates[]} */ randomLocations = [];
/**
 * Detect if browser supports geolocation
 *
 * @instance
 * @return {boolean}
 */
function isAvailable() {
	return 'geolocation' in window.navigator;
}

/**
 * Obtain users current location and return a deferred object with the
 * longitude and latitude values
 * Resolve return object with 'incompatible' if browser doesn't support geo location
 *
 * @instance
 * @return {jQuery.Deferred}
 */
function getCurrentPosition() {
	const result = $.Deferred();
	if ( isAvailable() ) {
		navigator.geolocation.getCurrentPosition(
			function ( geo ) {
				result.resolve( {
					latitude: geo.coords.latitude,
					longitude: geo.coords.longitude
				} );
			},
			function ( err ) {
				let error;
				switch ( err.code ) {
					case err.PERMISSION_DENIED:
						error = ERROR_PERMISSION_DENIED;
						break;
					case err.TIMEOUT:
						error = ERROR_TIMEOUT;
						break;
					case err.POSITION_UNAVAILABLE:
						error = ERROR_POSITION_UNAVAILABLE;
						break;
					default:
						error = ERROR_UNKNOWN;
				}
				result.reject( error );
			},
			{
				timeout: 10000,
				enableHighAccuracy: true
			}
		);
	} else {
		result.reject( ERROR_SERVICE_UNAVAILABLE );
	}
	return result;
}

/**
 * Pop a random location from the previously obtained seeds.
 *
 * @return {Coordinate}
 */
function popRandomLocation() {
	const coord = randomLocations.pop();
	return {
		latitude: coord.lat,
		longitude: coord.lon
	};
}

/**
 * Obtain users current location and return a deferred object with the
 * longitude and latitude values
 * Resolve return object with 'incompatible' if browser doesn't support geo location
 *
 * @instance
 * @return {jQuery.Deferred}
 */
function getRandomLocation() {
	const result = $.Deferred();
	if ( randomLocations.length < 20 ) {
		// we don't have enough to choose from. Try to find another.
		return api.getRandomPages().then( function ( pages ) {
			randomLocations = randomLocations.concat(
				pages.map( function ( page ) {
					return page.coordinates ? page.coordinates[ 0 ] : null;
				} ).filter( function ( coords ) {
					return coords !== null;
				} )
			);
			// In the very unlikely case that failed let's generate a random coordinate
			if ( randomLocations.length < 20 ) {
				return {
					latitude: ( Math.random() * 180 ) - 90,
					longitude: ( Math.random() * 360 ) - 180
				};
			} else {
				result.resolve( popRandomLocation() );
				return result;
			}
		} );
	} else {
		result.resolve( popRandomLocation() );
	}
	return result;
}

module.exports = {
	ERROR_SERVICE_UNAVAILABLE: ERROR_SERVICE_UNAVAILABLE,
	ERROR_PERMISSION_DENIED: ERROR_PERMISSION_DENIED,
	ERROR_TIMEOUT: ERROR_TIMEOUT,
	ERROR_POSITION_UNAVAILABLE: ERROR_POSITION_UNAVAILABLE,
	ERROR_UNKNOWN: ERROR_UNKNOWN,
	getCurrentPosition: getCurrentPosition,
	getRandomLocation: getRandomLocation
};
