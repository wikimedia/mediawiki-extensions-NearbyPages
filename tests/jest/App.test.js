const VueTestUtils = require( '@vue/test-utils' );
const Vue = require( 'vue' );
const App = require( '../../resources/ext.nearby.scripts/App.vue' );
const locationProvider = require( '../../resources/ext.nearby.scripts/locationProvider.js' );
const api = require( '../../resources/ext.nearby.scripts/api.js' );
const Card = require( '../../resources/ext.nearby.scripts/Card.vue' );
const Button = require( '../../resources/ext.nearby.scripts/Button.vue' );
const ErrorBox = require( '../../resources/ext.nearby.scripts/Errorbox.vue' );

/**
 * @param {Wrapper} app to click the button
 * @param {Promise} getCurrentPositionResult return value
 * @param {Promise} [getPagesAtCoordinatesResult] return value
 * @return {Promise}
 */
function userClickShowNearbyPages(
	app, getCurrentPositionResult, getPagesAtCoordinatesResult
) {
	locationProvider.getCurrentPosition = jest.fn(
		() => getCurrentPositionResult
	);
	api.getPagesAtCoordinates = getPagesAtCoordinatesResult ? jest.fn(
		() => getPagesAtCoordinatesResult
	) : jest.fn( () => ( { then: jest.fn() } ) );

	return Promise.all( [
		app.findComponent( Button ).trigger( 'click' ),
		getCurrentPositionResult,
		getPagesAtCoordinatesResult || Promise.resolve()
	] ).catch( () => Promise.resolve() );
}

describe( 'App', () => {
	describe( 'At start up', () => {

		it( 'renders a splash screen without errors', () => {
			const app = VueTestUtils.mount( App );

			expect(
				app.classes()
			).toContain( 'mw-vue-nearby' );
			expect(
				app.find( '.mw-vue-nearby__image' ).exists()
			).toBe( true );
			expect(
				app.findComponent( ErrorBox ).exists()
			).toBe( false );
		} );

		it( 'registers two routes', () => {
			const addRoute = jest.fn();
			require( './fakes/router' ).addRoute = addRoute;
			VueTestUtils.mount( App );

			expect(
				addRoute
			).toHaveBeenCalledTimes( 2 );
		} );
	} );

	describe( 'On button click', () => {
		let navigateTo = jest.fn();
		beforeEach( () => {
			global.mw.msg = jest.fn( key => key );
			require( './fakes/router' ).navigateTo = navigateTo;
		} );

		it( 'it errors if geolocation fails', () => {
			const TEST_CASES = [
				[
					locationProvider.ERROR_SERVICE_UNAVAILABLE,
					'nearby-pages-location-unavailable'
				],
				[
					locationProvider.ERROR_PERMISSION_DENIED,
					'nearby-pages-permission-denied'
				],
				[
					locationProvider.ERROR_TIMEOUT,
					'nearby-pages-permission-denied'
				],
				[
					locationProvider.ERROR_POSITION_UNAVAILABLE,
					'nearby-pages-permission-denied'
				],
				[
					null,
					'nearby-pages-permission-denied'
				]
			];
			Promise.all(
				TEST_CASES.map( ( test ) => {
					const promise = Promise.reject( test[ 0 ] );
					const app = VueTestUtils.mount( App );
					return userClickShowNearbyPages( app, promise ).then( () => {
						const errorbox = app.findComponent( ErrorBox );
						return {
							exists: errorbox && errorbox.exists(),
							text: errorbox.text(),
							expectedText: test[ 1 ]
						};
					} );
				} )
			).then( ( results ) => {
				results.forEach( ( result ) => {
					expect( result.exists ).toBe( true );
					expect( results.text ).toBe( results.expectedText );
				} );
			} );
		} );

		it( 'if geolocation available it changes the route and renders 50 placeholders', () => {
			const getCurrentPositionResult = Promise.resolve( {
				latitude: 4,
				longitude: 5
			} );
			// api that doesn't resolve
			api.getPagesNearbyPage = jest.fn();
			const app = VueTestUtils.mount( App );
			userClickShowNearbyPages( app, getCurrentPositionResult )
				.then( () => {
					expect( navigateTo ).toHaveBeenCalledWith(
						null,
						{
							path: '#/coord/4,5',
							useReplaceState: true
						}
					);
					expect(
						app.findAllComponents( Card ).length
					).toBe( 50 );
				} );
		} );

		it( 'Shows an error when API rejects', () => {
			const getPagesAtCoordinatesResult = Promise.reject();

			const app = VueTestUtils.mount( App );
			userClickShowNearbyPages(
				app,
				Promise.resolve( {
					latitude: 5, longitude: 4
				} ),
				getPagesAtCoordinatesResult
			).then( null, () => {
				expect(
					app.findComponent( ErrorBox ).text()
				).toBe( 'nearby-pages-error' );
			} );
		} );

		it( 'Shows pages on clicking random', () => {
			// Mock 'NearbyRandomButton'
			mw.config.get = jest.fn( () => true );
			const randomLocationResult = Promise.resolve( {
				latitude: 9,
				longitude: 10
			} );
			locationProvider.getRandomLocation = jest.fn(
				() => randomLocationResult
			);
			const getPagesAtCoordinatesResult = Promise.resolve( {
				pages: [
					{
						title: 'A',
						description: 'B'
					}
				]
			} );
			api.getPagesAtCoordinates = jest.fn(
				() => getPagesAtCoordinatesResult
			);

			const app = VueTestUtils.mount( App );
			return app.findAllComponents( Button ).at( 1 )
				.trigger( 'click' )
				.then( () => {
					return randomLocationResult.then( () => {
						return getPagesAtCoordinatesResult.then( () => {
							return Vue.nextTick( () => {
								expect(
									app.findAllComponents( Card ).length
								).toBe( 1 );
							} );
						} );
					} );
				} );
		} );

		it( 'renders an error when no results', () => {
			const app = VueTestUtils.mount( App );
			userClickShowNearbyPages(
				app,
				Promise.resolve( { latitude: 0, longitude: 0 } ),
				Promise.resolve( { pages: [] } )
			).then( () => {
				expect(
					app.findComponent( ErrorBox ).text()
				).toBe( 'nearby-pages-noresults' );
			} );
		} );
	} );
} );
