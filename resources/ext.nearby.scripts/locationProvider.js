var $ = window.$,
	ERROR_PERMISSION_DENIED = 'permission',
	ERROR_TIMEOUT = 'timeout',
	ERROR_POSITION_UNAVAILABLE = 'location',
	ERROR_UNKNOWN = 'unknown',
	ERROR_SERVICE_UNAVAILABLE = 'incompatible';

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
	var result = $.Deferred();
	if ( isAvailable() ) {
		navigator.geolocation.getCurrentPosition(
			function ( geo ) {
				result.resolve( {
					latitude: geo.coords.latitude,
					longitude: geo.coords.longitude
				} );
			},
			function ( err ) {
				var error;
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
 * Obtain users current location and return a deferred object with the
 * longitude and latitude values
 * Resolve return object with 'incompatible' if browser doesn't support geo location
 *
 * @instance
 * @return {jQuery.Deferred}
 */
function getRandomLocation() {
	var
		getValue = function () {
			var choice = Math.floor( Math.random() * 100 );
			if ( choice < 25 ) {
				return [ 48.8497, 2.3521 ];
			} else if ( choice < 50 ) {
				return [ 31.1552, 121.4758 ];
			} else if ( choice < 75 ) {
				return [ -22.9181, -43.1965 ];
			} else {
				return [ 37.78340926669369, -122.46877232748169 ];
			}
		},
		coordinate = getValue();

	return $.Deferred().resolve( {
		latitude: coordinate[ 0 ],
		longitude: coordinate[ 1 ]
	} );
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
