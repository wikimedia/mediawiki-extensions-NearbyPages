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

let apiMock, apiMockNoLocation;

describe( 'LocationProvider', () => {
	describe( 'getRandomLocation', () => {
		beforeEach( () => {
			apiMock = jest.fn( () =>
				Promise.resolve(
					// 100 pages, 26 of which have locations
					require( './fixtures/random.json' )
				)
			);
			apiMockNoLocation = jest.fn( () =>
				Promise.resolve(
					// 100 pages, 26 of which have locations
					require( './fixtures/randomWithoutLocation.json' )
				)
			);
		} );

		it( 'Considers the fact that random pages may yield no results', () => {
			global.$.ajax = apiMockNoLocation;
			return locationProvider.getRandomLocation().then( ( r ) => {
				expect( apiMockNoLocation ).toHaveBeenCalledTimes( 1 );
				expect( r.latitude ).not.toBe( undefined );
				expect( r.longitude ).not.toBe( undefined );
			} );
		} );

		it( 'Returns a location that\'s difference each time from a single API request', () => {
			const results = [];
			global.$.ajax = apiMock;
			// First location request hits API and gets a result. We get 100 articles, only 50 of which
			// have location data.
			return locationProvider.getRandomLocation().then( ( r ) => {
				results.push( r );
				expect( apiMock ).toHaveBeenCalledTimes( 1 );
			} ).then( () => Promise.all(
				// We run 6 more calls so that our cache becomes 19
				( new Array( 6 ).fill( 0 ) ).map( () => {
					return locationProvider.getRandomLocation().then( ( r ) => {
						results.push( r );
					} );
				} )
			) ).then( () => {
				// After running 6 more getRandomLocation calls,
				// the cache is now depleted: 26 possibilities - 7 => 19
				expect( results.length ).toBe( 7 );
				// all results are unique
				expect( Array.from( new Set( results ) ).length ).toBe( 7 );
				// But no additional  API requests.. subsequent requests load from cache
				expect( apiMock ).toHaveBeenCalledTimes( 1 );
				return locationProvider.getRandomLocation();
			} ).then( () => {
				// Because our cache has fallen below 20 pages, a new request gets made
				expect( apiMock ).toHaveBeenCalledTimes( 2 );
			} );
		} );
	} );

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
