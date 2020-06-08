const locationProvider = require( '../../resources/ext.nearby.scripts/locationProvider.js' );

const geolocationRejectWithErrorCode = ( code ) => {
	return {
		getCurrentPosition: ( resolve, reject ) => {
			reject( {
				code: true,
				[ code ]: true
			} );
		}
	};
};

describe( 'LocationProvider', () => {
	describe( 'getCurrentPosition', () => {
		it( 'rejects when no support', () => {
			delete global.window.navigator.geolocation;
			locationProvider.getCurrentPosition().then( null, function ( msg ) {
				expect( msg ).toBe( locationProvider.ERROR_SERVICE_UNAVAILABLE );
			} );
		} );

		it( 'resolves when support', () => {
			global.window.navigator.geolocation = {
				getCurrentPosition: ( resolve ) => {
					resolve( {
						coords: {
							latitude: 5,
							longtitude: 6
						}
					} );
				}
			};

			locationProvider.getCurrentPosition().then( function ( coords ) {
				expect( coords.latitude ).toBe( 5 );
				expect( coords.longitude ).toBe( 6 );
			} );
		} );

		it( 'rejects when denied', () => {
			global.window.navigator.geolocation = geolocationRejectWithErrorCode( 'PERMISSION_DENIED' );

			locationProvider.getCurrentPosition().then( null, function ( msg ) {
				expect( msg ).toBe( locationProvider.PERMISSION_DENIED );
			} );
		} );

		it( 'rejects when timed out', () => {
			global.window.navigator.geolocation = geolocationRejectWithErrorCode( 'TIMEOUT' );

			locationProvider.getCurrentPosition().then( null, function ( msg ) {
				expect( msg ).toBe( locationProvider.ERROR_TIMEOUT );
			} );
		} );

		it( 'rejects when unable to find location', () => {
			global.window.navigator.geolocation = geolocationRejectWithErrorCode( 'POSITION_UNAVAILABLE' );

			locationProvider.getCurrentPosition().then( null, function ( msg ) {
				expect( msg ).toBe( locationProvider.ERROR_POSITION_UNAVAILABLE );
			} );
		} );

		it( 'rejects unknown errors', () => {
			global.window.navigator.geolocation = geolocationRejectWithErrorCode( 'as24u2uehsd' );

			locationProvider.getCurrentPosition().then( null, function ( msg ) {
				expect( msg ).toBe( locationProvider.ERROR_UNKNOWN );
			} );
		} );
	} );

	describe( 'getRandomLocation', () => {
		// Try 10 different random locations to test randomness
		Promise.all( [
			0.1,
			0.3,
			0.6,
			0.9
		].map( ( value ) => {
			Math.random = jest.fn( () => value );
			return locationProvider.getRandomLocation().then( ( coord ) => {
				expect( coord.latitude ).toNotBe( undefined );
				expect( coord.longitude ).toNotBe( undefined );
			} );
		} ) );
	} );
} );
