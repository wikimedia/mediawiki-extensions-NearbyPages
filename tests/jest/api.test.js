const api = require( '../../resources/ext.nearby.scripts/api.js' );

let apiMock;

describe( 'api.js', () => {
	describe( 'getPagesAtCoordinates', () => {

		beforeEach( () => {
			apiMock = jest.fn( () =>
				Promise.resolve(
					require( './fixtures/geosearch.json' )
				)
			);

			global.mw.config.get = jest.fn( key => `config:${key}` );
		} );

		it( 'Works with empty response', () => {
			global.$.ajax = jest.fn( () => Promise.resolve( {} ) );
			api.getPagesAtCoordinates( '1.0', '9.5', {} ).then( ( result ) => {
				expect( result ).toStrictEqual( [] );
			} );
		} );

		it( 'Is compatible with vanilla mediawiki api', () => {
			global.$.ajax = apiMock;
			api.getPagesAtCoordinates( '1.0', '9.5', {
				range: 500,
				language: 'fr'
			} );
			expect( apiMock.mock.calls[ 0 ][ 0 ].data ).toStrictEqual( {
				wbptterms: undefined,
				action: 'query',
				format: 'json',
				origin: '*',
				formatversion: 2,
				prop: [
					'coordinates', 'pageprops', 'pageimages', 'description'
				].join( '|' ),
				colimit: 'max',
				generator: 'geosearch',
				ggsradius: 500,
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
				wbptterms: [
					'label',
					'description'
				].join( '|' ),
				action: 'query',
				format: 'json',
				origin: '*',
				formatversion: 2,
				prop: [
					'coordinates', 'pageprops', 'pageimages', 'description',
					'pageterms', 'description'
				].join( '|' ),
				colimit: 'max',
				generator: 'geosearch',
				ggsradius: 10000,
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
	} );

	describe( 'toCard', () => {
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
					terms: {
						description: [ 'desc' ],
						label: [ 'label' ]
					}
				} )
			).toStrictEqual( {
				description: 'desc',
				thumbnail: undefined,
				title: 'label',
				url: '#/wiki/Q1'
			} );
		} );

		it( 'can resolve wikidata terms without a label', () => {
			expect(
				api.test.toCard( {
					title: 'Q1',
					terms: {
						description: [ 'desc' ]
					}
				} )
			).toStrictEqual( {
				description: 'desc',
				thumbnail: undefined,
				title: 'Q1',
				url: undefined
			} );
		} );
	} );
} );
