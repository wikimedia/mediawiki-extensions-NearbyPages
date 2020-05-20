const VueTestUtils = require( '@vue/test-utils' );
const Card = require( '../../resources/ext.nearby.scripts/Card.vue' );

describe( 'Card', () => {

	it( 'renders with thumbnails and without URIS', () => {
		const card = VueTestUtils.mount( Card, {
			propsData: {
				title: 'Hello',
				thumbnail: {
					source: 'kitten.gif'
				},
				description: 'A nice greeting'
			}
		} );

		expect(
			card.find( '.mw-vue-card__thumb' )
				.attributes( 'style' )
		).toBe( 'background-image: url(kitten.gif);' );

		expect(
			card.find( 'a' )
				.attributes( 'href' )
		).toBe( '#/wiki/Hello' );
	} );

	it( 'renders without thumbnails and with URIs', () => {
		const card = VueTestUtils.mount( Card, {
			propsData: {
				title: 'Hello',
				description: 'A nice greeting',
				url: '/wikiiiiii.html'
			}
		} );

		expect(
			card.find( '.mw-vue-card__thumb' )
				.attributes( 'style' )
		).toBe( undefined );
		expect(
			card.find( 'a' )
				.attributes( 'href' )
		).toBe( '/wikiiiiii.html' );
	} );

	it( 'renders blank without link if needed', () => {
		const card = VueTestUtils.mount( Card, {
			propsData: {
				title: ''
			}
		} );

		expect(
			card.find( 'a' ).exists()
		).toBe( false );
	} );
} );
