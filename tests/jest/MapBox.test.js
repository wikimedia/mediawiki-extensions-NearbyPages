const VueTestUtils = require( '@vue/test-utils' );
const MapBox = require( '../../resources/ext.nearby.scripts/MapBox.vue' );

describe( 'MapBox', () => {
	beforeEach( () => {
		global.L = {
			map: jest.fn( () => {
				return {
					on: jest.fn()
				};
			} ),
			tileLayer: jest.fn( () => {
				return {
					addTo: jest.fn()
				};
			} )
		};
		mw.loader.using = jest.fn( () => Promise.resolve() );
	} );

	it( 'Using a MapBox pulls down async code', () => {
		VueTestUtils.mount( MapBox, {
			propsData: {
				latitude: 5,
				longitude: 5
			}
		} );

		expect( mw.loader.using ).toHaveBeenCalledWith( 'mapbox' );
	} );
} );
