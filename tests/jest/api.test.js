const api = require( '../../resources/ext.nearby.scripts/api.js' );
const MSG_KM = 'nearby-pages-distance';
const MSG_M = 'nearby-pages-distance-meters';
let mockFn;

let apiMock;

describe( 'api.js', () => {
	describe( 'getRandomPages', () => {
		beforeEach( () => {
			apiMock = jest.fn( () =>
				Promise.resolve(
					require( './fixtures/random.json' )
				)
			);
		} );

		it( 'Gets a random location', () => {
			global.$.ajax = apiMock;
			return api.getRandomPages().then( ( result ) => {
				expect( result.length ).toBe( 100 );
			} );
		} );
	} );

	describe( 'getPagesAtCoordinates', () => {

		beforeEach( () => {
			apiMock = jest.fn( () =>
				Promise.resolve(
					require( './fixtures/geosearch.json' )
				)
			);

			global.mw.config.get = jest.fn( ( key ) => `config:${key}` );
		} );

		it( 'Works with empty response', () => {
			global.$.ajax = jest.fn( () => Promise.resolve( {} ) );
			api.getPagesAtCoordinates( '1.0', '9.5', {} ).then( ( result ) => {
				expect( result.pages ).toStrictEqual( [] );
			} );
		} );

		it( 'Sorts by distance', () => {
			global.$.ajax = jest.fn( () => Promise.resolve(
				require( './fixtures/geosearchResults.json' )
			) );
			api.getPagesAtCoordinates( '1.0', '9.5', {} ).then( ( result ) => {
				expect( result.pages[ 0 ].title ).toStrictEqual( 'Something' );
				expect( result.pages[ 1 ].title ).toStrictEqual( 'Soul' );
				expect( result.pages[ 5 ].title ).toStrictEqual( 'Capital' );
			} );
		} );

		it( 'Is compatible with vanilla mediawiki api', () => {
			global.$.ajax = apiMock;
			api.getPagesAtCoordinates( '1.0', '9.5', {
				range: 500,
				language: 'fr'
			} );
			expect( apiMock.mock.calls[ 0 ][ 0 ].data ).toStrictEqual( {
				wbetterms: undefined,
				action: 'query',
				format: 'json',
				origin: '*',
				formatversion: 2,
				prop: [
					'coordinates', 'pageprops', 'pageimages', 'description', 'info', 'pageterms'
				].join( '|' ),
				colimit: 'max',
				generator: 'geosearch',
				ggsradius: 500,
				inprop: 'url',
				ggsnamespace: '0',
				ggslimit: 50,
				// T253215
				redirects: 'no',
				// T117159
				uselang: 'fr',
				ggscoord: '1.0|9.5',
				ppprop: 'displaytitle',
				piprop: 'thumbnail',
				pithumbsize: 150,
				pilimit: 50,
				codistancefrompoint: '1.0|9.5'
			} );
		} );

		it( 'Is compatible with wikidata mediawiki api', () => {
			global.$.ajax = apiMock;
			api.getPagesAtCoordinates( '1.0', '9.5', {
				namespaces: [ 5 ],
				wikidata: true
			} );
			expect( apiMock.mock.calls[ 0 ][ 0 ].data ).toStrictEqual( {
				wbetterms: [
					'label',
					'description'
				].join( '|' ),
				action: 'query',
				format: 'json',
				origin: '*',
				formatversion: 2,
				prop: [
					'coordinates', 'pageprops', 'pageimages', 'description',
					'info',
					'entityterms'
				].join( '|' ),
				colimit: 'max',
				generator: 'geosearch',
				ggsradius: 10000,
				inprop: 'url',
				ggsnamespace: '5',
				ggslimit: 50,
				// T253215
				redirects: 'no',
				// T117159
				uselang: 'en',
				ggscoord: '1.0|9.5',
				ppprop: 'displaytitle',
				piprop: 'thumbnail',
				pithumbsize: 150,
				pilimit: 50,
				codistancefrompoint: '1.0|9.5'
			} );
		} );

		it( 'can search by pages', () => {
			global.$.ajax = apiMock;
			api.getPagesNearbyPage( 'Spain', {
				namespaces: [ 5 ],
				wikidata: true
			} );
			const data = apiMock.mock.calls[ 0 ][ 0 ].data;
			expect( data.ggspage ).toBe( 'Spain' );
			expect( data.codistancefrompage ).toBe( 'Spain' );
		} );
	} );

	describe( 'toCard', () => {

		beforeEach( () => {
			mockFn = jest.fn();
			global.mw.msg = mockFn;
			mockFn.mockReturnValue( '1km' );
		} );

		it( 'can resolve without wikidata terms', () => {
			expect(
				api.test.toCard( {
					title: 'Foo',
					description: 'text',
					thumbnail: {
						source: 'source.gif'
					}
				} )
			).toStrictEqual( {
				url: undefined,
				description: 'text',
				geoURI: undefined,
				id: 'Foo',
				proximity: undefined,
				thumbnail: {
					source: 'source.gif'
				},
				title: 'Foo'
			} );
		} );

		it( 'can resolve wikidata terms', () => {
			expect(
				api.test.toCard( {
					title: 'Q1',
					fullurl: '/wiki/Q1',
					entityterms: {
						description: [ 'desc' ],
						label: [ 'label' ]
					}
				} )
			).toStrictEqual( {
				description: 'desc',
				geoURI: undefined,
				id: 'Q1',
				proximity: undefined,
				thumbnail: undefined,
				title: 'label',
				url: '/wiki/Q1'
			} );
		} );

		it( 'can resolve wikidata terms without a label', () => {
			expect(
				api.test.toCard( {
					title: 'Q1',
					entityterms: {
						description: [ 'desc' ]
					}
				} )
			).toStrictEqual( {
				description: 'desc',
				geoURI: undefined,
				id: 'Q1',
				proximity: undefined,
				thumbnail: undefined,
				title: 'Q1',
				url: undefined
			} );
		} );

		it( 'includes distance in description', () => {
			expect(
				api.test.toCard( {
					title: 'MOMA',
					description: 'desc',
					coordinates: [
						{
							lat: 37.7858,
							lon: -122.4008,
							dist: 1000
						}
					]
				} )
			).toStrictEqual( {
				description: 'desc',
				geoURI: 'geo:37.7858,-122.4008',
				id: 'MOMA',
				proximity: '1km',
				thumbnail: undefined,
				title: 'MOMA',
				url: undefined
			} );
		} );
	} );

	describe( 'getDistanceMessage', () => {

		beforeEach( () => {
			mockFn = jest.fn();
			global.mw.msg = mockFn;
		} );

		it( 'does meters', () => {
			api.test.getDistanceMessage( 0.9 );
			expect( mockFn ).toHaveBeenCalledWith( MSG_M, 900 );
		} );

		it( 'but rounds up', () => {
			api.test.getDistanceMessage( 0.9999999 );
			expect( mockFn ).toHaveBeenCalledWith( MSG_KM, '1' );
		} );

		it( 'can do km', () => {
			api.test.getDistanceMessage( 5 );
			expect( mockFn ).toHaveBeenCalledWith( MSG_KM, '5.0' );
		} );

		it( 'and does not use too many decimals', () => {
			api.test.getDistanceMessage( 5.5555553 );
			expect( mockFn ).toHaveBeenCalledWith( MSG_KM, '5.6' );
		} );

	} );

} );
